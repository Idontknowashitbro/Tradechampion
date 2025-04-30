declare module 'cron' {
  export class CronJob {
    constructor(
      cronTime: string | Date,
      onTick: () => void,
      onComplete?: () => void,
      start?: boolean,
      timezone?: string,
      context?: any,
      runOnInit?: boolean,
      utcOffset?: number
    );
    
    start: () => void;
    stop: () => void;
    lastDate: () => Date;
    nextDates: (count: number) => Date[];
    fireOnTick: () => void;
  }
  
  export class CronTime {
    constructor(time: string | Date, timezone?: string, utcOffset?: number);
    
    sendAt: () => Date;
    sendAt: (offsetInMilliseconds: number) => Date;
    getTimeout: () => number;
  }
} 