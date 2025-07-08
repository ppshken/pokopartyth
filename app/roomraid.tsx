import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

export default function RoomRaidScreen() {
  const { roomId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [loadingpage, setLoadingpage] = useState(false);
  const [leaveroom, setLeaveroom] = useState(false);  
  const [raidboss, setRaidboss] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showFailReason, setShowFailReason] = useState(false);
  const [reviewScore, setReviewScore] = useState<number|null>(null);
  const [failReason, setFailReason] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [reviewError, setReviewError] = useState(false);
  const [failError, setFailError] = useState(false);
  const [room, setRoom] = useState<any>('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [countdownText, setCountdownText] = useState('');

  const failReasons = [
    'สมาชิกไม่ครบ',
    'หัวห้องเชิญช้า',
    'เน็ตหลุด',
    'บอสแข็งเกินไป',
    'อื่นๆ'
  ];
  const router = useRouter();

  useEffect(() => { // แสดงข้อมูล
    let interval: NodeJS.Timeout;
    setLoadingpage(true);
    const fetchRoomData = async () => {
      try {        
        const sessionId = await AsyncStorage.getItem('user');
        if (!sessionId) {
          router.replace('/login');
          return;
        } 
        const session = JSON.parse(sessionId);
        const user_id = session.id;
        setUserId(user_id);

        const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/pokopartyth/api/roomraid/get_room_by_id.php?roomraid_id=${roomId}`);
        const text = await response.text();

        try {
          const data = JSON.parse(text);
          if (data.status === 'success') {
            setRoom(data.room);
            setParticipants(data.participants);
          } else {
            alert(data.message);
            router.replace('/(tabs)/myraids');
          }
        } catch (jsonErr) {
          console.error('❌ JSON Parse Error:', text); // ดูว่าได้ HTML กลับมารึเปล่า
        }
        setLoadingpage(false);
      } catch (e) {
        console.error('เกิดข้อผิดพลาด', e);
      } finally {
      }
    };

    if (roomId) {
        fetchRoomData(); // ดึงครั้งแรกทันที     
        interval = setInterval(fetchRoomData, 3000); // เริ่ม interval ทุก 3 วินาที
      }
      return () => clearInterval(interval); // เคลียร์ interval เมื่อออกจาก component
    }, [roomId]);

  useEffect(() => {  // แสดงเวลา
  const timeSlot = room.time_slot;

  const updateCountdown = () => {
    if (!timeSlot || !timeSlot.includes(':')) {
      setCountdownText('ไม่มีข้อมูลเวลา');
      return;
    }

    const [hour, minute] = timeSlot.split(':').map(Number);
    const now = new Date();
    const target = new Date();

    target.setHours(hour, minute, 0, 0);

    if (target < now) {
      setCountdownText('หมดเวลาแล้ว');
      return;
    }

    const diffMs = target.getTime() - now.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours < 1) {
      setCountdownText(`อีก ${minutes} นาที ${seconds} วินาที`);
    } else {
      setCountdownText(`อีก ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
    }
  };

    updateCountdown(); // เรียกทันที
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [room.time_slot]);


  const handleCopy = async () => { // copy รายชื่อ
      const namesList = participants.map(p => p.trainer_name).join(', ');
      await Clipboard.setStringAsync(namesList);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 700);
    };

  const handleLeave = async () => { // ส่ง API ออกจากห้อง
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
        alert('ออกจากห้องสำเร็จ');
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

  const handleInvite = async () => { // ส่งคำเชิญตีบอส
    setLoading(true)
    try {
      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/pokopartyth/api/roomraid/update_invite_room_raid.php?raid_rooms_id=${roomId}`);
      const json = await res.json();
      if (json.success === true) {
        setLoading(false)
      } else {
        alert(json.message || 'เข้าห้องไม่สำเร็จ');
      }
    } catch (e) {
      console.error('❌ handleLeave Error:', e);
    }
    
  };
  

  const handleLeaveRoom = async () => { // แสดง modal ออกจากห้อง
    const sessionId = await AsyncStorage.getItem('user');
    if (!sessionId) return;

    const session = JSON.parse(sessionId);
    const userId = session.id;

    if (room?.created_by === userId) {
      router.replace('/(tabs)/myraids'); // กลับไปหน้าเดิม ถ้าเจ้าของห้องออกเอง
      return;
    }

    setLeaveroom(true); // เปิด modal ยืนยันสำหรับคนที่ไม่ใช่เจ้าของห้อง
  };

  const handleStay = () => { // อยู่ต่อ ปิด modal 
    setLeaveroom(false);
  };

  const handleRaidBoss = () => { //เปิด modal ตีบอส
    setRaidboss(true);
  };

  const handleReviewSuccess = () => {
    setRaidboss(false);
    setShowReview(true);
  };

  const handleReviewFail = () => {
    setRaidboss(false);
    setShowFailReason(true);
  };

  const handleSubmitReview = () => {
    if (reviewScore === null) {
      setReviewError(true);
      return;
    }
    setReviewError(false);
    setShowReview(false);
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      router.replace('/(tabs)/raidboss');
    }, 2000);
  };

  const handleSubmitFailReason = () => {
    if (!failReason) {
      setFailError(true);
      return;
    }
    setFailError(false);
    setShowFailReason(false);
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      router.replace('/(tabs)/raidboss');
    }, 2000);
  };

  const isReadyToInvite =
    room.people_count === room.joined_count &&
    room.invite === 'false' &&
    room.created_by === userId;

  if (loadingpage) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2196D9' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60, marginBottom: 8, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={handleLeaveRoom} style={{ marginRight: 8 }}>
          <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
        </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 36, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 40, fontFamily: 'kanit-regular' }}>ห้องตีบอส</Text>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Image source={{ uri: room.boss_img }} style={{ width: 140, height: 140, borderRadius: 70, borderWidth: 6, borderColor: '#fff', marginBottom: 8 }} />
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 0, fontFamily: 'kanit-regular' }}>{room.boss_name}</Text>
        <TouchableOpacity onPress={() => router.push('/chatroom')}>
          <Text style={{ color: '#222', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 8, fontFamily: 'kanit-regular' }}>ห้องแชท</Text>
        </TouchableOpacity>
      </View>
      {/* Card */}
      <View style={{ backgroundColor: '#A3D6F9', borderRadius: 32, marginHorizontal: 0, marginBottom: 0, padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 8, fontFamily: 'kanit-regular' }}>{room.time_slot} น.</Text>
        <View style={{alignItems: 'center', marginBottom: 15}}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', backgroundColor: '#D9EAF5', paddingHorizontal: 12, paddingVertical: 2, borderRadius: 12 }}>{room.joined_count} / {room.people_count} คน</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ backgroundColor: countdownText === 'หมดเวลาแล้ว' ? '#D9534F' : '#3498DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 4 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, fontFamily: 'kanit-regular' }}>
              {countdownText}
            </Text>
          </View>

        {room.created_by === userId && (
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={handleCopy}>
          <MaterialIcons name="content-copy" size={20} color="#2196D9" style={{ marginLeft: 12, marginRight: 12}} />
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222', fontFamily: 'kanit-regular', textDecorationLine: 'underline' }}>ก็อปปี้ รายชื่อ</Text>
        </TouchableOpacity>
        )}

        </View>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: 'kanit-regular', marginBottom: 16}}><Text style={{color: '#F4B400'}}>★</Text> {room.trainer_name}</Text>
        </View> 
        {/* Member List */}
        {participants.map((m, i) => (
          <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginLeft: 18 }}>
            {m.isOwner && <MaterialIcons name="star" size={22} color="#F4B400" style={{ marginRight: 4 }} />}
            <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 18, flex: 1, fontFamily: 'kanit-regular' }}>{m.trainer_name}</Text>
            <Text style={{ color: '#222', fontSize: 18, fontFamily: 'kanit-regular' }}>เลเวล {m.level}</Text>
            {m.status === 'true' ? (
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', backgroundColor: '#27AE60', padding: 2, paddingHorizontal: 5, borderRadius: 5, marginLeft: 10, fontFamily: 'kanit-regular' }}>เพิ่มเพื่อนแล้ว</Text>
            ) : (
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', backgroundColor: '#E74C3C', padding: 2, paddingHorizontal: 5, borderRadius: 5, marginLeft: 5, fontFamily: 'kanit-regular' }}>ยังไม่เพิ่มเพื่อน</Text>
              )}
          </View>
        ))}

        {/* Info */}
        {room.invite === 'true' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
            <MaterialIcons name="info" size={28} color="#E74C3C" style={{ marginRight: 8 }} />
            <Text style={{ color: '#E74C3C', fontWeight: 'bold', fontSize: 16, fontFamily: 'kanit-regular' }}>หัวห้องได้ทำการเชิญตีบอสแล้ว</Text>
          </View>
        )}
          
        {/* ปุ่มส้งคำเชิญ */}
        {isReadyToInvite && (
          <TouchableOpacity style={{ backgroundColor: '#F4B400', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }} onPress={handleInvite}>
            { loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>ส่งคำเชิญแล้ว</Text>
            )}             
          </TouchableOpacity>
        )}

        {/* แสดงรอเชิญ */}
        {room.invite === 'false' && room.people_count === room.joined_count && (
          <View style={{ backgroundColor: '#eee', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 16, opacity: 0.7 }}>
            <Text style={{ color: '#aaa', fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>รอหัวห้องกดส่งคำเชิญ</Text>
          </View>
        )}
          
        {/* แสดงรอเพื่อนครบ */}
        {room.people_count !== room.joined_count && room.invite === 'false' &&(
          <View style={{ backgroundColor: '#eee', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 16, opacity: 0.7 }}>
            <Text style={{ color: '#aaa', fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>รอสมาชิกเพิ่มเพื่อนให้ครบ</Text>
          </View>
        )}

          <TouchableOpacity style={{ backgroundColor: '#27AE60', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }} onPress={handleRaidBoss}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>ตีบอสเสร็จแล้ว?</Text>
          </TouchableOpacity>
      </View>
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

      {/* Modal ตีบอสเสร็จ */}
      <Modal visible={raidboss} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 16, fontFamily: 'kanit-regular' }}>คุณตีบอสเสร็จแล้ว ?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={handleReviewSuccess}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: '#27AE60', padding: 10, borderRadius: 10, fontFamily: 'kanit-regular' }}>สำเร็จ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReviewFail}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: '#E74C3C', padding: 10, borderRadius: 10, fontFamily: 'kanit-regular' }}>ไม่สำเร็จ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal รีวิวสำเร็จ */}
      <Modal visible={showReview} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 300 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#27AE60', marginBottom: 16, fontFamily: 'kanit-regular' }}>ให้คะแนนห้องนี้ (เต็ม 10)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
              {[...Array(10)].map((_, i) => (
                <TouchableOpacity key={i+1} onPress={() => { setReviewScore(i+1); setReviewError(false); }}>
                  <Text style={{ fontSize: 22, fontWeight: reviewScore === i+1 ? 'bold' : 'normal', color: reviewScore === i+1 ? '#F4B400' : '#888', marginHorizontal: 2, fontFamily: 'kanit-regular' }}>{i+1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {reviewError && <Text style={{ color: '#E74C3C', fontSize: 16, fontWeight: 'bold', marginBottom: 8, fontFamily: 'kanit-regular' }}>กรุณาเลือกคะแนน</Text>}
            <TouchableOpacity onPress={handleSubmitReview} style={{ backgroundColor: '#27AE60', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>บันทึกการรีวิว</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal รีวิวไม่สำเร็จ */}
      <Modal visible={showFailReason} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 300 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#E74C3C', marginBottom: 16, fontFamily: 'kanit-regular' }}>เลือกสาเหตุที่ตีบอสไม่สำเร็จ</Text>
            {failReasons.map((reason) => (
              <TouchableOpacity key={reason} onPress={() => { setFailReason(reason); setFailError(false); }} style={{ width: '100%', marginBottom: 8, backgroundColor: failReason === reason ? '#F5B7A2' : '#eee', borderRadius: 8, padding: 10 }}>
                <Text style={{ color: '#222', fontSize: 16, fontFamily: 'kanit-regular' }}>{reason}</Text>
              </TouchableOpacity>
            ))}
            {failError && <Text style={{ color: '#E74C3C', fontSize: 16, fontWeight: 'bold', marginBottom: 8, fontFamily: 'kanit-regular' }}>กรุณาเลือกรายการ</Text>}
            <TouchableOpacity onPress={handleSubmitFailReason} style={{ backgroundColor: '#E74C3C', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 12 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>บันทึกการรีวิว</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal บันทึกสำเร็จ */}
      <Modal visible={showSaved} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 220 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#27AE60', fontFamily: 'kanit-regular' }}>บันทึกรีวิวสำเร็จ!</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#27AE60', fontFamily: 'kanit-regular' }}>ขอบคุณ!</Text>
          </View>
        </View>
      </Modal>

      {/* Modal แจ้งคัดลอก */}
      <Modal visible={showCopied} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#3498DB', marginBottom: 0 }}>คัดลอกรายชื่อเทรนเนอร์แล้ว</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
