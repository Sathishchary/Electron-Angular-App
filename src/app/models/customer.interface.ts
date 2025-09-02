export interface Customer {
  id: number;
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  primaryEmail: string;
  industry: string;
  status: 'active' | 'inactive' | 'pending';
  revenue: number;
  createdAt: Date;
  updatedAt: Date;
}