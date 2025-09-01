export interface EmailAddress {
  id: number;
  email: string;
  userId?: number;
  customerId?: number;
  type: 'primary' | 'secondary' | 'billing' | 'support';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAddressWithRelations extends EmailAddress {
  userName?: string;
  customerName?: string;
}