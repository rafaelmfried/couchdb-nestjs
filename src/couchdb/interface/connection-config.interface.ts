import { Configuration } from 'nano';

export interface CouchdbConnectionConfig extends Configuration {
  username: string;
  password: string;
  sync?: boolean;
}
