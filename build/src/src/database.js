"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongodb_1 = require("mongodb");
const logger_1 = require("./logger");
const path = require("path");
/**
 * All the methods and properties mentioned in the following class is
 * specific to MongoDB. You should make necessary changes to support
 * the database you want to use.
 */
class Database {
    // mongodb+srv://uday:2h994BUYD4Z6i58g@cluster0.lwtdotm.mongodb.net/test
    constructor() {
        this.host = '127.0.0.1';
        this.password = process.env.DB_PWD || '';
        this.user = process.env.DB_USER || '';
        this.host = process.env.DB_HOST || '';
        this.dbName = process.env.DB_NAME || '';
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dbClient) {
                logger_1.default.debug('Connection already exists');
                return;
            }
            const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
            const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
            const connectionString = this.getConnectionString();
            logger_1.default.debug(`Database connection string: ${connectionString}`);
            const client = new mongodb_1.MongoClient(connectionString, {
                poolSize: 50,
                connectTimeoutMS: TWO_MINUTES_IN_MS,
                socketTimeoutMS: ONE_DAY_IN_MS,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            this.dbClient = yield client.connect();
            logger_1.default.info('Connected with database host');
            this.databaseInstance = this.dbClient.db(this.dbName);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dbClient.isConnected()) {
                logger_1.default.info(`Disconnected from ${this.host}/${this.dbName}`);
                yield this.dbClient.close();
            }
        });
    }
    /**
     * For MongoDB there is no table. It is called collection
     * If you are using SQL database then this should be something like getTable()
     *
     * @param name MongoDB Collection name
     */
    getCollection(name) {
        if (!this.databaseInstance) {
            throw new Error('Database not initialized');
        }
        return this.databaseInstance.collection(name);
    }
    /**
     * Build database connection string.
     * Customize as needed for your database.
     */
    getConnectionString() {
        const env = process.env.NODE_ENV;
        if (env === 'test' && !process.env.DB_NAME) {
            this.dbName += '_test';
        }
        if (env && this.user && this.password) {
            return `mongodb+srv://${this.user}:${this.password}@${this.host}/${this.dbName}?retryWrites=true&w=majority`;
        }
        if (env === 'test') {
            const testEnv = require('dotenv').config(path.resolve(__dirname, '../../.env.test'));
            logger_1.default.info(`Using test database ${JSON.stringify(testEnv)}`);
            this.password = process.env.DB_PWD || '';
            this.user = process.env.DB_USER || '';
            this.host = process.env.DB_HOST || '';
            this.dbName = process.env.DB_NAME || '';
            return `mongodb+srv://${this.user}:${this.password}@${this.host}/${this.dbName}?retryWrites=true&w=majority`;
        }
        return `mongodb+srv://${this.host}/${this.dbName}`;
    }
    getDbHost() {
        return this.host;
    }
    getDbPassword() {
        return this.password;
    }
    getDbUser() {
        return this.user;
    }
    getDbName() {
        return this.dbName;
    }
    isDbConnected() {
        return this.dbClient && this.dbClient.isConnected();
    }
}
exports.db = new Database();
exports.default = exports.db;
//# sourceMappingURL=database.js.map