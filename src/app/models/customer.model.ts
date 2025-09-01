export interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
}