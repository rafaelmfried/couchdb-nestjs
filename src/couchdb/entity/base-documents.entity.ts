export abstract class BaseDocument {
  _id?: string;
  _rev?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
