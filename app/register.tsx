import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TEAMS = [
  { id: 1 , label: 'Mystic (น้ำเงิน)', value: 'mystic', img: 'https://static.wikia.nocookie.net/pokemongo/images/f/f4/Team_Mystic.png/revision/latest?cb=20160717150716' },
  { id: 2 , label: 'Valor (แดง)', value: 'valor', img: 'https://static.wikia.nocookie.net/pokemongo/images/2/22/Team_Valor.png/revision/latest?cb=20160717150715' },
  { id: 3 , label: 'Instinct (เหลือง)', value: 'instinct', img: 'https://static.wikia.nocookie.net/pokemongo/images/d/d4/Team_Instinct.png/revision/latest?cb=20200803123751' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [level, setLevel] = useState('');
  const [team, setTeam] = useState('');
  const [modalTeam, setModalTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [require, setRequire] = useState(false);
  const [register, setRegister] = useState(false);
  const [alert, setAlert] = useState('');


  // ฟังก์ชันตรวจสอบรูปแบบอีเมล (Email validation)
  const isValidEmail = (email: string) => {
    // ใช้ regex เพื่อตรวจสอบว่า email ถูกต้องหรือไม่
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ฟังก์ชันสำหรับสมัครสมาชิก (Register)
  const handleRegister = async () => {
    // ถ้ารหัสผ่านน้อยกว่า 10 ตัว ไม่ให้ดำเนินการต่อ
    if (password.length > 0 && password.length < 10) {
      return;
    }
    // ถ้าข้อมูลไม่ครบ ให้แสดง modal แจ้งเตือน
    if (!email || !password || !trainerName || !level || !team) {
      setRequire(true);
      return;
    }
    setLoading(true); // แสดง loading
    try {
      // ดึง API_BASE_URL จาก config
      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL; // เรียก API_BASE_URL จากไฟล์ .env
      // เรียก API สำหรับสมัครสมาชิก
      const res = await fetch(`${apiBaseUrl}/pokopartyth/api/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          trainer_name: trainerName,
          friend_code: friendCode,
          level,
          team,
        }),
      });
      // แปลงผลลัพธ์เป็น json
      const data = await res.json();
      setLoading(false); // ปิด loading
      // ตั้งค่าข้อความแจ้งเตือนผลลัพธ์
      setAlert(data.message || (data.success ? 'สมัครสมาชิกสำเร็จ' : 'เกิดข้อผิดพลาด'));
      setRegister(true); // แสดง modal ผลลัพธ์
    } catch (e) {
      setLoading(false); // ปิด loading
      setAlert('เกิดข้อผิดพลาด'); // แจ้ง error
      setRegister(true); // แสดง modal error
    }
  };

  // ฟังก์ชันเมื่อกดปุ่ม "ตกลง" ใน modal ผลลัพธ์การสมัครสมาชิก
  const handleRegisterOk = () => {
    setRegister(false); // ปิด modal
    setAlert(''); // ล้างข้อความแจ้งเตือน
    // ถ้าสมัครสมาชิกสำเร็จ ให้ไปหน้า login
    if (alert === 'สมัครสมาชิกสำเร็จ') {
      router.replace('/login'); // Navigate to login screen after registration
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#A3D6F9' }}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 48, left: 16, zIndex: 10, borderRadius: 20, padding: 4 }}>
        <MaterialIcons name="arrow-back-ios" size={28} color="#222" />
      </TouchableOpacity>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontSize: 32, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#111', marginBottom: 32, marginTop: 32 }}>สร้างบัญชีใหม่</Text>
          <TextInput
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 2,
              borderColor:
                email.length > 0 && (!isValidEmail(email) && emailTouched)
                  ? '#E74C3C'
                  : '#111',
              padding: 16,
              fontSize: 18,
              marginBottom:
                email.length > 0 && (!isValidEmail(email) && emailTouched)
                  ? 4
                  : 24,
              fontWeight: 'bold',
              fontFamily: 'kanit-regular',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}
            placeholder="อีเมลล์"
            placeholderTextColor="#888"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (!emailTouched) setEmailTouched(true);
            }}
            onBlur={() => setEmailTouched(true)}
            autoCapitalize="none"
            keyboardType="email-address"
            maxLength={30}
          />
          {email.length > 0 && (!isValidEmail(email) && emailTouched) && (
            <Text style={{ color: '#E74C3C', fontSize: 14, marginBottom: 15, fontFamily: 'kanit-regular' }}>
              กรุณากรอกอีเมลล์ให้ถูกต้อง
            </Text>
          )}
          {email.length > 0 && isValidEmail(email) && (
            <View style={{ marginBottom: 15 }} />
          )}
          <TextInput
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 2,
              borderColor: password.length > 0 && password.length < 10 ? '#E74C3C' : '#111',
              padding: 16,
              fontSize: 18,
              marginBottom: password.length > 0 && password.length < 10 ? 4 : 32,
              fontWeight: 'bold',
              fontFamily: 'kanit-regular',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}
            placeholder="รหัสผ่าน"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={20}
          />
          {password.length > 0 && password.length < 10 && (
            <Text style={{ color: '#E74C3C', fontSize: 14, marginBottom: 15, fontFamily: 'kanit-regular' }}>
              รหัสผ่านต้องมีอย่างน้อย 10 ตัวอักษร
            </Text>
          )}
          {password.length >= 10 && (
            <View style={{ marginBottom: 15 }} />
          )}
          <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#111', marginBottom: 16 }}>โปรไฟล์</Text>
          <TextInput
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 2,
              borderColor: friendCode.length > 0 && friendCode.length < 12 ? '#E74C3C' : '#111',
              padding: 16,
              fontSize: 18,
              marginBottom: friendCode.length > 0 && friendCode.length <= 12 ? 4 : 24,
              fontWeight: 'bold',
              fontFamily: 'kanit-regular',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}
            placeholder="รหัสเพิ่มเพื่อน"
            placeholderTextColor="#888"
            value={friendCode}
            onChangeText={setFriendCode}
            maxLength={12}
            keyboardType="numeric"
          />
          {friendCode.length > 0 && friendCode.length < 12 && (
            <Text style={{ color: '#E74C3C', fontSize: 14, marginBottom: 15, fontFamily: 'kanit-regular' }}>
              กรุณากรอกให้ครบ 12 ตัว
            </Text>
          )}
          {friendCode.length === 12 && (
            <View style={{ marginBottom: 20 }} />
          )}
          <TextInput
            style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#111', padding: 16, fontSize: 18, marginBottom: 24, fontWeight: 'bold', fontFamily: 'kanit-regular', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 }}
            placeholder="ชื่อผู้เล่น"
            placeholderTextColor="#888"
            value={trainerName}
            onChangeText={setTrainerName}
            maxLength={30}
          />
          <TextInput
            style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#111', padding: 16, fontSize: 18, marginBottom: 24, fontWeight: 'bold', fontFamily: 'kanit-regular', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 }}
            placeholder="เลเวล"
            placeholderTextColor="#888"
            value={level}
            onChangeText={setLevel}
            keyboardType="numeric"
            maxLength={2}

          />
          {/* ทีม: Touchable to open modal */}
          <TouchableOpacity
            style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#111', marginBottom: 32, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 }}
            onPress={() => setModalTeam(true)}
            activeOpacity={0.7}
          >
            {team ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: TEAMS.find(t => t.value === team)?.img }}
                  style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10, backgroundColor: '#fff' }}
                  resizeMode="contain"
                />
                <Text style={{ color: '#222', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>{TEAMS.find(t => t.value === team)?.label}</Text>
              </View>
            ) : (
              <Text style={{ color: '#888', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>ทีม</Text>
            )}
            <MaterialIcons name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          {/* Modal เลือกทีม */}
          <Modal
            visible={modalTeam}
            animationType="slide"
            transparent
            onRequestClose={() => setModalTeam(false)}
          >
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} onPress={() => setModalTeam(false)} />
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, width: '100%', padding: 24, maxHeight: 320, elevation: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', marginBottom: 16, textAlign: 'center', color: '#4CB0E2' }}>เลือกทีม</Text>
                {TEAMS.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => { setTeam(t.value); setModalTeam(false); }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 12,
                      backgroundColor: team === t.value ? '#A3D6F9' : '#fff',
                      marginBottom: 8,
                      borderWidth: team === t.value ? 2 : 1,
                      borderColor: team === t.value ? '#4CB0E2' : '#ddd',
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Image
                      source={{ uri: t.img }}
                      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16, borderWidth: 2, borderColor: '#eee', backgroundColor: '#fff' }}
                      resizeMode="contain"
                    />
                    <Text style={{ fontSize: 18, color: '#222', fontWeight: 'bold', fontFamily: 'kanit-regular', }}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={{ width: '100%', backgroundColor: '#FFA500', borderRadius: 10, paddingVertical: 18, alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 }}
            onPress={() => {
              if (email.length === 0 || !isValidEmail(email) || password.length < 10 || friendCode.length !== 12 || !trainerName || !level || !team) {
                setEmailTouched(true);
                setRequire(true);
                return;
              }
              handleRegister();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>สมัครสมาชิก</Text>
            )}
          </TouchableOpacity>

          {/* Modal กรอกข้อมูลไม่ครบ */}
          <Modal visible={require} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#E74C3C', marginBottom: 16 }}>กรุณากรอกข้อมูลให้ครบถ้วน!</Text>
                <TouchableOpacity onPress={() => setRequire(false)} style={{ backgroundColor: '#E74C3C', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>ตกลง</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Modal แสดงข้อความผลลัพธ์การสมัครสมาชิก */}
          <Modal visible={register} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular', color: alert === 'สมัครสมาชิกสำเร็จ' ? '#27AE60' : '#E74C3C', marginBottom: 16 }}>{alert}</Text>
                <TouchableOpacity onPress={handleRegisterOk} style={{ backgroundColor: alert === 'สมัครสมาชิกสำเร็จ' ? '#27AE60' : '#E74C3C', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>ตกลง</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
