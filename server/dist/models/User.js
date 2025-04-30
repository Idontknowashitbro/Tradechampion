"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
// User model
class User extends sequelize_1.Model {
    // Method to compare password
    async validatePassword(password) {
        return bcryptjs_1.default.compare(password, this.password);
    }
    // Method to get cTrader data as object
    getCtraderData() {
        if (!this.ctrader) {
            return {
                isConnected: false,
                accounts: []
            };
        }
        if (typeof this.ctrader === 'string') {
            try {
                return JSON.parse(this.ctrader);
            }
            catch (e) {
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
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    discordUsername: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    walletBalance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    cryptoAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    preferredCryptoCurrency: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'btc',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'banned', 'pending'),
        defaultValue: 'active',
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    ctrader: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({
            isConnected: false,
            accounts: []
        }),
        get() {
            const rawValue = this.getDataValue('ctrader');
            if (!rawValue)
                return null;
            // Return as is (may be string or already parsed)
            return rawValue;
        },
        set(value) {
            if (typeof value === 'object') {
                this.setDataValue('ctrader', JSON.stringify(value));
            }
            else {
                this.setDataValue('ctrader', value);
            }
        }
    },
}, {
    sequelize: database_1.default,
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            // Hash the password before creating the user
            if (user.password) {
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            // Hash the password before updating if it changed
            if (user.changed('password')) {
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(user.password, salt);
            }
        },
    },
});
exports.default = User;
//# sourceMappingURL=User.js.map