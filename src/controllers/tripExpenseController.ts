import {
    CreateExpensePayload,
    Expense,
    UpdateExpensePayload,
} from "@/src/models/Expense";
import { tripExpenseService } from "@/src/services/tripExpenseService";
import { useState } from "react";

export function useTripExpenseController(tripId: number) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpensesByTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripExpenseService.getExpensesByTrip(tripId);
      setExpenses(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesByActivity = async (
    activityId: number,
  ): Promise<Expense[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripExpenseService.getExpensesByActivity(
        tripId,
        activityId,
      );
      return data;
    } catch (e: any) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (
    payload: CreateExpensePayload,
  ): Promise<Expense | null> => {
    setLoading(true);
    setError(null);
    try {
      const newExpense = await tripExpenseService.createExpense(
        tripId,
        payload,
      );
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (
    expenseId: number,
    payload: UpdateExpensePayload,
  ): Promise<Expense | null> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await tripExpenseService.updateExpense(
        tripId,
        expenseId,
        payload,
      );
      setExpenses((prev) =>
        prev.map((e) => (e.expenseId === expenseId ? updated : e)),
      );
      return updated;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await tripExpenseService.deleteExpense(tripId, expenseId);
      setExpenses((prev) => prev.filter((e) => e.expenseId !== expenseId));
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadReceipt = async (
    expenseId: number,
    file: { uri: string; name: string; type: string },
  ): Promise<Expense | null> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await tripExpenseService.uploadReceipt(
        tripId,
        expenseId,
        file,
      );
      setExpenses((prev) =>
        prev.map((e) => (e.expenseId === expenseId ? updated : e)),
      );
      return updated;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteReceipt = async (expenseId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await tripExpenseService.deleteReceipt(tripId, expenseId);
      setExpenses((prev) =>
        prev.map((e) =>
          e.expenseId === expenseId ? { ...e, billImageUrl: null } : e,
        ),
      );
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    loading,
    error,
    fetchExpensesByTrip,
    fetchExpensesByActivity,
    createExpense,
    updateExpense,
    deleteExpense,
    uploadReceipt,
    deleteReceipt,
  };
}