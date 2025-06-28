import * as nano from 'nano';

import { CouchdbConnectionConfig } from './interface/connection-config.interface';

export class CouchDbConnectionFactory {
  static async create(
    config: CouchdbConnectionConfig,
  ): Promise<nano.ServerScope> {
    const connection = nano(config);
    await connection.auth(config.username, config.password);
    return connection;
  }
}
