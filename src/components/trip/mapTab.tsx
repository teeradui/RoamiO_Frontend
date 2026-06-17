import React, {useEffect, useRef} from "react";
import { View, Text } from "react-native";
import MapView, {Marker, PROVIDER_DEFAULT} from "react-native-maps";
import { Colors } from "@/constants/theme";
import { Trip } from "@/src/models/Trip";
import { TripMember } from "@/src/models/TripMember";

type Props = {
    trip: Trip;
    members: TripMember[];
};

export default function MapTab({ trip, members}: Props) {
    const mapRef = useRef<MapView>(null);

    const initialRegion = {
        latitude: 13.7563,
        longitude: 100.5018,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
    };

    return (
        <View style = {{borderRadius: 16, overflow: 'hidden'}}>
            <MapView ref={mapRef} style={{width:'100%', height: 400}} provider={PROVIDER_DEFAULT} initialRegion={initialRegion} showsUserLocation showsMyLocationButton>
                {trip.meetingPoint &&(
                    <Marker coordinate={initialRegion} title="Meetng Point" description={trip.meetingPoint}>
                        <View style = {{backgroundColor: Colors.btnPrimary, borderRadius: 20, padding:6, borderWidth: 2, borderColor: '#fff'}}>
                            <View style={{ width:10, height:10, borderRadius:5, backgroundColor: 'fff'}}/>
                        </View>
                    </Marker>
                )}

                {members.map((members, index) => (
                    <Marker key={members.participantId} coordinate={{latitude: initialRegion.latitude + (index * 0.01), longitude: initialRegion.longitude + (index * 0.01)}} title={`Member ${members.userId}`}>
                        <View style={{ width: 36, height:36, borderRadius: 18, backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.btnPrimary}}>
                            <View style={{ width:16, height:16, borderRadius: 8, backgroundColor: Colors.textMuted}}/>
                        </View>
                    </Marker>
                ))}
            </MapView>

            {members.length === 0 && (
                <View style= {{ position: 'absolute', bottom: 16, left:16, right: 16, backgroundColor: Colors.bgCard, borderRadius: 12, padding: 12, alignItems:'center'}}>
                    <Text style={{ fontSize: 13, color: Colors.textDisabled}}>
                        Member locations will appear when trip starts
                    </Text>
                </View>
            )}
        </View>
    );
}