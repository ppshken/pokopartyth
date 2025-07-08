import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0, // ขยับ tab bar ขึ้นจากขอบล่าง
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#fff',
            height: 90,
            paddingBottom: Platform.OS === 'ios' ? 24 : 10,
            paddingTop: 6,
          },
        ],
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 8,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
          marginTop: 4,
          color: '#222',
          fontFamily: 'kanit-regular', // หรือ 'Inter-Bold' ถ้าโหลดไว้
        },
      }}>
      <Tabs.Screen
        name="raidboss"
        options={{
          title: 'ห้องบอส',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="house.fill" color="#4CB0E2"/>, // bigger icon
        }}
      />
      <Tabs.Screen
        name="created"
        options={{
          title: 'สร้างห้อง',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="plus.circle.fill" color="#E74C3C" />, // red plus icon
        }}
      />
      <Tabs.Screen
        name="myraids"
        options={{
          title: 'ห้องของฉัน',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="checkmark.seal.fill" color="#F4B400" />, // yellow checkmark
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="person.fill" color="#00000"/>, // profile icon
        }}
      />
    </Tabs>
  );
}
