import { Request, Response } from 'express';
import { WalletTransaction, User, Challenge } from '../models';
import { socketService } from '../index';
import { Op, WhereOptions } from 'sequelize';

/**
 * Get wallet transactions for the current user
 * @route GET /api/wallet/transactions
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get transactions with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await WalletTransaction.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Challenge,
          as: 'challenge',
          attributes: ['id', 'name', 'type'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Calculate available balance (non-expired credits)
    // Find transactions with no expiry date or future expiry
    const availableTransactions = await WalletTransaction.findAll({
      where: {
        userId,
        [Op.or]: [
          { expiryDate: undefined },
          { expiryDate: { [Op.gt]: new Date() } }
        ]
      } as WhereOptions<any>,
      attributes: ['amount']
    });

    const availableBalance = availableTransactions.reduce(
      (sum, transaction) => sum + parseFloat(transaction.amount.toString()), 
      0
    );

    res.json({
      transactions,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      availableBalance
    });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Pay for a challenge entry using wallet credits
 * @route POST /api/wallet/pay
 */
export const payWithWallet = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate required fields
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }

    // Find the challenge
    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Get the entry fee
    const entryFee = challenge.entryFee;

    // Check if user has enough non-expired credits
    const availableTransactions = await WalletTransaction.findAll({
      where: {
        userId,
        [Op.or]: [
          { expiryDate: undefined },
          { expiryDate: { [Op.gt]: new Date() } }
        ]
      } as WhereOptions<any>,
      order: [
        ['expiryDate', 'ASC'], // Use credits that expire first
        ['createdAt', 'ASC']
      ]
    });

    const availableBalance = availableTransactions.reduce(
      (sum, transaction) => sum + parseFloat(transaction.amount.toString()), 
      0
    );

    if (availableBalance < entryFee) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        availableBalance,
        requiredAmount: entryFee 
      });
    }

    // Create a transaction for the challenge entry fee
    const transaction = await WalletTransaction.create({
      userId,
      amount: -entryFee, // Negative amount for deductions
      type: 'challenge_entry',
      reason: `Entry fee for ${challenge.name}`,
      challengeId
    });

    // Find the user to get updated balance
    const user = await User.findByPk(userId);

    // Notify user about the transaction
    if (socketService) {
      try {
        socketService.to(userId.toString()).emit('notification', {
          title: 'Challenge Entry Fee',
          message: `${entryFee} credits have been deducted for your entry into ${challenge.name}`,
          type: 'payment'
        });
      } catch (socketError) {
        console.error('Socket notification error:', socketError);
      }
    }

    res.status(201).json({
      message: 'Payment successful',
      transaction,
      newBalance: user?.walletBalance
    });
  } catch (error) {
    console.error('Error processing wallet payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Check for expired wallet credits and handle them
 * This should be called by a scheduled job
 */
export const handleExpiredCredits = async () => {
  try {
    // Find expired transactions
    const expiredTransactions = await WalletTransaction.findAll({
      where: {
        expiryDate: { [Op.lt]: new Date() },
        type: { [Op.ne]: 'expiry' } // Exclude already processed expiry records
      },
      include: [{ model: User, as: 'user' }]
    });

    // Process each expired transaction
    for (const transaction of expiredTransactions) {
      // Create a new transaction to record the expiry
      await WalletTransaction.create({
        userId: transaction.userId,
        amount: -parseFloat(transaction.amount.toString()), // Reverse the amount
        type: 'expiry',
        reason: `Credits expired from transaction #${transaction.id}`,
        expiryDate: undefined
      });

      // Notify the user about the expiry
      if (socketService) {
        try {
          socketService.to(transaction.userId.toString()).emit('notification', {
            title: 'Credits Expired',
            message: `${transaction.amount} credits have expired from your wallet`,
            type: 'payment'
          });
        } catch (socketError) {
          console.error('Socket notification error:', socketError);
        }
      }
    }

    return {
      processedCount: expiredTransactions.length,
      success: true
    };
  } catch (error) {
    console.error('Error handling expired credits:', error);
    return {
      processedCount: 0,
      success: false,
      error: (error as Error).message
    };
  }
}; 