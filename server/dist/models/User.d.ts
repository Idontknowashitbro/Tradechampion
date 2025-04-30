import { Model, Optional } from 'sequelize';
interface CTraderAccount {
    accountId: string;
    accountNumber: string;
    broker: string;
    accountType: 'demo' | 'live';
    balance: number;
    currency: string;
}
interface CTraderCredentials {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: Date | string | null;
    isConnected: boolean;
    accounts: CTraderAccount[];
}
interface UserAttributes {
    id: string;
    email: string;
    password: string;
    name: string;
    discordUsername?: string;
    walletBalance: number;
    cryptoAddress?: string;
    preferredCryptoCurrency?: string;
    status: 'active' | 'banned' | 'pending';
    role?: 'user' | 'admin';
    ctrader?: CTraderCredentials | string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'walletBalance' | 'status' | 'role' | 'ctrader' | 'preferredCryptoCurrency'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    email: string;
    password: string;
    name: string;
    discordUsername?: string;
    walletBalance: number;
    cryptoAddress?: string;
    preferredCryptoCurrency?: string;
    status: 'active' | 'banned' | 'pending';
    role?: 'user' | 'admin';
    ctrader?: CTraderCredentials | string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    validatePassword(password: string): Promise<boolean>;
    getCtraderData(): CTraderCredentials;
}
export default User;
