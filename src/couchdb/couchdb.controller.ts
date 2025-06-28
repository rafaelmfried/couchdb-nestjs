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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as nano from 'nano';
import { CouchdbService } from './couchdb.service';

@ApiTags('couchdb')
@Controller('couchdb')
export class CouchdbController {
  private readonly logger = new Logger(CouchdbController.name);

  constructor(private readonly couchdbService: CouchdbService) {}

  @ApiOperation({ summary: 'Create a new CouchDB database' })
  @ApiBody({ schema: { example: { name: 'my_database' } } })
  @Post('create-db')
  async createDb(
    @Body() data: { name: string },
  ): Promise<nano.DatabaseCreateResponse> {
    return this.couchdbService.createDb(data);
  }

  @ApiOperation({ summary: 'Insert a document into a CouchDB database' })
  @ApiBody({
    schema: { example: { dbName: 'my_database', document: { key: 'value' } } },
  })
  @Post('insert-document')
  async insertDocument<T extends nano.MaybeDocument>(
    @Body() data: { dbName: string; document: T },
  ): Promise<nano.DocumentInsertResponse> {
    return this.couchdbService.insertDocument(data);
  }

  @ApiOperation({
    summary: 'Get a specific document by ID from a CouchDB database',
  })
  @ApiParam({ name: 'dbName', example: 'my_database' })
  @ApiParam({ name: 'docId', example: 'document_id' })
  @Get('document/:dbName/:docId')
  async getDocument<T>(
    @Param('dbName') dbName: string,
    @Param('docId') docId: string,
  ): Promise<T> {
    return this.couchdbService.getDocument({ dbName, docId });
  }

  @ApiOperation({ summary: 'Get all documents from a CouchDB database' })
  @ApiParam({ name: 'dbName', example: 'my_database' })
  @Get('documents/:dbName')
  async getAllDocuments<T>(
    @Param('dbName') dbName: string,
  ): Promise<nano.DocumentListResponse<T>> {
    return this.couchdbService.getAllDocuments({ dbName });
  }

  @ApiOperation({
    summary: 'Delete a specific document by ID from a CouchDB database',
  })
  @ApiParam({ name: 'dbName', example: 'my_database' })
  @ApiParam({ name: 'docId', example: 'document_id' })
  @Delete('document/:dbName/:docId')
  async deleteDocument(
    @Param('dbName') dbName: string,
    @Param('docId') docId: string,
  ): Promise<nano.DocumentDestroyResponse> {
    return this.couchdbService.deleteDocument({ dbName, docId });
  }

  @ApiOperation({ summary: 'Update a document in a CouchDB database' })
  @ApiParam({ name: 'dbName', example: 'my_database' })
  @ApiBody({ schema: { example: { _id: 'document_id', key: 'new_value' } } })
  @Put('update-document/:dbName')
  async updateDocument<T>(
    @Param('dbName') dbName: string,
    @Body() document: T & { _id: string },
  ): Promise<nano.DocumentInsertResponse> {
    return this.couchdbService.updateDocument({ dbName, document });
  }

  @ApiOperation({ summary: 'Find documents by selector in a CouchDB database' })
  @ApiParam({ name: 'dbName', example: 'my_database' })
  @ApiBody({ schema: { example: { selector: { key: 'value' } } } })
  @Post('find-document/:dbName')
  async findDocumentBySelector<T>(
    @Param('dbName') dbName: string,
    @Body() selector: Record<string, any>,
  ): Promise<nano.MangoResponse<T>> {
    return this.couchdbService.findDocumentBySelector({ dbName, selector });
  }
}
