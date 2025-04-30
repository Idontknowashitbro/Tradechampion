import { Model, Optional } from 'sequelize';
export type NotificationType = 'system' | 'challenge' | 'payment' | 'connection' | 'achievement' | 'admin';
export type NotificationChannel = 'website' | 'discord' | 'both';
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
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'data' | 'read'> {
}
declare class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    id: number;
    userId: number;
    type: string;
    title: string;
    message: string;
    data: object;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
    markAsRead(): Promise<void>;
    getTimeSince(): string;
}
export default Notification;
