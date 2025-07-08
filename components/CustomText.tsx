import React from 'react';
import { Text, TextProps } from 'react-native';

export default function CustomText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: 'kanit-regular' }, props.style]}
    >
      {props.children}
    </Text>
  );
}