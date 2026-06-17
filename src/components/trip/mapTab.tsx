import { Colors } from "@/constants/theme";
import { useTripLocationController } from "@/src/controllers/tripLocationController";
import { Trip } from "@/src/models/Trip";
import { TripMember } from "@/src/models/TripMember";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

type Props = {
    trip: Trip;
    members: TripMember[];
};

const defaultRegion = {
        latitude: 13.7563,
        longitude: 100.5018,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
    };

const POLL_INTERVAL_MS = 20_000;

function parseMeetingPoint(meetingPoint: string | null) {
  if (!meetingPoint) return null;
  const [lat, lng] = meetingPoint.split(",").map(Number);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { latitude: lat, longitude: lng };
}

export default function MapTab({ trip, members}: Props) {
    const mapRef = useRef<MapView>(null);
    const { latestLocations, fetchLatestLocations } = useTripLocationController(
    trip.tripId,
  );

  const meetingPointCoord = parseMeetingPoint(trip.meetingPoint);
 
  const initialRegion = meetingPointCoord
    ? { ...meetingPointCoord, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : defaultRegion;
 
  // Poll for live member locations only while the trip is Active
  useEffect(() => {
    if (trip.tripStatus !== "Active") return;
 
    fetchLatestLocations();
    const interval = setInterval(fetchLatestLocations, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [trip.tripId, trip.tripStatus]);



      return (
    <View style={{ borderRadius: 16, overflow: "hidden" }}>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: 400 }}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {meetingPointCoord && (
          <Marker
            coordinate={meetingPointCoord}
            title="Meeting Point"
            description={trip.meetingPoint ?? undefined}
          >
            <View
              style={{
                backgroundColor: Colors.btnPrimary,
                borderRadius: 20,
                padding: 6,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                }}
              />
            </View>
          </Marker>
        )}
 
        {latestLocations.map((loc) => (
          <Marker
            key={loc.userId}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={`${loc.firstName} ${loc.lastName}`}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.bgAccent,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: Colors.btnPrimary,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: Colors.textMuted,
                }}
              />
            </View>
          </Marker>
        ))}
      </MapView>
 
      {trip.tripStatus !== "Active" && (
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
            backgroundColor: Colors.bgCard,
            borderRadius: 12,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13, color: Colors.textDisabled }}>
            Member locations will appear when trip starts
          </Text>
        </View>
      )}
 
      {trip.tripStatus === "Active" && latestLocations.length === 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
            backgroundColor: Colors.bgCard,
            borderRadius: 12,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13, color: Colors.textDisabled }}>
            Waiting for member locations…
          </Text>
        </View>
      )}
    </View>
  );

}