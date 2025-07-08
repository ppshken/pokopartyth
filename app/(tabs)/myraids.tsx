import CountdownTimer from '@/components/CountdownTimer'; // เปลี่ยน path ให้ตรงกับโปรเจกต์คุณ
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // สำคัญ!
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

  type Myraid = {
  id: number;
  boss_name: string;
  boss_img?: string;
  created_by?: string;
  people_count: number;
  time_slot: string;
  status?: string;
  boss_tier?: any; // เพิ่ม tier
  created_by_name?: string; // สำหรับชื่อ creator
  count?: number; // สำหรับนับจำนวนห้อง
  participants?: number;
  };

export default function MyRaidsScreen() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [myraids, setMyRaids] = useState<Myraid[]>([]);

  const fetchMyraid = async () => {
    try {
      setLoading(true);
      const sessionId = await AsyncStorage.getItem('user');
      if (!sessionId) {
        router.replace('/login');
        return;
      }

      const session = JSON.parse(sessionId); // 👈 แปลง string เป็น object
      const userId = session.id;

      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/pokopartyth/api/roomraid/get_room_by_user.php?created_by=${userId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setMyRaids(data.myraid);
      } else {
        alert(data.message);
        router.replace('/login');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlParams = (myraid: Myraid) => {
    console.log('ไปยังห้อง ID:', myraid.id);
    router.replace({ pathname: '/roomraid', params: { roomId: myraid.id } });
  };

  // ใช้ useFocusEffect เพื่อให้เรียก fetch ทุกครั้งที่เข้าหน้า
  useFocusEffect(
    useCallback(() => {
      fetchMyraid();
    }, [])
  );


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CB0E2' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#4CB0E2' }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginTop: 60, marginBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 36, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>ห้องของฉัน</Text>
      </View>

      {/* Raid List */}
      <View style={{ flex: 1, backgroundColor: '#A3D6F9', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 16 , paddingBottom: 90 }}>
        <Text style={{fontFamily: 'kanit-regular', fontSize: 18, marginBottom: 5}}>ทั้งหมด {myraids.length} ห้อง</Text>
        <FlatList
          data={myraids}
          keyExtractor={(myraid) => myraid.id.toString()}
          renderItem={({ item: myraid }) => (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#4CB0E2', borderRadius: 12, padding: 16 }}
              onPress={() => handleUrlParams(myraid)}
            >
              <Image source={{ uri: myraid.boss_img }} style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <View style={{ marginBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222' }}>{myraid.boss_name}</Text>
                  <Text style={{ fontSize: 16, fontFamily: 'kanit-regular', color: '#FFD700', marginLeft: 8 }}>{'★'.repeat(myraid.boss_tier)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: '#E76A24', backgroundColor: '#fff3e0', paddingHorizontal: 12, paddingVertical: 2, borderRadius: 12, fontFamily: 'kanit-regular' }}>
                    {myraid.time_slot}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', backgroundColor: '#D9EAF5', paddingHorizontal: 12, paddingVertical: 2, borderRadius: 12 }}>
                    {myraid.participants} / {myraid.people_count} คน
                  </Text>
                </View>

                {/* ✅ นับถอยหลัง */}
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <CountdownTimer timeSlot={myraid.time_slot} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
