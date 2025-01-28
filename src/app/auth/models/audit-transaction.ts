export interface AuditTransaction {
  id: string;
  userId: string,
  initialBalance: number;
  amount: number;
  finalBalance: number;
  transactionType: string;
  date: string;
}
