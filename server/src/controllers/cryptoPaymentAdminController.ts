import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { CryptoPayment, User } from '../models';
import nowPaymentsService from '../services/nowPaymentsService';

/**
 * Get all crypto payments with filtering and pagination
 * @route GET /api/admin/crypto/payments
 */
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const status = req.query.status as string;
    const userId = req.query.userId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.createdAt = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      where.createdAt = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // Get payments with pagination
    const { count, rows: payments } = await CryptoPayment.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      payments,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching crypto payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

/**
 * Get payment by ID
 * @route GET /api/admin/crypto/payments/:id
 */
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find payment by ID
    const payment = await CryptoPayment.findOne({
      where: { paymentId: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ message: 'Failed to fetch payment' });
  }
};

/**
 * Refresh payment status from NOWPayments API
 * @route POST /api/admin/crypto/payments/:id/refresh
 */
export const refreshPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find payment in database
    const payment = await CryptoPayment.findOne({
      where: { paymentId: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Get latest status from NOWPayments API
    try {
      const paymentStatus = await nowPaymentsService.getPaymentStatus(id);
      
      // Update payment status in our database if changed
      if (payment.status !== paymentStatus.payment_status) {
        payment.status = paymentStatus.payment_status as any;
        
        // If actual amount paid is available, update it
        if (paymentStatus.amount_received) {
          payment.actualCryptoAmount = paymentStatus.amount_received;
        }
        
        await payment.save();
      }
      
      res.json({
        ...payment.toJSON(),
        remote_status: paymentStatus.payment_status,
        amount_received: paymentStatus.amount_received
      });
    } catch (apiError) {
      // If API call fails, return local status and error
      console.error('Error fetching payment status from NOWPayments:', apiError);
      res.status(500).json({ 
        ...payment.toJSON(),
        error: 'Unable to fetch latest status from payment provider' 
      });
    }
  } catch (error) {
    console.error('Error refreshing payment status:', error);
    res.status(500).json({ message: 'Failed to refresh payment status' });
  }
};

/**
 * Refund a payment (if possible)
 * @route POST /api/admin/crypto/payments/:id/refund
 */
export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find payment in database
    const payment = await CryptoPayment.findOne({
      where: { paymentId: id }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if payment can be refunded
    if (payment.status !== 'finished') {
      return res.status(400).json({ 
        message: 'Only finished payments can be refunded',
        current_status: payment.status 
      });
    }
    
    // In real implementation, this would call the NOWPayments API to request a refund
    // This is a placeholder for demonstration purposes
    try {
      // Simulate refund process
      // In production, this would be an actual API call to NOWPayments
      const refundResponse = {
        refund_id: `refund_${Date.now()}`,
        status: 'processing'
      };
      
      // Update payment status to refunded
      payment.status = 'refunded' as any;
      await payment.save();
      
      res.json({
        ...payment.toJSON(),
        refund: refundResponse
      });
    } catch (apiError: any) {
      console.error('Error refunding payment:', apiError);
      res.status(500).json({ 
        message: 'Failed to process refund',
        error: apiError.message || 'Unknown error' 
      });
    }
  } catch (error) {
    console.error('Error handling refund:', error);
    res.status(500).json({ message: 'Failed to process refund request' });
  }
}; 