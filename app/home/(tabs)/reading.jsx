import { View, Text, Button, ToastAndroid } from "react-native";
import React from "react";
export default function reading() {
  const apiUrl = process.env.EXPO_PUBLIC_API_WA;
  const apiUser = process.env.EXPO_PUBLIC_WA_USER;
  const apikey = process.env.EXPO_PUBLIC_WAKEY;

 const showing = async ()=>{
  console.log(apiUrl);
  console.log(apikey);
  console.log(apiUser);
 
  console.log(res);
  
  
 }
  
  
  return (
    <View>
      <Text>reading</Text>
      <Button onPress={showing} title="press me" />
    </View>
  );
}
