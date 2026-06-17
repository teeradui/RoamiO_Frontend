import {
    CreateExpensePayload,
    Expense,
    UpdateExpensePayload,
} from "@/src/models/Expense";

const BASE_URL = "http://10.120.67.97:3000/api";

export const tripExpenseService = {
  createExpense: async (
    tripId: number,
    payload: CreateExpensePayload,
  ): Promise<Expense> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create expense");
    }
    return data.expense;
  },

  getExpensesByTrip: async (tripId: number): Promise<Expense[]> => {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/expenses`);
    if (!res.ok) {
      throw new Error("Failed to fetch expenses");
    }
    return res.json();
  },

  getExpensesByActivity: async (
    tripId: number,
    activityId: number,
  ): Promise<Expense[]> => {
    const res = await fetch(
      `${BASE_URL}/trips/${tripId}/expenses/activity/${activityId}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch expenses for this activity");
    }
    return res.json();
  },

  updateExpense: async (
    tripId: number,
    expenseId: number,
    payload: UpdateExpensePayload,
  ): Promise<Expense> => {
    const res = await fetch(
      `${BASE_URL}/trips/${tripId}/expenses/${expenseId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update expense");
    }
    return data.expense;
  },

  deleteExpense: async (tripId: number, expenseId: number): Promise<void> => {
    const res = await fetch(
      `${BASE_URL}/trips/${tripId}/expenses/${expenseId}`,
      { method: "DELETE" },
    );
    if (!res.ok) {
      throw new Error("Failed to delete expense");
    }
  },

  uploadReceipt: async (
    tripId: number,
    expenseId: number,
    file: { uri: string; name: string; type: string },
  ): Promise<Expense> => {
    const formData = new FormData();
    formData.append("receipt", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const res = await fetch(
      `${BASE_URL}/trips/${tripId}/expenses/${expenseId}/receipt`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to upload receipt");
    }
    return data.expense;
  },

  getReceipt: async (
    tripId: number,
    expenseId: number,
  ): Promise<string> => {
    const res = await fetch(
      `${BASE_URL}/trips/${tripId}/expenses/${expenseId}/receipt`,
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch receipt");
    }
    return data.billImageUrl;
  },

  deleteReceipt: async (
    tripId: number,
    expenseId: number,
  ): Promise<void> => {
    const res = await fetch(
      `${BASE_URL}/trips/${tripId}/expenses/${expenseId}/receipt`,
      { method: "DELETE" },
    );
    if (!res.ok) {
      throw new Error("Failed to delete receipt");
    }
  },
};