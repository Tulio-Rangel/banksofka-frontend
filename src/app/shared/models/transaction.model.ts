export interface Transaction {
    id: string;
    amount: number;
    type: string;
    date: Date;
}

export interface AuditTransaction {
    id: string;
    userId: string;
    initialBalance: number;
    amount: number;
    finalBalance: number;
    transactionType: string;
    date: Date;
}