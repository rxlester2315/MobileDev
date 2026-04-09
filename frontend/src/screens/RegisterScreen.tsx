import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { registerUser } from '../api/auth';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen({ onAuthSuccess }: any) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = async () => {
    const result = await registerUser(form);
    
    if (result.status === 'success') {
      await SecureStore.setItemAsync('userToken', result.data.token);
      onAuthSuccess(result.data.token);
    } else {
      Alert.alert("Error", result.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput 
        placeholder="Name" 
        style={styles.input} 
        onChangeText={(val) => setForm({...form, name: val})} 
      />
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        onChangeText={(val) => setForm({...form, email: val})} 
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        style={styles.input} 
        onChangeText={(val) => setForm({...form, password: val})} 
      />
      <Button title="Sign Up" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 }
});