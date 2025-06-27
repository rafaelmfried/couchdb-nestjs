import { Test, TestingModule } from '@nestjs/testing';
import { CouchdbController } from './couchdb.controller';
import { CouchdbService } from './couchdb.service';

describe('CouchdbController', () => {
  let controller: CouchdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouchdbController],
      providers: [CouchdbService],
    }).compile();

    controller = module.get<CouchdbController>(CouchdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
