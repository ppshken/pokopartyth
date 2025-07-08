import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, ImageBackground, View } from 'react-native';

const bgImage = 'https://lh3.googleusercontent.com/4Yv_Ws72bvuQVUH9xGpo8H4yXxHj1jxlGTr4v8KyB4sU5auO0e00eRA_YdaZIS5uR6ldHmKou3_X6Ag8CiaKlwuZY6ieVMHZ0ISwhkIecov5DA=s2400-rj'; // สามารถเปลี่ยน url ได้

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

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

  return (
    <ImageBackground
      source={{ uri: bgImage }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      resizeMode="cover"
    >
      <View style={{ backgroundColor: 'rgba(0,0,0,0.25)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <ActivityIndicator size="large" color="#fff" />
    </ImageBackground>
  );
}
