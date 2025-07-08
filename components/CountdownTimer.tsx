import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function CountdownTimer({ timeSlot }: { timeSlot: string }) {
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      if (!timeSlot || !timeSlot.includes(':')) {
        setCountdownText('ไม่มีข้อมูลเวลา');
        return;
      }

      const [hour, minute] = timeSlot.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hour, minute, 0, 0);

      // ❌ ถ้าเลยแล้ว ไม่ข้ามไปพรุ่งนี้
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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [timeSlot]);

  return (
    <View
      style={{
        backgroundColor: countdownText === 'หมดเวลาแล้ว' ? '#f2b6bc' : '#b6daf2',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginTop: 4,
        marginBottom: 4
      }}
    >
      <Text style={{ fontSize: 12, color: countdownText === 'หมดเวลาแล้ว' ? '#d22537' : '#258ed2', fontWeight: 'bold', fontFamily: 'kanit-regular' }}>
        {countdownText}
      </Text>
    </View>
  );
}
