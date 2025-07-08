import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

const initialMessages = [
  { id: '1', text: 'พร้อมยัง?', sender: 'other' },
  { id: '2', text: 'พร้อมยัง จะเริ่มแล้ว', sender: 'other' },
  { id: '3', text: 'มาฯ พร้อมละ', sender: 'me' },
];

export default function ChatRoomScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'me' }]);
      setInput('');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#4CB0E2' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60, marginBottom: 20, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 40, fontFamily: 'kanit-regular' }}>ห้องแชท</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 24, paddingHorizontal: 0 }}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: item.sender === 'me' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              {item.sender === 'other' && (
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0', marginRight: 8 }} />
              )}
              <View
                style={{
                  backgroundColor: item.sender === 'me' ? '#F4B400' : '#A3D6F9',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  maxWidth: '70%',
                }}
              >
                <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 18, fontFamily: 'kanit-regular' }}>{item.text}</Text>
              </View>
            </View>
          )}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={24}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: Platform.OS === 'ios' ? 100 : 16 }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderColor: '#4CB0E2',
                borderWidth: 2,
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'kanit-regular',
                paddingHorizontal: 12,
                paddingVertical: 14,
                marginRight: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
              placeholder="ข้อความ"
              placeholderTextColor="#888"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={handleSend}
              style={{ backgroundColor: '#4CB0E2', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, fontFamily: 'kanit-regular' }}>ส่ง</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
