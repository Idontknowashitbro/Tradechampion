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
declare class ChallengeRulesService {
    /**
     * Check if a challenge entry violates any rules
     * @param challengeEntryId Challenge entry ID
     */
    validateRules(challengeEntryId: number): Promise<ValidationResult>;
    /**
     * Check if the maximum drawdown has been exceeded
     */
    private checkMaxDrawdown;
    /**
     * Check if the daily drawdown has been exceeded
     */
    private checkDailyDrawdown;
    /**
     * Check if max risk per trade has been exceeded
     */
    private checkMaxRiskPerTrade;
    /**
     * Check minimum trade requirements
     */
    private checkMinTradeRequirements;
    /**
     * Check minimum trade duration (anti-scalping)
     */
    private checkMinTradeDuration;
    /**
     * Check for hedging (simultaneous buy/sell positions)
     */
    private checkForHedging;
    /**
     * Check if trades overlap in time
     */
    private tradesOverlap;
    /**
     * Check if trades are in opposite directions
     */
    private areOppositeDirections;
    /**
     * Check trading days requirements
     */
    private checkTradingDays;
    /**
     * Check swing trading requirement
     */
    private checkSwingTradingRequirement;
    /**
     * Check consistency rule
     */
    private checkConsistencyRule;
    /**
     * Helper method to format date to YYYY-MM-DD
     */
    private formatDateToYYYYMMDD;
    /**
     * Helper method to group trades by day
     */
    private groupTradesByDay;
}
declare const _default: ChallengeRulesService;
export default _default;
