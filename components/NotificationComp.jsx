import React from 'react';
import { Button, Platform, View } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {
  const showNotification = async () => {
    if (Platform.OS === 'web') {
      alert("Notifications are not supported on web.");
      return;
    }
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Message 💬",
        body: 'You have a new message like in WhatsApp!',
        data: { someData: 'goes here' },
      },
      trigger: null, // Trigger instantly
    });
  };
  
  return (
    <View>
      <Button title="Press to show notification" onPress={showNotification} />
    </View>
  );
}
