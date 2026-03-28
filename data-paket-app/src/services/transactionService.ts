import { apiClient } from "./api";
import type { Transaction } from "../types";

export const transactionService = {
    async createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>{
        const transaction: Omit<Transaction, 'id'> = {
            ...data,
            createdAt: new Date().toISOString(),
        };
        const response = await apiClient.post('/transactions', transaction);
        return response.data;
    },

    async getTransactionsByUser(userId: string): Promise<Transaction[]> { 
        const response = await apiClient.get('/transactions');
        const data: Transaction[] = response.data;
        return data.filter((t) => t.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
}