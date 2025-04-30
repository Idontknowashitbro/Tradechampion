"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Database configuration
const DB_NAME = process.env.DB_NAME || 'tradechampionx';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
let sequelize;
// Use SQLite for local development and testing
if (DB_DIALECT === 'sqlite') {
    const dbPath = path_1.default.resolve(__dirname, '../../../database.sqlite');
    sequelize = new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
    });
    console.log(`Using SQLite database at: ${dbPath}`);
}
else {
    // Use other database for production
    sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASS, {
        host: DB_HOST,
        port: parseInt(DB_PORT, 10),
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}
// Test the database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
testConnection();
exports.default = sequelize;
//# sourceMappingURL=database.js.map