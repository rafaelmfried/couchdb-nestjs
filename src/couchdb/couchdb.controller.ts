import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import * as nano from 'nano';
import { CouchdbService } from './couchdb.service';

@Controller('couchdb')
export class CouchdbController {
  private readonly logger = new Logger(CouchdbController.name);
  constructor(private readonly couchdbService: CouchdbService) {}

  @Get('check-connection')
  async checkConnection(
    @Query('name') name: string,
  ): Promise<nano.DatabaseCreateResponse> {
    return this.couchdbService.createDb({ name });
  }

  @Get('use-db')
  useDb(@Query('name') name: string): nano.DocumentScope<any> {
    return this.couchdbService.useDb({ name });
  }

  @Post('insert-document')
  async insertDocument(
    @Query('dbName') dbName: string,
    @Body() document: any,
  ): Promise<nano.DocumentInsertResponse> {
    const db = this.couchdbService.useDb({ name: dbName });
    return this.couchdbService.insertDocument(db, document);
  }

  @Get('get-document')
  async getDocument(
    @Query('dbName') dbName: string,
    @Query('docId') docId: string,
  ): Promise<any> {
    const db = this.couchdbService.useDb({ name: dbName });
    return db.get(docId);
  }

  @Get('get-all-documents')
  async getAllDocuments(
    @Query('dbName') dbName: string,
  ): Promise<nano.DocumentListResponse<any>> {
    const db = this.couchdbService.useDb({ name: dbName });
    const response = await db.list();
    return response;
  }

  @Get('delete-document')
  async deleteDocument(
    @Query('dbName') dbName: string,
    @Query('docId') docId: string,
  ): Promise<nano.DocumentDestroyResponse> {
    const db = this.couchdbService.useDb({ name: dbName });
    const doc = (await db.get(docId)) as { _id: string; _rev: string };
    if (!doc._id || !doc._rev) {
      throw new HttpException('Document not found or missing _id/_rev', 404);
    }
    return db.destroy(doc._id, doc._rev);
  }

  @Get('update-document')
  async updateDocument(
    @Query('dbName') dbName: string,
    @Body() document: { _id: string; [key: string]: any },
  ): Promise<nano.DocumentInsertResponse> {
    const db = this.couchdbService.useDb({ name: dbName });
    const doc = (await db.get(document._id)) as {
      _rev: string;
      [key: string]: any;
    };
    document._rev = doc._rev; // Ensure we have the latest revision
    return db.insert(document);
  }

  @Get('document')
  async getDocumentByName(
    @Query('dbName') dbName: string,
    @Query('docName') docName: string,
  ): Promise<any> {
    this.logger.log(`Fetching document ${docName} from database ${dbName}`);
    const db = this.couchdbService.useDb({ name: dbName });
    return db.find({ selector: { name: docName } });
  }
}
