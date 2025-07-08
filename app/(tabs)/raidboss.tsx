import AsyncStorage from '@react-native-async-storage/async-storage';
import CountdownTimer from '@/components/CountdownTimer';
import { useFocusEffect } from "@react-navigation/native"; // สำคัญ!
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Room = {
  id: string;
  boss_name: string;
  boss_img?: string;
  created_by?: string;
  people_count: number;
  time_slot: string;
  status?: string;
  boss_tier?: number; // เพิ่ม tier
  creator_name?: string; // สำหรับชื่อ creator
  participants?: number;
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ดึงข้อมูลห้องบอสจาก API
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const sessionId = await AsyncStorage.getItem('sessionId');
      const sessionUser = await AsyncStorage.getItem('user');
      if (!sessionId || !sessionUser) {
        router.replace('/login');
        return;
      }

      const session = JSON.parse(sessionUser); // 👈 แปลง string เป็น object
      const userId = session.id;

      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/pokopartyth/api/roomraid/get_room_raid.php?created_by=${userId}`);
      const json = await res.json();
      setRooms(json.rooms || []);
    } catch (e) {
      setRooms([]);
    }
    setLoading(false);
  };

  // ใช้ useFocusEffect เพื่อให้เรียก fetch ทุกครั้งที่เข้าหน้า
  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  // ฟังก์ชันสำหรับรีเฟรชข้อมูลเมื่อดึงข้อมูลใหม่
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRooms().then(() => setRefreshing(false));
  }, []);

  const handlePress = async (room: Room) => {
    try {
      const sessionId = await AsyncStorage.getItem('user');
      if (!sessionId) {
        router.replace('/login');
        return;
      }

      const session = JSON.parse(sessionId);
      const userId = session.id;
      const roomId = room.id;

      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;

      // 🔻 POST เข้าร่วมห้อง
      const response = await fetch(`${apiBaseUrl}/pokopartyth/api/user_roomraid/post_user_roomraid.php?user_id=${userId}&raid_rooms_id=${roomId}`,)
      const result = await response.json();

      if (result.status === 'success') {
        // ✅ ไปหน้า joinroom พร้อมส่ง roomId ไปด้วย
        router.replace({ pathname: '/joinroom', params: { roomId: roomId } });
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการเข้าร่วมห้อง');
      }

    } catch (error) {
      console.error('เข้าร่วมห้องไม่สำเร็จ:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CB0E2' }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }


  return (
    <View style={{ flex: 1, backgroundColor: "#2196D9", paddingBottom: 50 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#F4B400",
          paddingTop: 60,
          paddingBottom: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 36,
            fontWeight: "bold",
            letterSpacing: 1,
            fontFamily: "kanit-regular",
          }}
        >
          ห้องบอส
        </Text>
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <ActivityIndicator size="large" color="#2196D9" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {rooms.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontFamily: "kanit-regular",
                fontSize: 20,
                marginTop: 40,
              }}
            >
              ไม่มีห้องบอสในขณะนี้
            </Text>
          ) : (
            rooms.map((room) => (
              <TouchableOpacity
                key={room.id}
                activeOpacity={0.85}
                onPress={() => handlePress(room)}
                style={{
                  backgroundColor: "#7EC3E6",
                  borderRadius: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  marginBottom: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View style={{ marginRight: 16 }}>
                  {room.boss_img ? (
                    <Image
                      source={{ uri: room.boss_img }}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        backgroundColor: "#fff",
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        backgroundColor: "#ccc",
                      }}
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      fontFamily: "kanit-regular",
                      color: "#222",
                    }}
                  >
                    {room.boss_name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "kanit-regular",
                        color: "#222",
                        marginRight: 12,
                      }}
                    >
                      {room.status === "open"
                        ? "เปิดรับสมาชิก"
                        : room.status === "full"
                        ? "เต็ม"
                        : room.status === "closed"
                        ? "ปิด"
                        : ""}
                    </Text>
                  </View>
                  {/* แสดงชื่อ creator ใต้ปุ่ม */}
                  {room.creator_name && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#444",
                        fontFamily: "kanit-regular",
                        marginBottom: 8,
                      }}
                    >
                      {room.creator_name}
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#D9EAF5",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        marginRight: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "kanit-regular",
                          color: "#222",
                          fontSize: 12,
                        }}
                      >
                       {room.participants} / {room.people_count} คน
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#fff3e0",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        marginRight: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "#E76A24",
                          fontWeight: "bold",
                          fontFamily: "kanit-regular",
                          fontSize: 12,
                        }}
                      >
                        {room.time_slot} น.
                      </Text>
                    </View>
                    <CountdownTimer timeSlot={room.time_slot} />
                  </View>
                </View>
                {/* ดาวด้านขวา */}
                <View
                  style={{ marginLeft: 12, alignItems: "center", minWidth: 48 }}
                >
                  {room.boss_tier ? (
                    <View style={{ flexDirection: "row" }}>
                      {Array.from({ length: room.boss_tier }).map((_, i) => (
                        <Text
                          key={i}
                          style={{
                            fontSize: 22,
                            color: "#FFD700",
                            marginHorizontal: 1,
                          }}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
