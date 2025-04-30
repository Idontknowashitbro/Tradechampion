import { Model, Optional } from 'sequelize';
import User from './User';
export type WalletType = 'btc' | 'eth' | 'usdt' | 'usdc' | 'other';
interface CryptoWalletAttributes {
    id: number;
    userId: string;
    walletType: WalletType;
    address: string;
    label: string;
    isDefault: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
interface CryptoWalletCreationAttributes extends Optional<CryptoWalletAttributes, 'id'> {
}
declare class CryptoWallet extends Model<CryptoWalletAttributes, CryptoWalletCreationAttributes> implements CryptoWalletAttributes {
    id: number;
    userId: string;
    walletType: WalletType;
    address: string;
    label: string;
    isDefault: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly user?: User;
}
export default CryptoWallet;
