{/*ต้องทไ expense endpoint*/}

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/theme';
import { Trip } from '@/src/models/Trip';
import { TripMember } from '@/src/models/TripMember';
import getSymbol from 'currency-symbol-map';
import cc from 'currency-codes';
import TextRecognition from 'react-native-text-recognition';
import { BarCodeScanner } from 'expo-barcode-scanner';

type Props = {
    trip: Trip;
    members: TripMember[];
};

type Category = {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
};

type Currency = {
    code: string;
    symbol: string;
    label: string;
};

type Expense = {
    id: string;
    amount: number;
    category: string;
    currency: string;
    note: string;
};

const CATEGORIES: Category[] = [
    {id:'food', label:'Food', icon: 'restaurant-outline'},
    {id:'transort', label: 'Transport', icon:'car-outline'},
    {id: 'shopping', label: 'Shopping', icon: 'bag-outline'},
    {id: 'resident', label:'Resident', icon: 'bed-outline'},
    {id: 'activity', label: 'Activity', icon:'compass-outline'},
    {id: 'other', label:'Other', icon:'ellipsis-horizontal-outline'}
];

const CURRENCIES = cc.codes()
    .map((code) => ({
        code,
        symbol: getSymbol(code) ?? code,
        label: cc.code(code)?.currency ?? code,
    }))
    .filter((c) => c.label !== c.code);

export default function ExpensesTab({trip, members}: Props) {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [addVisible, setAddVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('food');
    const [selectedCurrency, setSelectedCurrency] = useState(() => CURRENCIES.find((c) => c.code === 'THB') ?? CURRENCIES[0]);
    const [currencyVisible, setCurrencyVisible] = useState(false);
    const [note, setNote] = useState('');

    const [receiptVisible, setReceiptVisible] = useState(false);
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [scannedAmount, setScannedAmount] = useState('');
    const [scannedNote, setScannedNote] = useState('');

    const [scannerVisible, setScannerVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanning, setScanning] = useState(false);
    const [processing, setProcessing] = useState(false);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const perPerson = members.length > 0 ? totalExpenses / members.length : 0;

    const handleAddExpense = () => {
        if (!amount.trim()) return;
        const newExpense: Expense = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category: selectedCategory,
            currency: selectedCurrency.code,
            note,
        };
        setExpenses((prev) => [...prev, newExpense]);
        setAmount('');
        setNote('');
        setAddVisible(false);
    };

    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            setReceiptImage(result.assets[0].uri);
            await scanReceiptOCR(result.assets[0].uri);
        }
    };

    const pickFromCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            setReceiptImage(result.assets[0].uri);
            await scanReceiptOCR(result.assets[0].uri);
        }
    };

    const handleSaveReceipt = () => {
        if (!scannedAmount.trim()) return;
        const newExpense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(scannedAmount),
        category: 'other',
        currency: selectedCurrency.code,
        note: scannedNote,
        };
        setExpenses((prev) => [...prev, newExpense]);
        setReceiptImage(null);
        setScannedAmount('');
        setScannedNote('');
        setReceiptVisible(false);
    };

    const scanReceiptOCR = async (uri: string) => {
        setProcessing(true);
        try {
            const result = await TextRecognition.recognize(uri);
            const text = result.join(' ');

            const amounts = text.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g) ?? [];

            const numbers = amounts.map((a) => parseFloat(a.replace(/,/g, '')));
            const maxAmount = numbers.length > 0 ? Math.max(...numbers) : 0;

            if (maxAmount > 0) setScannedAmount(maxAmount.toString());
            setScannedNote('Scanned from receipt');
        } catch (e) {
            setScannedNote('Could not scan — please enter manually');
        } finally{
            setProcessing(false);
        }
    };

    const openQRScanner = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status === 'granted') setScannerVisible(true); 
    };

    const parsePromptPayQR = (data: string): number | null => {
        try {
            const tag54Match = data.match(/5403(\d+)/);
            if (tag54Match) {
                const len = parseInt(tag54Match[1].substring(0,2));
                const amount = tag54Match[1].substring(2, 2 + len);
                return parseFloat(amount);
            }

            const amountMatch = data.match(/54\d{2}([\d.]+)/);
            if (amountMatch) return parseFloat(amountMatch[1]);
            return null
        } catch {
            return null;
        }
    };

    const handleQRScanned = ({type, data} : {type: string; data: string;}) => {
        if (scanning) return;
        setScanning(true);

        const amount = parsePromptPayQR(data);
        if (amount) {
            setScannedAmount(amount.toString());
            setScannedNote('Scanned from QR');
        } else {
            setScannedNote(data.substring(0, 100));
        }

        setScannerVisible(false);
        setReceiptVisible(true);
        setScanning(false);
    };

    const getCategoryIcon = (id: string) =>
        CATEGORIES.find((c) => c.id === id)?.icon ?? 'ellipsis-horizontal-outline';

    const getCategoryLabel = (id: string) =>
        CATEGORIES.find((c) => c.id === id)?.label ?? 'Other';

    return (
        <View style = {{gap: 12}}>

            <View style={{ backgroundColor: Colors.bgCard, borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
                <Text style={{ fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 4 }}>
                Total Expenses
                </Text>
                <Text style={{ fontSize: 36, fontWeight: '700', color: Colors.textPrimary }}>
                $ {totalExpenses.toFixed(1)}
                </Text>
                <Text style={{ fontSize: 13, color: Colors.textMuted, marginTop: 4 }}>
                $ {perPerson.toFixed(1)} per person
                </Text>
            </View>

            <View style={{flexDirection: 'row', gap: 12}}>
                <TouchableOpacity onPress={() => setAddVisible(true)} style={{flex:1, backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset:{ width:0, height:1}, shadowOpacity: 0.05, shadowRadius: 4,elevation: 1}}>
                    <Ionicons name="receipt-outline" size={24} color={Colors.iconOrange}/>
                    <Text style={{ fontSize: 13, color: Colors.textPrimary, fontWeight: '600' }}>Add Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setReceiptVisible(true)} style={{flex:1, backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset:{ width:0, height:1}, shadowOpacity: 0.05, shadowRadius: 4,elevation: 1}}>
                    <Feather name="upload" size={24} color={Colors.iconOrange}/>
                    <Text style={{ fontSize: 13, color: Colors.textPrimary, fontWeight: '600' }}>Upload Receipt</Text>
                </TouchableOpacity>
            </View>

            {expenses.map((expenses) => (
                <View key = {expenses.id} style={{backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, flexDirection:'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: {width:0, height:1}, shadowOpacity: 0.05, shadowRadius: 4, elevation:1}}>
                    <View style={{width: 40, height: 40, borderRadius: 20,backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent:'center'}}>
                        <Ionicons name={getCategoryIcon(expenses.category)} size={20} color={Colors.iconOrange}/>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 14, fontWeight: '600', color: Colors.textPrimary}}>
                            {getCategoryLabel(expenses.category)}
                        </Text>
                        {expenses.note ? (
                            <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2}}>{expenses.note}</Text>
                        ) : null}
                    </View>
                    <Text style={{fontSize: 15, fontWeight: '700', color: Colors.textPrimary}}>
                        {expenses.currency === 'THB' ? '฿' : '$'} {expenses.amount.toFixed(1)}
                    </Text>
                </View>
            ))}

            <Modal visible={addVisible} animationType="slide" transparent>
                <View style={{ flex: 1, backgroundColor: '#00000050', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: Colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' }}>
                            Add Expense
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 8 }}>

                            <TouchableOpacity onPress={() => setCurrencyVisible(true)} style={{backgroundColor: Colors.bgAccent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                <Text style={{fontSize: 14, fontWeight: '600', color: Colors.textPrimary}}>
                                    {selectedCurrency.code}
                                </Text>
                                <Ionicons name="chevron-down" size={14} color={Colors.textMuted}/>
                            </TouchableOpacity>

                            <TextInput style= {{flex: 1, backgroundColor: Colors.bgAccent, borderRadius:12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: Colors.textPrimary, fontWeight: '600'}} placeholder="0.00" placeholderTextColor={Colors.textDisabled} keyboardType="decimal-pad" value={amount} onChangeText={setAmount}/>
                        </View>

                        <View>
                            <Text style={{fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8}}>Category</Text>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                                {CATEGORIES.map((cat) => {
                                    const active = selectedCategory === cat.id;
                                    return(
                                        <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: active ? Colors.filterActiveBg : Colors.filterInactiveBg}}>
                                            <Ionicons name={cat.icon} size={14} color={active ? Colors.filterActiveText: Colors.textMuted}/>
                                            <Text style={{ fontSize: 13, fontWeight: active ? '600' : '400', color: active ? Colors.filterActiveText : Colors.textMuted }}>
                                                {cat.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <TextInput style={{ backgroundColor: Colors.bgAccent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.textPrimary }} placeholder="Note (optional)" placeholderTextColor={Colors.textDisabled} value={note} onChangeText={setNote}/>

                        <View style= {{flexDirection: 'row', gap: 12}}>
                                <TouchableOpacity onPress={() => setAddVisible(false)} style={{ flex:1, backgroundColor: Colors.bgAccent, borderRadius:30, paddingVertical: 14, alignItems: 'center'}}>
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.textMuted}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleAddExpense} style={{ flex:1, backgroundColor: Colors.btnPrimary, borderRadius:30, paddingVertical: 14, alignItems: 'center'}}>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.bgCard}}>Add</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Modal visible={currencyVisible} animationType="fade" transparent>
                    <View style={{flex: 1, backgroundColor: '#00000050', justifyContent: 'center', paddingHorizontal: 32}}>
                        <View style={{backgroundColor: Colors.bgCard, borderRadius: 20, overflow: 'hidden'}}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary, padding: 16, textAlign: 'center'}}>
                                Select Currency
                            </Text>
                            {CURRENCIES.map((cur) => (
                                <TouchableOpacity key={cur.code} onPress={() => {setSelectedCurrency(cur); setCurrencyVisible(false);}} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: Colors.bgAccent, backgroundColor: selectedCurrency.code === cur.code ? Colors.filterActiveBg : 'transparent'}}>
                                    <Text style ={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary, width: 40}}>
                                        {cur.symbol}
                                    </Text>
                                    <Text style ={{ fontSize: 14, color: Colors.textPrimary, flex: 1}}>{cur.label}</Text>
                                    <Text style = {{ fontSize: 13, color: Colors.textMuted}}>{cur.code}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>
            </Modal>

            <Modal visible={receiptVisible} animationType="slide" transparent>
                <View style = {{flex: 1, backgroundColor: '#00000050', justifyContent: 'flex-end'}}>
                    <View style ={{backgroundColor: Colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16}}>
                        <Text style= {{fontSize: 18, fontWeight:'700', color: Colors.textPrimary, textAlign: 'center'}} >
                            Upload Receipt
                        </Text>

                        {!receiptImage ? (
                            <View style={{gap: 12}}>
                                <View style = {{flexDirection: 'row', gap: 12}}>
                                    <TouchableOpacity onPress={pickFromGallery} style={{flex: 1, backgroundColor: Colors.bgAccent, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8}}>
                                        <Ionicons name="image-outline" size={28} color={Colors.iconBrown}/>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textPrimary}}>Gallery</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={pickFromCamera} style={{flex: 1, backgroundColor: Colors.bgAccent, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8}}>
                                        <Ionicons name="camera-outline" size={28} color={Colors.iconBrown}/>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textPrimary}}>Camera</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={() => {setReceiptVisible(false); openQRScanner();}} style={{ backgroundColor: Colors.bgAccent, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <Ionicons name="qr-code-outline" size={22} color={Colors.iconBrown}/>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textPrimary}}>Scan QR Code</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ gap: 12}}>
                                <Image source={{uri: receiptImage}} style={{width: '100%', height: 160, borderRadius: 12}} resizeMode="cover" />

                                {processing && (
                                    <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center', gap: 8}}>
                                        <Ionicons name="scan-outline" size={16} color={Colors.textSecondary}/>
                                        <Text style={{fontSize: 13, color: Colors.textSecondary}}>Scanning receipt...</Text>
                                    </View>
                                )}

                                <Text style={{fontSize: 13, fontWeight:'600', color: Colors.textPrimary}}>Amount</Text>
                                <TextInput style={{backgroundColor: Colors.bgAccent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: Colors.textPrimary, fontWeight: '600'}} placeholder="0.00" placeholderTextColor={Colors.textDisabled} keyboardType="decimal-pad" value={scannedAmount} onChangeText={setScannedAmount}/>

                                <Text style={{fontSize: 13, fontWeight:'600', color: Colors.textPrimary}}>Note</Text>
                                <TextInput style={{backgroundColor: Colors.bgAccent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.textPrimary}} placeholder="Note (optional)" placeholderTextColor={Colors.textDisabled} value={scannedNote} onChangeText={setScannedNote}/>

                                <View style={{flexDirection: 'row', gap:12}}>
                                    <TouchableOpacity onPress={() => setReceiptImage(null)} style={{flex: 1, backgroundColor: Colors.bgAccent, borderRadius: 30, paddingVertical: 14, alignItems: 'center'}}>
                                        <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.textMuted}}>Retake</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleSaveReceipt} style={{flex: 1, backgroundColor: Colors.btnPrimary, borderRadius: 30, paddingVertical: 14, alignItems: 'center'}}>
                                        <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.bgCard}}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity onPress={() => { setReceiptVisible(false); setReceiptImage(null);}} style={{alignItems: 'center', paddingVertical: 8}}>
                            <Text style={{ fontSize: 14, color: Colors.textMuted}}> Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={scannerVisible} animationType="slide">
                <View style={{flex: 1, backgroundColor: '#000'}}>
                    {hasPermission === false ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                            <Feather name="camera-off" size={48} color="#fff" />
                            <Text style={{ color: '#fff', fontSize: 15 }}>Camera permission denied</Text>
                        </View>
                    ):(
                        <BarCodeScanner onBarCodeScanned={handleQRScanned} style={{flex: 1}}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <View style={{width: 250, height: 250, borderWidth: 2, borderColor:Colors.tabActive, borderRadius: 16}}/>
                                <Text style={{color:'#fff', marginTop: 16, fontSize: 14}}>
                                    Point Camera at QR code on slip
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => { setScannerVisible(false); setReceiptVisible(true); }} style={{ position: 'absolute', top: 56, left: 24, width: 40, height: 40, borderRadius: 20, backgroundColor: '#00000080', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="close" size={22} color="#fff" />
                            </TouchableOpacity>
                        </BarCodeScanner>
                    )}
                </View>

            </Modal>

        </View>
    );

}

