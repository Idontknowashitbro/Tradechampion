import { Op } from 'sequelize';
import ChallengeEntry from '../models/ChallengeEntry';
import Challenge from '../models/Challenge';
import Trade from '../models/Trade';

interface RuleViolation {
  rule: string;
  description: string;
  timestamp: Date;
  value: number | string;
  limit: number | string;
}

interface ValidationResult {
  isValid: boolean;
  violations: RuleViolation[];
}

/**
 * Service for validating challenge rules
 */
class ChallengeRulesService {
  /**
   * Check if a challenge entry violates any rules
   * @param challengeEntryId Challenge entry ID
   */
  public async validateRules(challengeEntryId: number): Promise<ValidationResult> {
    try {
      // Get challenge entry with challenge rules
      const entry = await ChallengeEntry.findByPk(challengeEntryId, {
        include: ['challenge']
      });

      if (!entry || !entry.challenge) {
        throw new Error('Challenge entry or challenge not found');
      }

      const challenge = entry.challenge;
      const violations: RuleViolation[] = [];

      // Get all trades for this entry
      const trades = await Trade.findAll({
        where: { challengeEntryId },
        order: [['entryTime', 'ASC']]
      });

      // Check max drawdown
      const maxDrawdownResult = await this.checkMaxDrawdown(entry, trades);
      if (!maxDrawdownResult.isValid) {
        violations.push(...maxDrawdownResult.violations);
      }

      // Check daily drawdown (for weekly and monthly challenges)
      if (['weekly', 'monthly'].includes(challenge.type)) {
        const dailyDrawdownResult = await this.checkDailyDrawdown(entry, trades);
        if (!dailyDrawdownResult.isValid) {
          violations.push(...dailyDrawdownResult.violations);
        }
      }

      // Check max risk per trade
      const riskPerTradeResult = await this.checkMaxRiskPerTrade(entry, trades);
      if (!riskPerTradeResult.isValid) {
        violations.push(...riskPerTradeResult.violations);
      }

      // Check min trade requirements
      const minTradesResult = await this.checkMinTradeRequirements(entry, trades);
      if (!minTradesResult.isValid) {
        violations.push(...minTradesResult.violations);
      }

      // Check min trade duration (anti-scalping)
      const tradeDurationResult = await this.checkMinTradeDuration(entry, trades);
      if (!tradeDurationResult.isValid) {
        violations.push(...tradeDurationResult.violations);
      }

      // Check for hedging
      const hedgingResult = await this.checkForHedging(entry, trades);
      if (!hedgingResult.isValid) {
        violations.push(...hedgingResult.violations);
      }

      // Check trading day requirements
      const tradingDaysResult = await this.checkTradingDays(entry, trades);
      if (!tradingDaysResult.isValid) {
        violations.push(...tradingDaysResult.violations);
      }

      // Check swing trading requirements (for weekly and monthly)
      if (['weekly', 'monthly'].includes(challenge.type)) {
        const swingTradingResult = await this.checkSwingTradingRequirement(entry, trades);
        if (!swingTradingResult.isValid) {
          violations.push(...swingTradingResult.violations);
        }
      }

      // Check consistency rule
      const consistencyResult = await this.checkConsistencyRule(entry, trades);
      if (!consistencyResult.isValid) {
        violations.push(...consistencyResult.violations);
      }

      return {
        isValid: violations.length === 0,
        violations
      };
    } catch (error) {
      console.error('Error validating challenge rules:', error);
      throw error;
    }
  }

  /**
   * Check if the maximum drawdown has been exceeded
   */
  private async checkMaxDrawdown(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If no challenge or no metrics yet, no violations
    if (!challenge || !entry.metrics || trades.length === 0) {
      return { isValid: true, violations };
    }

    const maxDrawdown = challenge.maxDrawdown;
    const currentDrawdown = entry.metrics.drawdownPercentage;

    if (currentDrawdown > maxDrawdown) {
      violations.push({
        rule: 'maxDrawdown',
        description: `Maximum drawdown of ${maxDrawdown}% exceeded`,
        timestamp: new Date(),
        value: currentDrawdown,
        limit: maxDrawdown
      });
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check if the daily drawdown has been exceeded
   */
  private async checkDailyDrawdown(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If no challenge or not enough trades, no violations
    if (!challenge || trades.length < 2) {
      return { isValid: true, violations };
    }

    const maxDailyDrawdown = challenge.maxDailyDrawdown;
    if (!maxDailyDrawdown) {
      return { isValid: true, violations }; // No daily drawdown rule
    }

    // Group trades by day
    const tradesByDay = this.groupTradesByDay(trades);

    // Check drawdown for each day
    for (const [day, dayTrades] of Object.entries(tradesByDay)) {
      const initialBalance = challenge.initialBalance;
      let highestBalance = initialBalance;
      let currentBalance = initialBalance;
      let maxDailyDrawdownPct = 0;

      // Calculate daily PnL and drawdown
      for (const trade of dayTrades) {
        currentBalance += trade.pnl;
        
        if (currentBalance > highestBalance) {
          highestBalance = currentBalance;
        }
        
        const currentDrawdownPct = ((highestBalance - currentBalance) / highestBalance) * 100;
        if (currentDrawdownPct > maxDailyDrawdownPct) {
          maxDailyDrawdownPct = currentDrawdownPct;
        }
      }

      if (maxDailyDrawdownPct > maxDailyDrawdown) {
        violations.push({
          rule: 'maxDailyDrawdown',
          description: `Daily drawdown of ${maxDailyDrawdown}% exceeded on ${day}`,
          timestamp: new Date(day),
          value: maxDailyDrawdownPct,
          limit: maxDailyDrawdown
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check if max risk per trade has been exceeded
   */
  private async checkMaxRiskPerTrade(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If no challenge or no trades, no violations
    if (!challenge || trades.length === 0) {
      return { isValid: true, violations };
    }

    const maxRiskPerTrade = challenge.maxRiskPerTrade;
    const initialBalance = challenge.initialBalance;

    for (const trade of trades) {
      // Calculate risk as potential loss relative to account size
      // Note: This is a simplified calculation and should be refined based on actual risk calculation methods
      const riskPct = (Math.abs(trade.pnl) / initialBalance) * 100;
      
      if (riskPct > maxRiskPerTrade) {
        violations.push({
          rule: 'maxRiskPerTrade',
          description: `Maximum risk per trade of ${maxRiskPerTrade}% exceeded`,
          timestamp: trade.entryTime,
          value: riskPct,
          limit: maxRiskPerTrade
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check minimum trade requirements
   */
  private async checkMinTradeRequirements(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If no challenge, no violations
    if (!challenge) {
      return { isValid: true, violations };
    }
    
    // If challenge has ended and min trades not met
    if (challenge.endDate && new Date() > new Date(challenge.endDate)) {
      const minTrades = challenge.minTrades || 0;
      
      if (trades.length < minTrades) {
        violations.push({
          rule: 'minTrades',
          description: `Minimum ${minTrades} trades requirement not met`,
          timestamp: new Date(),
          value: trades.length,
          limit: minTrades
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check minimum trade duration (anti-scalping)
   */
  private async checkMinTradeDuration(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If no challenge or no trades, no violations
    if (!challenge || trades.length === 0) {
      return { isValid: true, violations };
    }

    const minTradeDurationSeconds = (challenge.minTradeDuration || 2) * 60; // Convert minutes to seconds

    for (const trade of trades) {
      if (trade.duration < minTradeDurationSeconds) {
        violations.push({
          rule: 'minTradeDuration',
          description: `Minimum trade duration of ${challenge.minTradeDuration} minutes not met`,
          timestamp: trade.entryTime,
          value: trade.duration / 60, // Convert to minutes for display
          limit: challenge.minTradeDuration
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check for hedging (simultaneous buy/sell positions)
   */
  private async checkForHedging(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If no trades or hedging allowed, no violations
    if (trades.length === 0 || challenge.allowHedging) {
      return { isValid: true, violations };
    }

    // Group trades by symbol and check for overlapping time periods with opposite directions
    const tradesBySymbol: { [symbol: string]: Trade[] } = {};
    
    for (const trade of trades) {
      if (!tradesBySymbol[trade.symbol]) {
        tradesBySymbol[trade.symbol] = [];
      }
      tradesBySymbol[trade.symbol].push(trade);
    }

    for (const symbol in tradesBySymbol) {
      const symbolTrades = tradesBySymbol[symbol];
      
      for (let i = 0; i < symbolTrades.length; i++) {
        const trade1 = symbolTrades[i];
        
        for (let j = i + 1; j < symbolTrades.length; j++) {
          const trade2 = symbolTrades[j];
          
          // Check if trades overlap in time and have opposite directions
          if (this.tradesOverlap(trade1, trade2) && this.areOppositeDirections(trade1, trade2)) {
            violations.push({
              rule: 'noHedging',
              description: `Hedging detected for symbol ${symbol}`,
              timestamp: trade2.entryTime > trade1.entryTime ? trade2.entryTime : trade1.entryTime,
              value: `Trades ${trade1.id} and ${trade2.id}`,
              limit: 'No hedging allowed'
            });
          }
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check if trades overlap in time
   */
  private tradesOverlap(trade1: Trade, trade2: Trade): boolean {
    return (
      (trade1.entryTime <= trade2.exitTime && trade1.exitTime >= trade2.entryTime) ||
      (trade2.entryTime <= trade1.exitTime && trade2.exitTime >= trade1.entryTime)
    );
  }

  /**
   * Check if trades are in opposite directions
   */
  private areOppositeDirections(trade1: Trade, trade2: Trade): boolean {
    // Assuming positive PnL means long position, negative means short position
    // This is a simplification - in reality, needs to check actual position direction
    return (trade1.pnl > 0 && trade2.pnl < 0) || (trade1.pnl < 0 && trade2.pnl > 0);
  }

  /**
   * Check trading days requirements
   */
  private async checkTradingDays(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If challenge has ended and min trading days not met
    if (challenge.endDate && new Date() > new Date(challenge.endDate)) {
      const minTradingDays = challenge.minTradingDays || 0;
      
      if (minTradingDays > 0) {
        // Get unique trading days
        const uniqueDays = new Set<string>();
        
        for (const trade of trades) {
          uniqueDays.add(this.formatDateToYYYYMMDD(trade.entryTime));
        }
        
        if (uniqueDays.size < minTradingDays) {
          violations.push({
            rule: 'minTradingDays',
            description: `Minimum ${minTradingDays} trading days requirement not met`,
            timestamp: new Date(),
            value: uniqueDays.size,
            limit: minTradingDays
          });
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check swing trading requirement
   */
  private async checkSwingTradingRequirement(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If challenge has ended
    if (challenge.endDate && new Date() > new Date(challenge.endDate)) {
      const minSwingTrades = challenge.type === 'weekly' ? 1 : 3; // Weekly: 1, Monthly: 3
      const minSwingDays = 2; // Hold for at least 2 days
      
      // Count trades held for at least 2 days
      let swingTradeCount = 0;
      
      for (const trade of trades) {
        const durationDays = (trade.exitTime.getTime() - trade.entryTime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (durationDays >= minSwingDays) {
          swingTradeCount++;
        }
      }
      
      if (swingTradeCount < minSwingTrades) {
        violations.push({
          rule: 'swingTrading',
          description: `Minimum ${minSwingTrades} swing trades (held for ${minSwingDays}+ days) requirement not met`,
          timestamp: new Date(),
          value: swingTradeCount,
          limit: minSwingTrades
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Check consistency rule
   */
  private async checkConsistencyRule(entry: ChallengeEntry, trades: Trade[]): Promise<ValidationResult> {
    const violations: RuleViolation[] = [];
    const challenge = entry.challenge;
    
    // If no trades, no violations
    if (trades.length === 0) {
      return { isValid: true, violations };
    }

    // Calculate average lot size
    let totalLotSize = 0;
    for (const trade of trades) {
      totalLotSize += trade.lotSize;
    }
    const avgLotSize = totalLotSize / trades.length;

    if (challenge.type === 'weekly') {
      // Weekly challenge: Trades with <10% of average size may be excluded from min trade count
      const validTrades = trades.filter(trade => trade.lotSize >= avgLotSize * 0.1);
      
      if (validTrades.length < (challenge.minTrades || 3)) {
        violations.push({
          rule: 'consistencyRule',
          description: `Not enough trades with consistent lot size (≥10% of avg)`,
          timestamp: new Date(),
          value: validTrades.length,
          limit: challenge.minTrades || 3
        });
      }
    } else if (challenge.type === 'monthly') {
      // Monthly challenge: 60% of total profit must come from valid trades
      const minTradeDurationSeconds = (challenge.minTradeDuration || 2) * 60;
      const validTrades = trades.filter(
        trade => trade.lotSize >= avgLotSize * 0.1 && trade.duration >= minTradeDurationSeconds
      );
      
      // Calculate profit from valid trades
      let validTradeProfit = 0;
      let totalProfit = 0;
      
      for (const trade of validTrades) {
        if (trade.pnl > 0) {
          validTradeProfit += trade.pnl;
        }
      }
      
      for (const trade of trades) {
        if (trade.pnl > 0) {
          totalProfit += trade.pnl;
        }
      }
      
      // Only check if there's any profit
      if (totalProfit > 0) {
        const validProfitPercentage = (validTradeProfit / totalProfit) * 100;
        
        if (validProfitPercentage < 60) {
          violations.push({
            rule: 'consistencyRule',
            description: `Less than 60% of profit comes from valid trades`,
            timestamp: new Date(),
            value: validProfitPercentage,
            limit: 60
          });
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Helper method to format date to YYYY-MM-DD
   */
  private formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper method to group trades by day
   */
  private groupTradesByDay(trades: Trade[]): { [day: string]: Trade[] } {
    const tradesByDay: { [day: string]: Trade[] } = {};
    
    for (const trade of trades) {
      const day = this.formatDateToYYYYMMDD(trade.entryTime);
      
      if (!tradesByDay[day]) {
        tradesByDay[day] = [];
      }
      
      tradesByDay[day].push(trade);
    }
    
    return tradesByDay;
  }
}

export default new ChallengeRulesService(); 