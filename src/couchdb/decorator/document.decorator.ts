import 'reflect-metadata';

export const DOCUMENT_KEY = 'COUCHDB:DOCUMENT';

export function Document(dbName: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(DOCUMENT_KEY, dbName, target);
  };
}
