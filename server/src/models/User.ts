import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';

// Define cTrader account interface
interface CTraderAccount {
  accountId: string;
  accountNumber: string;
  broker: string;
  accountType: 'demo' | 'live';
  balance: number;
  currency: string;
}

// Define cTrader credentials interface
interface CTraderCredentials {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date | string | null;
  isConnected: boolean;
  accounts: CTraderAccount[];
}

// Define user attributes
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

// Define attributes for user creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'walletBalance' | 'status' | 'role' | 'ctrader' | 'preferredCryptoCurrency'> {}

// User model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public discordUsername?: string;
  public walletBalance!: number;
  public cryptoAddress?: string;
  public preferredCryptoCurrency?: string;
  public status!: 'active' | 'banned' | 'pending';
  public role?: 'user' | 'admin';
  public ctrader?: CTraderCredentials | string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Method to compare password
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
  
  // Method to get cTrader data as object
  public getCtraderData(): CTraderCredentials {
    if (!this.ctrader) {
      return {
        isConnected: false,
        accounts: []
      };
    }
    
    if (typeof this.ctrader === 'string') {
      try {
        return JSON.parse(this.ctrader);
      } catch (e) {
        console.error('Error parsing cTrader data:', e);
        return {
          isConnected: false,
          accounts: []
        };
      }
    }
    
    return this.ctrader;
  }
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discordUsername: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    walletBalance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    cryptoAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferredCryptoCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'btc',
    },
    status: {
      type: DataTypes.ENUM('active', 'banned', 'pending'),
      defaultValue: 'active',
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    ctrader: {
      type: DataTypes.TEXT, // Change to TEXT to store serialized JSON string
      allowNull: true,
      defaultValue: JSON.stringify({
        isConnected: false,
        accounts: []
      }),
      get() {
        const rawValue = this.getDataValue('ctrader');
        if (!rawValue) return null;
        
        // Return as is (may be string or already parsed)
        return rawValue;
      },
      set(value: CTraderCredentials | string) {
        if (typeof value === 'object') {
          this.setDataValue('ctrader', JSON.stringify(value));
        } else {
          this.setDataValue('ctrader', value);
        }
      }
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        // Hash the password before creating the user
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        // Hash the password before updating if it changed
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User; 