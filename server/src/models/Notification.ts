import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

// Notification Types
export type NotificationType = 
  'system' | 
  'challenge' | 
  'payment' | 
  'connection' | 
  'achievement' | 
  'admin';

// Notification Channels
export type NotificationChannel = 
  'website' | 
  'discord' | 
  'both';

// Define notification attributes
interface NotificationAttributes {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  data: object;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for notification creation
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'data' | 'read'> {}

// Notification model
class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> 
  implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: string;
  public title!: string;
  public message!: string;
  public data!: object;
  public read!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Mark notification as read
  public async markAsRead(): Promise<void> {
    this.read = true;
    await this.save();
  }

  // Get formatted time since creation
  public getTimeSince(): string {
    const now = new Date();
    const createdAt = new Date(this.createdAt);
    const diff = now.getTime() - createdAt.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
}

// Initialize Notification model
Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
  }
);

export default Notification; 