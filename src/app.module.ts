import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouchdbModule } from './couchdb/couchdb.module';

@Module({
  imports: [CouchdbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
