import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export default function JoinRoomScreen() {
  const { roomId } = useLocalSearchParams();
  const [seconds, setSeconds] = useState(120);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveroom, setLeaveroom] = useState(false);
  const [addfriend, setAddfriend] = useState(false);
  const [showexit, setShowexit] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();
  const [room, setRoom] = useState<any>('');


  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const sessionId = await AsyncStorage.getItem('user');
        if (!sessionId) {
          router.replace('/login');
          return;
        }

        const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/pokopartyth/api/roomraid/get_room_by_id.php?roomraid_id=${roomId}`);
        const text = await response.text();

        try {
          const data = JSON.parse(text);
          if (data.status === 'success') {
            setRoom(data.room);
          } else {
            alert(data.message);
            router.replace('/(tabs)/myraids');
          }
        } catch (jsonErr) {
          console.error('❌ JSON Parse Error:', text); // ดูว่าได้ HTML กลับมารึเปล่า
        }

      } catch (e) {
        console.error('เกิดข้อผิดพลาด', e);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);
  
  useEffect(() => {
    setSeconds(120); // ตั้งค่าเวลาเริ่มต้นเป็น 120 วินาที
  }, []);

  useEffect(() => { // เริ่มนับถอยหลังเมื่อ seconds เปลี่ยนแปลง
    if (seconds === 0) {
      setShowTimeout(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [seconds]);

  const handleTimeoutOk = () => {
    setShowTimeout(false);
    handleLeave();
    router.replace('/(tabs)/raidboss'); // Navigate to the raid boss screen
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(room.trainer_code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 700);
  };

  const handleBack = () => {
    setLeaveroom(true);
  };

  const handleStay = () => {
    setLeaveroom(false);
    setAddfriend(false);
  };

  const handleLeave = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('user');
      if (!sessionId) {
        router.replace('/login');
        return;
      }

      const session = JSON.parse(sessionId);
      const userId = session.id;

      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/pokopartyth/api/user_roomraid/delete_user_roomraid.php?raid_rooms_id=${roomId}&user_id=${userId}`);
      const json = await res.json();

      if (json.success === true) {
        router.replace('/(tabs)/raidboss'); // กลับหน้าเดิม
      } else {
        alert(json.message || 'ออกจากห้องไม่สำเร็จ');
      }
    } catch (e) {
      console.error('❌ handleLeave Error:', e);
      setLeaveroom(false); // ตั้งค่า flag เผื่อใช้ใน UI
      alert('เกิดข้อผิดพลาดระหว่างออกจากห้อง');
    }
  };

  const handleAddfriendsuccess = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('user');
      if (!sessionId) {
        router.replace('/login');
        return;
      }

      const session = JSON.parse(sessionId);
      const userId = session.id;

      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/pokopartyth/api/user_roomraid/update_status_user_roomraid.php?raid_rooms_id=${roomId}&user_id=${userId}`);
      const json = await res.json();

      if (json.success === true) {
        router.replace({ pathname: '/roomraid', params: { roomId } });
      } else {
        alert(json.message || 'เข้าห้องไม่สำเร็จ');
      }
    } catch (e) {
      console.error('❌ handleLeave Error:', e);
      setAddfriend(false); // ตั้งค่า flag เผื่อใช้ใน UI
      alert('เกิดข้อผิดพลาดระหว่างออกจากห้อง');
    }
    
  };

  const handleAddfriend = () => {
    setAddfriend(true);
  };

  if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CB0E2' }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#4CB0E2' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60, marginBottom: 20, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={handleBack} style={{ marginRight: 8 }}>
          <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', fontFamily: 'kanit-regular', flex: 1, textAlign: 'center', marginRight: 40 }}>เข้าห้อง</Text>
      </View>
      {/* Content Card */}
      <View style={{ flex: 1, backgroundColor: '#A3D6F9', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 }}>
        {/* เวลานับถอยหลัง */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ backgroundColor: '#FF6F1A', borderRadius: 8, paddingHorizontal: 32, paddingVertical: 12 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'kanit-regular', fontSize: 20 }}>{seconds} วินาที</Text>
          </View>
        </View>
        {/* รหัสเทรนเนอร์ */}
        <View style={{ backgroundColor: '#fff', borderRadius: 12, marginBottom: 24, paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222' }}>{room.trainer_code}</Text>
        </View>
        {/* ปุ่มคัดลอก */}
        <TouchableOpacity onPress={handleCopy} style={{ backgroundColor: '#3498DB', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>คัดลอกรหัสเทรนเนอร์</Text>
        </TouchableOpacity>
        {/* ปุ่มเพิ่มเพื่อน */}
        <TouchableOpacity style={{ backgroundColor: '#27AE60', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 32 }} onPress={handleAddfriend}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>เพิ่มเพื่อนในเกมแล้ว?</Text>
        </TouchableOpacity>
        {/* ขั้นตอน */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 8, color: '#222' }}>ขั้นตอนการเข้าห้อง</Text>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>1. คัดลอกรหัส เทรนเนอร์</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold',  fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>2. เพิ่มเพื่อนในเกม <Text style={{ fontWeight: 'bold' }}>Pokemon GO</Text></Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold',  fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>3. ยืนยันว่า เพิ่มเพื่อนแล้ว</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold',  fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>4. รอหัวห้องทำการเชิญตีบอส</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold',  fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>5. ทำการยืนยันผลลัพธ์การตีบอส</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold',  fontFamily: 'kanit-regular', color: '#222' }}>6. รีวิว</Text>
        </View>
      </View>
      {/* Modal หมดเวลา */}
      <Modal visible={showTimeout} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#E74C3C', marginBottom: 16 }}>หมดเวลา</Text>
            <TouchableOpacity onPress={handleTimeoutOk} style={{ backgroundColor: '#4CB0E2', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>ตกลง</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal แจ้งคัดลอก */}
      <Modal visible={showCopied} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#3498DB', marginBottom: 0 }}>คัดลอกรหัสเทรนเนอร์แล้ว</Text>
          </View>
        </View>
      </Modal>
      {/* Modal ออกจากห้อง */}
      <Modal visible={leaveroom} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16, fontFamily: 'kanit-regular' }}>คุณต้องการออกจากห้อง ?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={handleStay}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: '#4CB0E2', padding: 10, borderRadius: 10, fontFamily: 'kanit-regular' }}>อยู่ต่อ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLeave}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: '#E74C3C', padding: 10, borderRadius: 10, fontFamily: 'kanit-regular' }}>ออกจากห้อง</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal เพิ่มเพื่อน */}
      <Modal visible={addfriend} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16, fontFamily: 'kanit-regular' }}>คุณเพิ่มเพื่อนในเกมแล้ว ?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={handleStay}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: '#E74C3C', padding: 10, borderRadius: 10, fontFamily: 'kanit-regular' }}>กลับ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddfriendsuccess}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: '#27AE60', padding: 10, borderRadius: 10, fontFamily: 'kanit-regular' }}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
