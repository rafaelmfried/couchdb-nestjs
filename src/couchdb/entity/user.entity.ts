import { Document } from '../decorator/document.decorator';
import { BaseDocument } from './base-documents.entity';

@Document('users')
export class User extends BaseDocument {
  firstName: string;
  lastName: string;
  email: string;
  organizations?: {
    id: string;
    name: string;
    role: 'admin' | 'root' | 'financial' | 'user';
    permissions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }[];
  isActive: boolean;
}
