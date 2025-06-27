import { Controller } from '@nestjs/common';
import { CouchdbService } from './couchdb.service';

@Controller('couchdb')
export class CouchdbController {
  constructor(private readonly couchdbService: CouchdbService) {}
}
