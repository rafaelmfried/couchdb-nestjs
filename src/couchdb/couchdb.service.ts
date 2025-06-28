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

  private useDb<T>(name: string): nano.DocumentScope<T> {
    if (!this.connection) {
      throw new HttpException(
        'CouchDB connection not initialized',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.connection.db.use<T>(name);
  }

  async createDb(data: { name: string }): Promise<nano.DatabaseCreateResponse> {
    try {
      return await this.connection.db.create(data.name);
    } catch (error) {
      this.logger.error('Error creating CouchDB database:', error);
      throw error;
    }
  }

  async insertDocument<T extends nano.MaybeDocument>(data: {
    dbName: string;
    document: T;
  }): Promise<nano.DocumentInsertResponse> {
    try {
      const db = this.useDb<T>(data.dbName);
      return await db.insert(data.document);
    } catch (error) {
      this.logger.error('Error inserting document:', error);
      throw error;
    }
  }

  async getDocument<T>(data: { dbName: string; docId: string }): Promise<T> {
    const db = this.useDb<T>(data.dbName);
    return db.get(data.docId);
  }

  async getAllDocuments<T>(data: {
    dbName: string;
  }): Promise<nano.DocumentListResponse<T>> {
    const db = this.useDb<T>(data.dbName);
    return await db.list({ include_docs: true });
  }

  async deleteDocument(data: {
    dbName: string;
    docId: string;
  }): Promise<nano.DocumentDestroyResponse> {
    const db = this.useDb<{ _id: string; _rev: string }>(data.dbName);
    const doc = await db.get(data.docId);
    if (!doc._id || !doc._rev) {
      throw new HttpException(
        'Document not found or missing _id/_rev',
        HttpStatus.NOT_FOUND,
      );
    }
    return db.destroy(doc._id, doc._rev);
  }

  async updateDocument<T>(data: {
    dbName: string;
    document: T & { _id: string };
  }): Promise<nano.DocumentInsertResponse> {
    const db = this.useDb<T>(data.dbName);
    const existingDoc = await db.get(data.document._id);
    const updatedDoc = {
      ...existingDoc,
      ...data.document,
      _rev: existingDoc._rev,
    };
    return db.insert(updatedDoc);
  }

  async findDocumentBySelector<T>(data: {
    dbName: string;
    selector: Record<string, any>;
  }): Promise<nano.MangoResponse<T>> {
    const db = this.useDb<T>(data.dbName);
    return db.find({ selector: data.selector });
  }
}
