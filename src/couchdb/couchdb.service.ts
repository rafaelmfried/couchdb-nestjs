import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import * as nano from 'nano';
import { CouchDbConnectionFactory } from './couchdb-connection.factory';

@Injectable()
export class CouchdbService implements OnModuleInit {
  private readonly logger = new Logger(CouchdbService.name);
  private connection: nano.ServerScope;

  async onModuleInit() {
    this.connection = await CouchDbConnectionFactory.create({
      url: (process.env.COUCHDB_URL as string) || 'http://localhost:5984',
      username: (process.env.COUCHDB_USERNAME as string) || 'admin',
      password: (process.env.COUCHDB_PASSWORD as string) || 'admin',
    });
  }

  async createDb(data: { name: string }): Promise<nano.DatabaseCreateResponse> {
    try {
      if (!this.connection) {
        throw new HttpException(
          'CouchDB connection not initialized',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const db = this.connection.db.create(data.name);
      return db;
    } catch (error) {
      this.logger.error('Error checking CouchDB connection:', error);
      throw error;
    }
  }

  useDb(data: { name: string }): nano.DocumentScope<any> {
    try {
      if (!this.connection) {
        throw new HttpException(
          'CouchDB connection not initialized',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const db = this.connection.db.use(data.name);
      return db;
    } catch (error) {
      this.logger.error('Error using CouchDB database:', error);
      throw error;
    }
  }

  async insertDocument(
    db: nano.DocumentScope<any>,
    document: any,
  ): Promise<nano.DocumentInsertResponse> {
    try {
      const response = await db.insert(document);
      return response;
    } catch (error) {
      this.logger.error('Error inserting document into CouchDB:', error);
      throw error;
    }
  }
}
