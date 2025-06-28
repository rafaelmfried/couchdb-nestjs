import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import * as nano from 'nano';
import { CouchdbService } from './couchdb.service';

@Controller('couchdb')
export class CouchdbController {
  private readonly logger = new Logger(CouchdbController.name);

  constructor(private readonly couchdbService: CouchdbService) {}

  @Post('create-db')
  async createDb(
    @Body() data: { name: string },
  ): Promise<nano.DatabaseCreateResponse> {
    return this.couchdbService.createDb(data);
  }

  @Post('insert-document')
  async insertDocument<T extends nano.MaybeDocument>(
    @Body() data: { dbName: string; document: T },
  ): Promise<nano.DocumentInsertResponse> {
    return this.couchdbService.insertDocument(data);
  }

  @Get('document/:dbName/:docId')
  async getDocument<T>(
    @Param('dbName') dbName: string,
    @Param('docId') docId: string,
  ): Promise<T> {
    return this.couchdbService.getDocument({ dbName, docId });
  }

  @Get('documents/:dbName')
  async getAllDocuments<T>(
    @Param('dbName') dbName: string,
  ): Promise<nano.DocumentListResponse<T>> {
    return this.couchdbService.getAllDocuments({ dbName });
  }

  @Delete('document/:dbName/:docId')
  async deleteDocument(
    @Param('dbName') dbName: string,
    @Param('docId') docId: string,
  ): Promise<nano.DocumentDestroyResponse> {
    return this.couchdbService.deleteDocument({ dbName, docId });
  }

  @Put('update-document/:dbName')
  async updateDocument<T>(
    @Param('dbName') dbName: string,
    @Body() document: T & { _id: string },
  ): Promise<nano.DocumentInsertResponse> {
    return this.couchdbService.updateDocument({ dbName, document });
  }

  @Post('find-document/:dbName')
  async findDocumentBySelector<T>(
    @Param('dbName') dbName: string,
    @Body() selector: Record<string, any>,
  ): Promise<nano.MangoResponse<T>> {
    return this.couchdbService.findDocumentBySelector({ dbName, selector });
  }
}
