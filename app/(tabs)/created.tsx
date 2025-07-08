import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native"; // สำคัญ!
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function generateTimeSlots() {
  const now = new Date();
  let hour = now.getHours();
  let minute = Math.ceil(now.getMinutes() / 10) * 10;
  if (minute === 60) { hour += 1; minute = 0; }
  const slots = [];
  while (hour < 19 || (hour === 19 && minute === 0)) {
    const hStr = hour.toString().padStart(2, '0');
    const mStr = minute.toString().padStart(2, '0');
    slots.push(`${hStr}:${mStr}`);
    minute += 10;
    if (minute === 60) { hour += 1; minute = 0; }
    if (hour > 19 || (hour === 19 && minute > 0)) break;
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

const PEOPLE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Boss = {
  id: string;
  boss_name: string;
  pokemon_image: string;
  boss_tier?: string;
};


export default function CreatedScreen() {
  const router = useRouter(); // ใช้สำหรับเปลี่ยนหน้า
  const [modalTime, setModalTime] = useState(false); // state สำหรับ modal เลือกเวลา
  const [modalBoss, setModalBoss] = useState(false); // state สำหรับ modal เลือกบอส
  const [modalPeople, setModalPeople] = useState(false); // state สำหรับ modal เลือกจำนวนคน
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]); // state สำหรับเวลาที่เลือก
  const [bosses, setBosses] = useState<Boss[]>([]); // state สำหรับข้อมูลบอสทั้งหมด
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null); // state สำหรับบอสที่เลือก
    const [selectedPeople, setSelectedPeople] = useState(5); // state สำหรับจำนวนคนที่เลือก
  const [loading, setLoading] = useState(false); // state สำหรับ loading ปุ่มสร้างห้อง

  // ดึงข้อมูลบอสจาก API เมื่อ component mount
  useEffect(() => {
    const fetchBosses = async () => {
      try {
        const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL; // ดึง base url จาก config
        const res = await fetch(`${apiBaseUrl}/pokopartyth/api/boss/get_boss.php`); // เรียก API ข้อมูลบอส
        const json = await res.json(); // แปลงผลลัพธ์เป็น json
        setBosses(json.bosses || []); // เซ็ตข้อมูลบอส
        if (json.bosses && json.bosses.length > 0) {
          setSelectedBoss(json.bosses[0]); // เลือกบอสตัวแรกเป็นค่าเริ่มต้น
        }
      } catch (e) {
        setBosses([]); // ถ้า error ให้ set array ว่าง
      }
    };
    fetchBosses();
  }, []);

  // ฟังก์ชันสร้างห้อง (POST API ไป backend)
  const handleCreateRoom = async () => {
    if (!selectedBoss) return;
    setLoading(true);
    try {
      // ดึง user id จาก session (AsyncStorage)
      const userStr = await AsyncStorage.getItem('user');
      let userId = null;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userId = userObj?.id || userObj?.user_id || null;
        } catch {}
      }
      if (!userId) {
        setLoading(false);
        alert('กรุณาเข้าสู่ระบบใหม่');
        router.replace('/login');
        return;
      }
      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/pokopartyth/api/roomraid/post_room_raid.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boss_id: selectedBoss.id,
          boss_name: selectedBoss.boss_name,
          boss_img: selectedBoss.pokemon_image,
          boss_tier: Number(selectedBoss.boss_tier || 0),
          created_by: userId,
          time_slot: selectedTime,
          people_count: selectedPeople
        })
      });
      const json = await res.json();
      if (json.success) {
        setLoading(false);
        router.replace('/myraids'); // เปลี่ยนหน้าไปยังหน้าห้องที่สร้าง
      } else {
        setLoading(false);
        alert(json.message || 'เกิดข้อผิดพลาดในการสร้างห้อง');
      }
    } catch (e) {
      setLoading(false);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#4CB0E2' }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginTop: 60, marginBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 36, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>สร้างห้อง</Text>
      </View>

      {/* Content Card */}
      <View style={{ flex: 1, backgroundColor: '#A3D6F9', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 }}>
        {/* เลือกบอส */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 12 }}>เลือกบอส</Text>
        <TouchableOpacity onPress={() => setModalBoss(true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CB0E2', borderRadius: 20, padding: 16, marginBottom: 24, borderWidth: 3, borderColor: '#2196D9' }}>
          {selectedBoss ? (
            <>
              <Image source={{ uri: selectedBoss.pokemon_image }} style={{ width: 64, height: 64, marginRight: 16 }} />
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>{selectedBoss.boss_name}</Text>
                  {/* แสดงดาวตาม tier */}
                  <View style={{ flexDirection: 'row', marginTop: 2 }}>
                    {Array.from({ length: Number(selectedBoss.boss_tier || 0) }).map((_, i) => (
                      <MaterialIcons key={i} name="star" size={20} color="#FFD700" style={{ marginRight: 2 }} />
                    ))}
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={28} color="#fff" style={{ marginLeft: 12}} />
              </View>
            </>
          ) : (
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>กำลังโหลด...</Text>
          )}
        </TouchableOpacity>
        {/* Modal เลือกบอส */}
        <Modal
          visible={modalBoss}
          animationType="slide"
          transparent
          onRequestClose={() => setModalBoss(false)}
        >
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} onPress={() => setModalBoss(false)} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, width: '100%', padding: 24, maxHeight: 400, elevation: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 16, textAlign: 'center', color: '#4CB0E2' }}>เลือกบอส</Text>
              <ScrollView>
                {bosses.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: '#888', fontFamily: 'kanit-regular', fontSize: 18 }}>ไม่มีข้อมูลบอส</Text>
                ) : (
                  bosses.map((boss) => (
                    <TouchableOpacity
                      key={boss.id}
                      onPress={() => { setSelectedBoss(boss); setModalBoss(false); }}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: selectedBoss && selectedBoss.id === boss.id ? '#A3D6F9' : '#fff', marginBottom: 8 }}
                    >
                      <Image source={{ uri: boss.pokemon_image }} style={{ width: 48, height: 48, marginRight: 16, marginLeft: 8 }} />
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                          <Text style={{ fontSize: 18, color: '#222', fontWeight: selectedBoss && selectedBoss.id === boss.id ? 'bold' : 'normal', fontFamily: 'kanit-regular' }}>{boss.boss_name}</Text>
                          {/* แสดงดาวตาม tier */}
                          <View style={{ flexDirection: 'row', marginTop: 2 }}>
                            {Array.from({ length: Number(boss.boss_tier || 0) }).map((_, i) => (
                              <MaterialIcons key={i} name="star" size={16} color="#FFD700" style={{ marginRight: 1 }} />
                            ))}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* เลือกเวลาตีบอส */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 12 }}>เลือกเวลาตีบอส</Text>
        <TouchableOpacity onPress={() => setModalTime(true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <MaterialIcons name="calendar-today" size={24} color="#4CB0E2" style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', flex: 1 }}>{selectedTime}</Text>
          <MaterialIcons name="chevron-right" size={24} color="#4CB0E2" />
        </TouchableOpacity>
        {/* Modal เลือกเวลา */}
        <Modal
          visible={modalTime}
          animationType="slide"
          transparent
          onRequestClose={() => setModalTime(false)}
        >
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} onPress={() => setModalTime(false)} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, width: '100%', padding: 24, maxHeight: 340, elevation: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 16, textAlign: 'center', color: '#4CB0E2' }}>เลือกเวลา</Text>
              <ScrollView>
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => { setSelectedTime(slot); setModalTime(false); }}
                    style={{ paddingVertical: 16, alignItems: 'center', borderRadius: 12, backgroundColor: selectedTime === slot ? '#A3D6F9' : '#fff', marginBottom: 8 }}
                  >
                    <Text style={{ fontSize: 18, color: '#222', fontWeight: selectedTime === slot ? 'bold' : 'normal', fontFamily: 'kanit-regular', }}>{slot}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* เลือกจำนวนคน */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 12 }}>เลือกจำนวนคน</Text>
        <TouchableOpacity onPress={() => setModalPeople(true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <MaterialIcons name="person" size={24} color="#4CB0E2" style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', flex: 1 }}>{selectedPeople} คน</Text>
          <MaterialIcons name="chevron-right" size={24} color="#4CB0E2" />
        </TouchableOpacity>
        {/* Modal เลือกจำนวนคน */}
        <Modal
          visible={modalPeople}
          animationType="slide"
          transparent
          onRequestClose={() => setModalPeople(false)}
        >
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} onPress={() => setModalPeople(false)} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, width: '100%', padding: 24, maxHeight: 340, elevation: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 16, textAlign: 'center', color: '#4CB0E2' }}>เลือกจำนวนคน</Text>
              <ScrollView>
                {PEOPLE.map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => { setSelectedPeople(num); setModalPeople(false); }}
                    style={{ paddingVertical: 16, alignItems: 'center', borderRadius: 12, backgroundColor: selectedPeople === num ? '#A3D6F9' : '#fff', marginBottom: 8 }}
                  >
                    <Text style={{ fontSize: 18, color: '#222', fontWeight: selectedPeople === num ? 'bold' : 'normal', fontFamily: 'kanit-regular', }}>{num} คน</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* วิธีการใช้งาน */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 4 }}>วิธีการใช้งาน</Text>
        <View style={{ marginLeft: 12, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>1. สร้างห้องบอส</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>2. รอคนเข้าห้อง</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>3. กดคัดลอกชื่อ ผู้ใช้งาน</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222', marginBottom: 2 }}>4. ส่งคำเชิญ ในเกม</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#222' }}>5. ตีเสร็จ กดยืนยันในหน้าห้องบอส</Text>
        </View>

        {/* ปุ่มสร้างห้อง */}
        <TouchableOpacity
          style={{ backgroundColor: '#D4A63A', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
          onPress={handleCreateRoom}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>สร้างห้อง</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
