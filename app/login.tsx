import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [showModal, setShowModal] = useState(false);

  // เช็ค session ถ้ามีให้ข้ามไปเมนูหลัก
  React.useEffect(() => {
    const checkSession = async () => {
      const sessionId = await AsyncStorage.getItem('sessionId');
      if (sessionId) {
        router.replace('/(tabs)/raidboss');
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlert('กรุณากรอกข้อมูล');
      setShowModal(true);
      return;
    }
    setLoading(true);
    try {
      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/pokopartyth/api/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success && data.user_id) {
        setAlert(data.message);
        await AsyncStorage.setItem('sessionId', data.session_id);
        // เก็บ user_id ลง session (user object)
        await AsyncStorage.setItem('user', JSON.stringify({ id: data.user_id }));
        router.replace('/(tabs)/raidboss');
      } else {
        setAlert(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
        setShowModal(true);
      }
    } catch (e) {
      setLoading(false);
      setAlert('เกิดข้อผิดพลาด');
      setShowModal(true);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#A3D6F9' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#111', marginBottom: 48, textAlign: 'center' }}>
            Poko Party Thailand
          </Text>
          <TextInput
            style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#111', padding: 16, fontSize: 18, fontFamily: 'kanit-regular', marginBottom: 24, fontWeight: 'bold', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 }}
            placeholder="อีเมลล์"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#111', padding: 16, fontSize: 18, fontFamily: 'kanit-regular', marginBottom: 32, fontWeight: 'bold', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 }}
            placeholder="รหัสผ่าน"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={{ width: '100%', backgroundColor: '#338AF3', borderRadius: 10, paddingVertical: 18, alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2, opacity: loading ? 0.7 : 1 }}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', fontFamily: 'kanit-regular',  }}>เข้าสู่ระบบ</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/register')} disabled={loading}>
            <Text style={{ color: '#111', fontWeight: 'bold', fontSize: 18, fontFamily: 'kanit-regular', textDecorationLine: 'underline' }}>สร้างบัญชีใหม่</Text>
          </TouchableOpacity>

          <Modal visible={showModal} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', fontFamily: 'kanit-regular', color: '#E74C3C', marginBottom: 16 }}>{alert}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)} style={{ backgroundColor: '#E74C3C', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'kanit-regular', }}>ตกลง</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
