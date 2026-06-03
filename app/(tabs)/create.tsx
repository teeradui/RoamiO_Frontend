import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import DateTimePicker, { DateTimePickerEvent,} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Country as CSCCountry, State } from "country-state-city";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { useTripController } from "@/src/controllers/tripController";
import { TripForm } from "@/src/models/TripForm"

// Step1 indicator
function StepIndicator({ current }: { current: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginHorizontal: 24,
        marginBottom: 20,
      }}
    >
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor:
              i === current ? Colors.stepActive : Colors.stepInactive,
          }}
        />
      ))}
    </View>
  );
}

function Label({ text, optional }: { text: string; optional?: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 6,
      }}
    >
      <Text
        style={{ fontSize: 14, fontWeight: "600", color: Colors.textPrimary }}
      >
        {text}
      </Text>
      {optional && (
        <Text style={{ fontSize: 12, color: Colors.textMuted }}>
          (optional)
        </Text>
      )}
    </View>
  );
}

const inputStyle = {
  backgroundColor: Colors.bgCard,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 14,
  color: Colors.textPrimary,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
};

export default function CreateTripScreen() {
  const [formData, setFormData] = useState<TripForm>({
    tripName: "",
    startDate: null,
    endDate: null,
    destination: "",
    meetupTime: new Date(),
    meetingPoint: "",
    profilePhoto: null,
  });

  const [country, setCountry] = useState<{
    name: string;
    flag: string;
    code: string;
  } | null>(null);
  const [countryVisible, setCountryVisible] = useState(false);
  const [stateVisible, setStateVisible] = useState(false);
  const [selectedState, setSelectedState] = useState<{
    name: string;
    isoCode: string;
  } | null>(null);

  const [activePicker, setActivePicker] = useState<"start" | "end" | 'time' | null>(null);  
  const [dateError, setDateError] = useState<string | null>(null);

  const [meetingCoords, setMeetingCoords] = useState<{ latitude: number; longitude: number } | null>(null); 

  const [mapRegion, setMapRegion] = useState({
    latitude: 13.7563,
    longitude: 100.5018,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const [mapVisible, setMapVisible] = useState(false);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFormData((prev: TripForm) => ({ ...prev, profilePhoto: result.assets[0].uri }));
    }
  };

  const canProceed =
    formData.tripName.trim() !== "" &&
    country !== null &&
    formData.startDate !== null &&
    formData.endDate !== null &&
    formData.meetupTime !== null;

  const { createTrip } = useTripController();

  const handleNext = async () => {
    

    if (!canProceed) return;

    console.log('calling createTrip...');

    const newTrip = await createTrip({
        tripName: formData.tripName,
        tripDestination: `${country?.name}${selectedState ? `, ${selectedState.name}` : ''}`,
        startTime: formData.startDate!.toISOString(),
        endTime: formData.endDate!.toISOString(),
        meetUpTime: formData.meetupTime.toISOString(),
        meetingPoint: formData.meetingPoint || undefined,
        image: formData.profilePhoto ? {
            uri: formData.profilePhoto,
            name: 'trip-photo.jpg',
            type: 'image/jpeg'
        } : undefined,
    });

    
    console.log('newTrip result:', newTrip);

    if (!newTrip) return;

    console.log('navigating...');

    router.push({
      pathname: "/trips/invite",
      params: {
        tripId: newTrip.tripId.toString(),
        tripName: newTrip.tripName,
        meetupTime: newTrip.meetUpTime,
        photo: newTrip.imageUrl ?? '',
      },
    });
  };

  const handleDateChange = (e: DateTimePickerEvent, date?: Date) => {

    if (!date) return;
    
    if (activePicker === "start") {
        setFormData((prev: TripForm) => ({...prev, startDate: date}));
        if (formData.endDate && date > formData.endDate) {
            setDateError("Start date cannot be after end date.");
        } else {
            setDateError(null);
        }
    } else if (activePicker === "end") {
        setFormData((prev: TripForm) => ({...prev, endDate: date}));
        if (formData.startDate && date < formData.startDate) {
            setDateError("End date cannot be before start date.");
        } else {
            setDateError(null);
        }
    }
  };

  const handleTimeChange = (e: DateTimePickerEvent, date?: Date) => {
    if (date) setFormData((prev: TripForm) => ({ ...prev, meetupTime: date }));
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setMeetingCoords({ latitude, longitude });

    // Reverse geocode to get address
    const result = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (result.length > 0) {
      const place = result[0];
      const name = [place.name, place.district, place.city, place.country].filter(Boolean).join(", ");
      setFormData((prev: TripForm) => ({ ...prev, meetingPoint: name }));
    }
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchPlace = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) { setSearchResults([]); return; }
    try {
        const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSearchResults(data);
    } catch {
        setSearchResults([]);
    }
  };

    const selectPlace = (item: any) => {
        const coords = { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) };
        setMeetingCoords(coords);
        setMapRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        setFormData((prev: TripForm) => ({ ...prev, meetingPoint: item.display_name.split(',').slice(0, 3).join(',') }));
        setSearchQuery('');
        setSearchResults([]);
    };

    console.log('canProceed:', canProceed, {
    tripName: formData.tripName.trim() !== "",
    country: country !== null,
    startDate: formData.startDate !== null,
    endDate: formData.endDate !== null,
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 22,
          fontWeight: "700",
          color: Colors.textPrimary,
          marginTop: 16,
          marginBottom: 12,
        }}
      >
        Create Trip
      </Text>
      <StepIndicator current={0} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <Text style ={{ fontSize: 16, fontWeight: "700", color: Colors.textPrimary, marginBottom: 12 }}>Trip Details</Text>

        <TouchableOpacity
          onPress={pickImage}
          style={{ alignItems: "center", marginBottom: 24 }}
        >
          {formData.profilePhoto ? (
            <Image
              source={{ uri: formData.profilePhoto }}
              style={{ width: 160, height: 130, borderRadius: 16 }}
            />
          ) : (
            <View
              style={{
                width: 160,
                height: 130,
                borderRadius: 16,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: Colors.tabActive,
                backgroundColor: Colors.bgHighlight + "40",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="images-outline"
                size={40}
                color={Colors.textSecondary}
              />
            </View>
          )}
          <Text
            style={{
              margin: 8,
              fontSize: 14,
              color: Colors.textSecondary,
              fontWeight: "500",
            }}
          >
            Upload Photo
          </Text>
        </TouchableOpacity>

        {/* Trip Name */}
        <View style={{ marginBottom: 16 }}>
          <Label text="Trip Name" />
          <TextInput
            style={inputStyle}
            placeholder="e.g. Summer Japan Trip"
            placeholderTextColor={Colors.textDisabled}
            value={formData.tripName}
            onChangeText={(text) => setFormData((prev: TripForm) => ({ ...prev, tripName: text }))}
          />
        </View>

        {/* Destination */}
        <View style={{ marginBottom: 16 }}>
          <Label text="Destination" />
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setCountryVisible(true)}
              style={{
                ...inputStyle,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: country ? Colors.textPrimary : Colors.textDisabled,
                }}
              >
                {country ? `${country.flag} ${country.name}` : "Country"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>

            <CountryPicker
              show={countryVisible}
              lang="en"
              pickerButtonOnPress={(item) => {
                setCountry({
                  name: item.name.en,
                  flag: item.flag,
                  code: item.code,
                });

                setSelectedState(null);

                setCountryVisible(false);

                const countryData = CSCCountry.getCountryByCode(item.code);
                if (countryData?.latitude && countryData?.longitude) {
                    setMapRegion({
                        latitude: parseFloat(countryData.latitude),
                        longitude: parseFloat(countryData.longitude),
                        latitudeDelta:  10,
                        longitudeDelta: 10
                    });
                }
              }}
              onBackdropPress={() => setCountryVisible(false)}
              style={{ modal: { height: 500 }, dialCode: {display:'none'} }}
              excludedCountries={[]}
            />

            <TouchableOpacity
              onPress={() => {
                if (!country) return;
                setStateVisible(true);
              }}
              style={{
                ...inputStyle,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: country ? 1 : 0.5,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: selectedState
                    ? Colors.textPrimary
                    : Colors.textDisabled,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {selectedState ? selectedState.name : "State (optional)"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Start Date & End Date */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Label text="Start Date" />
            <TouchableOpacity
              onPress={() => setActivePicker("start")}
              style={{
                ...inputStyle,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                { formData.startDate ? formatDate(formData.startDate) : "Select Date" }
              </Text>
              <Ionicons
                 name="calendar-outline"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Label text="End Date" />
            <TouchableOpacity
              onPress={() => setActivePicker("end")}
              style={{
                ...inputStyle,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                { formData.endDate ? formatDate(formData.endDate) : "Select Date" }
              </Text>
              <Ionicons
                 name="calendar-outline"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {dateError && (
          <Text style={{ color: Colors.red, marginBottom: 16, textAlign: "center" }}>
            {dateError}
          </Text>
        )}

        

        {activePicker === "start" && (
            <>
                <DateTimePicker
                    value={formData.startDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    textColor={Colors.black}
                    onChange={handleDateChange}
                /> 
                <TouchableOpacity onPress = {() => setActivePicker(null)} style={{ alignItems: 'flex-end', paddingHorizontal: 4, paddingVertical:4}}>
                    <Text style={{color: Colors.btnPrimary, fontWeight: '600', fontSize: 14}}> Done</Text>
                </TouchableOpacity>
            </>
          )}
          
          {activePicker === "end" && (
            <>
                <DateTimePicker
                value={formData.endDate ?? formData.startDate ?? new Date()}
                mode="date"
                minimumDate={formData.startDate ?? undefined}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                textColor={Colors.black}
                onChange={handleDateChange} />

                <TouchableOpacity onPress = {() => setActivePicker(null)} style={{ alignItems: 'flex-end', paddingHorizontal: 4, paddingVertical:4}}>
                    <Text style={{color: Colors.btnPrimary, fontWeight: '600', fontSize: 14}}> Done</Text>
                </TouchableOpacity>
            </>  
          )}

        {/* Meet Up Time */}
        <View style={{ marginBottom: 16, marginTop: 12 }}>
          <Label text="Meet Up Time" />
          <TouchableOpacity
            onPress={() => setActivePicker("time")}
            style={{
              ...inputStyle,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
              {formatTime(formData.meetupTime)}
            </Text>
            <Ionicons
              name="time-outline"
              size={16}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {activePicker === "time" && (
            <>
                <DateTimePicker
                    value={formData.meetupTime}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    textColor={Colors.black}
                    onChange={handleTimeChange}/>

                <TouchableOpacity onPress = {() => setActivePicker(null)} style={{ alignItems: 'flex-end', paddingHorizontal: 4, paddingVertical:4}}>
                    <Text style={{color: Colors.btnPrimary, fontWeight: '600', fontSize: 14}}> Done</Text>
                </TouchableOpacity>
            </>
          )}

        {/* Meeting Point */}
        <View style={{ marginBottom: 24 }}>
          <Label text="Meeting Point" optional />

          <TouchableOpacity onPress={() => setMapVisible(true)} style={{ ...inputStyle, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="location-outline" size={16} color={Colors.textMuted}/>
            <Text style = {{fontSize: 14, color: formData.meetingPoint ? Colors.textPrimary : Colors.textDisabled, flex: 1 }} numberOfLines={1}>
                {formData.meetingPoint || "Tap on map to select location"}
            </Text>
            {formData.meetingPoint ? (
                <TouchableOpacity onPress={() => {setFormData((prev: TripForm) => ({ ...prev, meetingPoint: '' })); setMeetingCoords(null); }}>
                    <Ionicons name="close-circle" size={16} color={Colors.textMuted}/>
                </TouchableOpacity>
            ) : (<Ionicons name = "chevron-forward" size ={16} color={Colors.textMuted}/>
            )}
          </TouchableOpacity>

          <Modal visible = {mapVisible} animationType="slide" transparent>
            <View style= {{flex:1, backgroundColor: '#00000060', justifyContent: 'flex-end'}}>
                <View style ={{ backgroundColor: Colors.bgCard, borderTopLeftRadius: 24,borderTopRightRadius: 24, height: '80%', overflow: 'hidden'}}>

                    <View style = {{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.bgAccent}}>
                        <Text style = {{fontSize: 16, fontWeight: '700', color: Colors.textPrimary}}>Select Meeting Point</Text>
                        <TouchableOpacity onPress={() => setMapVisible(false)}>
                            <Ionicons name ="close" size ={22} color={Colors.textPrimary}/>
                        </TouchableOpacity>
                    </View>

                    <View style = {{margin: 12, backgroundColor: Colors.bgAccent, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8}}>
                        <Ionicons name= "search-outline" size = {16} color={Colors.textMuted}/>
                        <TextInput style = {{flex: 1, paddingVertical: 10, fontSize: 14, color: Colors.textPrimary}} placeholder="Search place..." placeholderTextColor={Colors.textDisabled} value={searchQuery} onChangeText={searchPlace}/>
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => {setSearchQuery(''); setSearchResults([]);}}>
                                    <Ionicons name = "close-circle" size ={16} color= {Colors.textMuted}/>
                                </TouchableOpacity>
                            )}
                    </View>

                    {searchResults.length > 0 && (
                        <View style= {{backgroundColor: Colors.bgCard, marginHorizontal: 12, borderRadius: 12, marginBottom: 8, maxHeight: 180, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.08, shadowRadius: 6, elevation: 4}}>
                            <FlatList 
                                data = {searchResults}
                                keyExtractor={(item) => item.place_id.toString()}
                                renderItem={({item, index}) => (
                                    <TouchableOpacity onPress={() => selectPlace(item)} style ={{ paddingHorizontal: 14,paddingVertical: 12, borderBottomWidth: index < searchResults.length - 1 ? 1:0, borderBottomColor: Colors.bgAccent}}>
                                        <Text style = {{fontSize: 13, color: Colors.textPrimary}} numberOfLines={2}>
                                            {item.display_name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}

                    <MapView style = {{ flex: 1}} region={mapRegion} onRegionChangeComplete={setMapRegion} onPress={handleMapPress}>
                        {meetingCoords && (<Marker coordinate={meetingCoords} />)}
                    </MapView>

                    <TouchableOpacity onPress={() => setMapVisible(false)} style= {{ margin: 16, backgroundColor: Colors.btnPrimary, borderRadius: 30, paddingVertical: 14, alignItems: 'center'}}>
                        <Text style={{ color: Colors.bgCard, fontSize: 16, fontWeight:'700'}}>Confirm</Text>
                    </TouchableOpacity>

                </View>
            </View>
          </Modal>
        </View>

        <TouchableOpacity onPress= {handleNext} disabled={!canProceed} style = {{backgroundColor: canProceed ? Colors.btnPrimary : Colors.textDisabled, borderRadius: 30, paddingVertical: 16, flexDirection: "row" , alignItems: "center", justifyContent: "center", gap:8}}>
            <Text style={{color: Colors.bgPrimary, fontSize: 16, fontWeight: "700"}}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color= {Colors.bgPrimary}/>
        </TouchableOpacity>

        <Modal visible={stateVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000040",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.bgCard,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "60%",
                paddingTop: 16,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "700",
                  marginBottom: 12,
                  color: Colors.textPrimary,
                }}
              >
                Select State
              </Text>

              <FlatList
                data={State.getStatesOfCountry(country?.code ?? "")}
                keyExtractor={(item) => item.isoCode}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedState({
                        name: item.name,
                        isoCode: item.isoCode,
                      });
                      setStateVisible(false);
                    }}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.bgAccent,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: Colors.textPrimary }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.textMuted,
                      marginTop: 24,
                      fontSize: 14,
                    }}
                  >
                    No states available
                  </Text>
                }
              />

              <TouchableOpacity
                onPress={() => setStateVisible(false)}
                style={{
                  margin: 16,
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: Colors.bgAccent,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: Colors.textSecondary, fontWeight: "600" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
