import { Module } from '@nestjs/common';
import { CouchdbService } from './couchdb.service';
import { CouchdbController } from './couchdb.controller';

@Module({
  controllers: [CouchdbController],
  providers: [CouchdbService],
})
export class CouchdbModule {}
