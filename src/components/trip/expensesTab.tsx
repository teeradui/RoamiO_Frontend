import { Colors } from "@/constants/theme";
import { useTripExpenseController } from "@/src/controllers/tripExpenseController";
import { Currency, Expense } from "@/src/models/Expense";
import { Trip } from "@/src/models/Trip";
import { TripMember } from "@/src/models/TripMember";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  trip: Trip;
  members: TripMember[];
};

const CURRENCIES: Currency[] = ["฿", "$", "€", "£", "¥", "₩"];

export default function ExpensesTab({ trip, members }: Props) {
  const {
    expenses,
    loading,
    fetchExpensesByTrip,
    createExpense,
    uploadReceipt,
  } = useTripExpenseController(trip.tripId);

  const [addVisible, setAddVisible] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("฿");
  const [currencyVisible, setCurrencyVisible] = useState(false);

  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptExpenseName, setReceiptExpenseName] = useState("");
  const [receiptAmount, setReceiptAmount] = useState("");
  const [savingReceipt, setSavingReceipt] = useState(false);

  useEffect(() => {
    fetchExpensesByTrip();
  }, [trip.tripId]);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const perPerson = members.length > 0 ? totalExpenses / members.length : 0;

  const handleAddExpense = async () => {
    if (!expenseName.trim() || !amount.trim()) return;
    const created = await createExpense({
      userId: trip.createdBy, // TODO: replace with logged-in user id once auth is wired
      expenseName: expenseName.trim(),
      amount: parseFloat(amount),
      currency: selectedCurrency,
    });
    if (created) {
      setExpenseName("");
      setAmount("");
      setAddVisible(false);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const handleSaveReceipt = async () => {
    if (!receiptImage || !receiptExpenseName.trim() || !receiptAmount.trim()) {
      return;
    }
    setSavingReceipt(true);
    try {
      const created = await createExpense({
        userId: trip.createdBy, // TODO: replace with logged-in user id once auth is wired
        expenseName: receiptExpenseName.trim(),
        amount: parseFloat(receiptAmount),
        currency: selectedCurrency,
      });
      if (created) {
        await uploadReceipt(created.expenseId, {
          uri: receiptImage,
          name: `receipt_${created.expenseId}.jpg`,
          type: "image/jpeg",
        });
      }
      setReceiptImage(null);
      setReceiptExpenseName("");
      setReceiptAmount("");
      setReceiptVisible(false);
    } finally {
      setSavingReceipt(false);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          backgroundColor: Colors.bgCard,
          borderRadius: 16,
          padding: 20,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: Colors.textSecondary,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          Total Expenses
        </Text>
        <Text style={{ fontSize: 36, fontWeight: "700", color: Colors.textPrimary }}>
          {selectedCurrency} {totalExpenses.toFixed(1)}
        </Text>
        <Text style={{ fontSize: 13, color: Colors.textMuted, marginTop: 4 }}>
          {selectedCurrency} {perPerson.toFixed(1)} per person
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          onPress={() => setAddVisible(true)}
          style={{
            flex: 1,
            backgroundColor: Colors.bgCard,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Ionicons name="receipt-outline" size={24} color={Colors.iconOrange} />
          <Text style={{ fontSize: 13, color: Colors.textPrimary, fontWeight: "600" }}>
            Add Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setReceiptVisible(true)}
          style={{
            flex: 1,
            backgroundColor: Colors.bgCard,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Feather name="upload" size={24} color={Colors.iconOrange} />
          <Text style={{ fontSize: 13, color: Colors.textPrimary, fontWeight: "600" }}>
            Upload Receipt
          </Text>
        </TouchableOpacity>
      </View>

      {loading && expenses.length === 0 && (
        <ActivityIndicator size="small" color={Colors.tabActive} style={{ marginTop: 16 }} />
      )}

      {expenses.map((expense: Expense) => (
        <View
          key={expense.expenseId}
          style={{
            backgroundColor: Colors.bgCard,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.bgAccent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="receipt-outline" size={20} color={Colors.iconOrange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.textPrimary }}>
              {expense.expenseName}
            </Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.textPrimary }}>
            {expense.currency} {Number(expense.amount).toFixed(1)}
          </Text>
        </View>
      ))}

      {/* ── Add Expense Modal ───────────────────────────────────────────────── */}
      <Modal visible={addVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "#00000050", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: Colors.bgCard,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              gap: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: Colors.textPrimary,
                textAlign: "center",
              }}
            >
              Add Expense
            </Text>

            <TextInput
              style={{
                backgroundColor: Colors.bgAccent,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: Colors.textPrimary,
              }}
              placeholder="Expense name"
              placeholderTextColor={Colors.textDisabled}
              value={expenseName}
              onChangeText={setExpenseName}
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => setCurrencyVisible(true)}
                style={{
                  backgroundColor: Colors.bgAccent,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.textPrimary }}>
                  {selectedCurrency}
                </Text>
                <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
              </TouchableOpacity>

              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: Colors.bgAccent,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: Colors.textPrimary,
                  fontWeight: "600",
                }}
                placeholder="0.00"
                placeholderTextColor={Colors.textDisabled}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setAddVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: Colors.bgAccent,
                  borderRadius: 30,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.textMuted }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddExpense}
                style={{
                  flex: 1,
                  backgroundColor: Colors.btnPrimary,
                  borderRadius: 30,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.bgCard }}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Currency Picker ──────────────────────────────────────────────── */}
        <Modal visible={currencyVisible} animationType="fade" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000050",
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            <View style={{ backgroundColor: Colors.bgCard, borderRadius: 20, overflow: "hidden" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: Colors.textPrimary,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                Select Currency
              </Text>
              {CURRENCIES.map((cur) => (
                <TouchableOpacity
                  key={cur}
                  onPress={() => {
                    setSelectedCurrency(cur);
                    setCurrencyVisible(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderTopWidth: 1,
                    borderTopColor: Colors.bgAccent,
                    backgroundColor:
                      selectedCurrency === cur ? Colors.filterActiveBg : "transparent",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "700", color: Colors.textPrimary }}>
                    {cur}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </Modal>

      {/* ── Upload Receipt Modal ─────────────────────────────────────────────── */}
      <Modal visible={receiptVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "#00000050", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: Colors.bgCard,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              gap: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: Colors.textPrimary,
                textAlign: "center",
              }}
            >
              Upload Receipt
            </Text>

            {!receiptImage ? (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={pickFromGallery}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.bgAccent,
                    borderRadius: 16,
                    padding: 20,
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Ionicons name="image-outline" size={28} color={Colors.iconBrown} />
                  <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.textPrimary }}>
                    Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={pickFromCamera}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.bgAccent,
                    borderRadius: 16,
                    padding: 20,
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Ionicons name="camera-outline" size={28} color={Colors.iconBrown} />
                  <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.textPrimary }}>
                    Camera
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                <Image
                  source={{ uri: receiptImage }}
                  style={{ width: "100%", height: 160, borderRadius: 12 }}
                  resizeMode="cover"
                />

                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.textPrimary }}>
                  Expense name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: Colors.bgAccent,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    color: Colors.textPrimary,
                  }}
                  placeholder="e.g. Lunch at riverside cafe"
                  placeholderTextColor={Colors.textDisabled}
                  value={receiptExpenseName}
                  onChangeText={setReceiptExpenseName}
                />

                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.textPrimary }}>
                  Amount
                </Text>
                <TextInput
                  style={{
                    backgroundColor: Colors.bgAccent,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: Colors.textPrimary,
                    fontWeight: "600",
                  }}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textDisabled}
                  keyboardType="decimal-pad"
                  value={receiptAmount}
                  onChangeText={setReceiptAmount}
                />

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setReceiptImage(null)}
                    style={{
                      flex: 1,
                      backgroundColor: Colors.bgAccent,
                      borderRadius: 30,
                      paddingVertical: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.textMuted }}>
                      Retake
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveReceipt}
                    disabled={savingReceipt}
                    style={{
                      flex: 1,
                      backgroundColor: Colors.btnPrimary,
                      borderRadius: 30,
                      paddingVertical: 14,
                      alignItems: "center",
                      opacity: savingReceipt ? 0.6 : 1,
                    }}
                  >
                    {savingReceipt ? (
                      <ActivityIndicator size="small" color={Colors.bgCard} />
                    ) : (
                      <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.bgCard }}>
                        Save
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setReceiptVisible(false);
                setReceiptImage(null);
              }}
              style={{ alignItems: "center", paddingVertical: 8 }}
            >
              <Text style={{ fontSize: 14, color: Colors.textMuted }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}