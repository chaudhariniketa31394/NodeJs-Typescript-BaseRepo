import { MongoClient, Db, Collection } from 'mongodb';
import * as path from 'path';
import logger from './logger';

/**
 * All the methods and properties mentioned in the following class is
 * specific to MongoDB. You should make necessary changes to support
 * the database you want to use.
 */

class Database {
  private password: string;

  private user: string;

  private host: string = '127.0.0.1';

  private dbName: string;

  private dbClient: MongoClient;

  private databaseInstance: Db;

  // mongodb+srv://uday:2h994BUYD4Z6i58g@cluster0.lwtdotm.mongodb.net/test
  constructor() {
    this.password = process.env.DB_PWD || '';
    this.user = process.env.DB_USER || '';
    this.host = process.env.DB_HOST || '';
    this.dbName = process.env.DB_NAME || '';
  }

  public async connect(): Promise<void> {
    if (this.dbClient) {
      logger.debug('Connection already exists');
      return;
    }

    const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

    const connectionString = this.getConnectionString();

    logger.debug(`Database connection string: ${connectionString}`);

    const client = new MongoClient(connectionString, {
      poolSize: 50,
      connectTimeoutMS: TWO_MINUTES_IN_MS,
      socketTimeoutMS: ONE_DAY_IN_MS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.dbClient = await client.connect();
    logger.info('Connected with database host');

    this.databaseInstance = this.dbClient.db(this.dbName);
    }

  public async disconnect() {
    if (this.dbClient.isConnected()) {
      logger.info(`Disconnected from ${this.host}/${this.dbName}`);
      await this.dbClient.close();
    }
  }

  /**
   * For MongoDB there is no table. It is called collection
   * If you are using SQL database then this should be something like getTable()
   *
   * @param name MongoDB Collection name
   */
  public getCollection(name: string): Collection {
    if (!this.databaseInstance) {
      throw new Error('Database not initialized');
    }

    return this.databaseInstance.collection(name);
  }

  /**
   * Build database connection string.
   * Customize as needed for your database.
   */
  private getConnectionString() {
    const env = process.env.NODE_ENV;
    if (env === 'test' && !process.env.DB_NAME) {
      this.dbName += '_test';
    }

    if (env && this.user && this.password) {
      return `mongodb+srv://${this.user}:${this.password}@${this.host}/${this.dbName}?retryWrites=true&w=majority`;
    }

    if (env === 'test') {
      const testEnv = require('dotenv').config(path.resolve(__dirname, '../../.env.test'));
      logger.info(`Using test database ${JSON.stringify(testEnv)}`);
      
      this.password = process.env.DB_PWD || '';
      this.user = process.env.DB_USER || '';
      this.host = process.env.DB_HOST || '';
      this.dbName = process.env.DB_NAME || '';
      return `mongodb+srv://${this.user}:${this.password}@${this.host}/${this.dbName}?retryWrites=true&w=majority`;
    }
    return `mongodb+srv://${this.host}/${this.dbName}`;
  }

  public getDbHost() {
    return this.host;
  }

  public getDbPassword() {
    return this.password;
  }

  public getDbUser() {
    return this.user;
  }

  public getDbName() {
    return this.dbName;
  }

  public isDbConnected() {
    return this.dbClient && this.dbClient.isConnected();
  }
}

export const db = new Database();

export default db;
