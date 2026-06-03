{/* ต้องทำ backendEnpoint 
    1. GET /api/users/search?username=xxx — ค้นหา user จาก username
    2. GET /api/users/:userId/friends — ดึง friend list */}

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Trip } from '@/src/models/Trip';
import { TripMember } from '@/src/models/TripMember';
import { useTripMemberController } from '@/src/controllers/tripMemberController';
import { useTripInviteController } from '@/src/controllers/tripInviteController';
import Medal from '@/assets/icons/medal.svg';
import UserAdd from '@/assets/icons/mingcute_user-add-line.svg';
import UserRemove from '@/assets/icons/mingcute_user-remove-line.svg';


type Props = {
    trip: Trip;
    members: TripMember[];
    onRefresh: () => void;
};

type FriendUser = {
    userId: number;
    username: string;
    profileImage?: string | null;
    score?: number;
};

export default function MembersTab({ trip, members, onRefresh}: Props) {
    const {removeMember, loading} =useTripMemberController(trip.tripId);

    const { sendInvite, loading: inviteLoading } = useTripInviteController(trip.tripId);
    const [ addVisible, setAddVisible ] =useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
    const [friendList, setFriendList] = useState<FriendUser[]>([]); 

    const handleAddMember = async (userId: number) => {
        const result = await sendInvite({ userId });
        if (result) {
            setAddVisible(false);
            setSearchQuery('');
            setSearchResults([]);
            onRefresh();
        } else {
            setInviteError('Failed to send invite. Please check the user ID and try again.');
        }
    };
    
    const handleRemove = async (participantId: number) => {
        await removeMember(participantId);
        onRefresh();
    };

    return (
        <View style ={{gap: 12}}>
            <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6}}>
                    <Ionicons name="people" size={18} color={Colors.iconOrange}/>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textPrimary}}>
                        Trip Members ({members.length})
                    </Text>
                </View>

                <TouchableOpacity onPress={() => setAddVisible(true)} style={{flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.btnAdd, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6}}>
                    <UserAdd
                        width={14}
                        height={14}
                    />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textAddBtn}}>Add</Text>
                </TouchableOpacity>
            </View>

            <View style ={{backgroundColor: Colors.bgCard, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4, elevation:1}}>
                {members.map((member, index) => {
                    const isOwner = member.userId === trip.createdBy;
                    return (
                        <View key = {member.participantId} style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: index < members.length - 1 ? 1 : 0, borderBottomColor: Colors.bgAccent}}>
                           <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bgAccent, marginRight: 12, overflow: 'hidden'}}>
                                {member.profileImage ? (
                                    <Image source={{ uri: member.profileImage}} style={{ width: 44, height: 44, borderRadius: 22}}/>
                                ):(
                                    <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center'}}>
                                        <Ionicons name="person-outline" size={22} color={Colors.textMuted}/>
                                    </View>
                                )}
                           </View>

                           <View style={{flex: 1}}>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.textPrimary}}>
                                {member.username ?? `User ${member.userId}`}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2}}>
                                <Medal
                                    width={14}
                                    height={14}
                                />
                                <Text style={{ fontSize: 12, fontWeight: '600', color: (member.score ?? 0) >= 200 ? Colors.green : Colors.red}}>
                                    {member.score ?? 0}
                                </Text>
                            </View>
                           </View> 

                           {isOwner ? (
                            <Text style={{fontSize: 13, color: Colors.textMuted, fontWeight: '500'}}>
                                Owner
                            </Text>
                           ):(
                            <TouchableOpacity onPress={() => handleRemove(member.participantId)} style={{width: 32, height: 32, borderRadius: 16, backgroundColor:Colors.btnRemove, alignItems: 'center', justifyContent: 'center'}}>
                                <UserRemove
                                    width={14}
                                    height={14}
                                />
                            </TouchableOpacity>
                           )}
                        </View>
                    );
                })}
            </View>
            <Modal visible={addVisible} animationType="slide" transparent>
                    <View style={{ flex:1, backgroundColor: '#00000050', justifyContent: 'flex-end'}}>
                        <View style={{ backgroundColor: Colors.bgCard, borderTopRightRadius: 24, borderTopLeftRadius: 24, padding: 24, gap: 16, maxHeight: '80%'}}>

                            <Text style={{fontSize: 18, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center'}}>
                                Add Member
                            </Text>

                            <View style={{ backgroundColor: Colors.bgAccent, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8}}>
                                <Ionicons name="search-outline" size={18} color={Colors.textMuted}/>
                                <TextInput style = {{flex: 1, paddingVertical: 12, fontSize: 14, color: Colors.textPrimary}} placeholder="Enter friend's username" placeholderTextColor={Colors.textDisabled} value={searchQuery} onChangeText={setSearchQuery} />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                                        <Ionicons name="close-circle" size={16} color={Colors.textMuted}/>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <FlatList
                                data={searchResults.length > 0 ? searchResults : friendList}
                                keyExtractor={(item) => item.userId.toString()}
                                ListHeaderComponent={
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textMuted, marginBottom: 8}}>
                                        {searchResults.length > 0 ? 'Search Results' : 'Your Friends'}
                                    </Text>
                                }
                                ListEmptyComponent={
                                    <View style={{ alignItems: 'center', paddingVertical: 24, gap: 8}}>
                                        <Ionicons name="people-outline" size={32} color={Colors.textDisabled}/>
                                        <Text style={{ fontSize: 13, color: Colors.textDisabled }}>
                                            {searchResults.length > 0 ? 'No matching friends found' : 'No friends yet'}
                                        </Text>
                                    </View>
                                }
                                renderItem={({ item }) => {
                                    const alreadyMember = members.some((m) => m.userId === item.userId);
                                    return (
                                        <TouchableOpacity onPress={() => !alreadyMember && handleAddMember(item.userId)} disabled={alreadyMember} style={{ flexDirection: 'row', alignItems: 'center',paddingVertical: 12, gap: 12, opacity: alreadyMember ? 0.4 : 1}}>

                                            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bgAccent, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
                                                {item.profileImage ? (
                                                    <Image source={{ uri: item.profileImage}} style={{width: 44, height: 44}}/>
                                                ) : (
                                                    <Ionicons name="person-outline" size={22} color={Colors.textMuted}/>
                                                )}
                                            </View>

                                            <View style = {{flex: 1}}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textPrimary}}>
                                                    {item.username}
                                                </Text>
                                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2}}>
                                                    <Medal width={12} height={12}/>
                                                    <Text style={{ fontSize: 12, color: (item.score ?? 0) >= 200 ? Colors.green : Colors.red, fontWeight: '600'}}>
                                                        {item.score ?? 0}
                                                    </Text>
                                                </View>
                                            </View>

                                            {alreadyMember ? (
                                                <Text style={{ fontSize: 12, color: Colors.textMuted}}>Already in trip</Text>
                                            ) : (
                                                <View style={{ backgroundColor: Colors.btnPrimary, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6}}>
                                                    <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.bgCard}}>Add member</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}    
                            />

                            <TouchableOpacity onPress={() => {setAddVisible(false); setSearchQuery(''); setSearchResults([]); }} style={{ alignItems: 'center', paddingVertical: 8}}>
                                <Text style={{ fontSize: 14, color: Colors.textMuted}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
        </View>
    );
}