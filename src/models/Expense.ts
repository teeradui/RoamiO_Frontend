export type Currency = "฿" | "$" | "€" | "£" | "¥" | "₩";

export interface Expense {
  expenseId: number;
  tripId: number;
  userId: number;
  activityId: number | null;
  expenseName: string;
  amount: number;
  currency: Currency;
  billImageUrl: string | null;
  expenseTimestamp: string;
}

export interface CreateExpensePayload {
  userId: number;
  activityId?: number | null;
  expenseName: string;
  amount: number;
  currency?: Currency;
  expenseTimestamp?: string;
}

export interface UpdateExpensePayload {
  expenseName?: string;
  amount?: number;
  currency?: Currency;
  activityId?: number;
  expenseTimestamp?: string;
}