
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from "@react-navigation/native"; // สำคัญ!


export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const sessionId = await AsyncStorage.getItem('sessionId');
      if (!sessionId) {
        router.replace('/login');
        return;
      }
      const apiBaseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/pokopartyth/api/get_profile.php?sessionId=${sessionId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setUser(data.profile);
      } else {
        alert(data.message);
        await AsyncStorage.removeItem('sessionId');
        router.replace('/login');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  // ใช้ useFocusEffect เพื่อให้เรียก fetch ทุกครั้งที่เข้าหน้า
    useFocusEffect(
      useCallback(() => {
        fetchProfile();
      }, [])
    );

  const handleLogout = async () => {
    setLogoutLoading(true);
    await AsyncStorage.removeItem('sessionId');
    setTimeout(() => {
      setLogoutLoading(false);
      router.replace('/login');
    }, 1000);
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CB0E2' }}>
        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'kanit-regular' }}>ไม่พบข้อมูลผู้ใช้</Text>
      </View>
    );
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
      <View style={{ alignItems: 'center', marginTop: 60, marginBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 36, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>โปรไฟล์</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#A3D6F9', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 }}>
        <Text style={labelStyle}>ชื่อเทรนเนอร์</Text>
        <InfoBox text={user.trainer_name} />

        <Text style={labelStyle}>รหัสเพื่อน (Friend Code)</Text>
        <InfoBox text={user.friend_code} />

        <Text style={labelStyle}>ทีม</Text>
        <InfoBox text={user.team} />

        <Text style={labelStyle}>เลเวล</Text>
        <InfoBox text={user.level} />

        <Text style={labelStyle}>อีเมล</Text>
        <InfoBox text={user.email} />

        <TouchableOpacity
          style={{ backgroundColor: '#E74C3C', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
          onPress={handleLogout}
        >
          {logoutLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'kanit-regular' }}>ออกจากระบบ</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const labelStyle = {
  fontSize: 20,
  fontWeight: 'bold' as const,
  marginBottom: 8,
  color: '#222',
  fontFamily: 'kanit-regular' as const
};

const InfoBox = ({ text }: { text: string }) => (
  <View style={{ backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 16 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#222', fontFamily: 'kanit-regular' }}>{text}</Text>
  </View>
);
