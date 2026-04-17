import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
// import { Ionicons } from '@expo/vector-icons'; // Assuming standard expo icons

export default function LoginScreen() {
  const router = useRouter();
  const [barcode, setBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!barcode) {
      Alert.alert('Error', 'Please enter your ticket barcode.');
      return;
    }

    setIsLoading(true);

    try {
      // NOTE: Uses 10.0.2.2 for Android emulator testing against localhost
      // Real device requires your laptop's actual IP address 
      const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, device_id: 'mobile-app' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ticket not recognised.');
      }

      // Securely store the JWT for future API calls
      await SecureStore.setItemAsync('stadiumiq_token', data.access_token);
      await SecureStore.setItemAsync('attendee_id', data.attendee_id);
      
      router.replace('/(tabs)');
      
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Hero / Splash */}
      <View style={styles.splash}>
        <Text style={styles.logo}>StadiumIQ</Text>
        <Text style={styles.tagline}>PHYSICAL EVENT EXPERIENCE</Text>
      </View>

      {/* Floating Auth Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SCAN YOUR TICKET</Text>

          {/* Camera Scan Zone Mock */}
          <TouchableOpacity style={styles.scanZone} onPress={() => Alert.alert('Camera', 'Scanner opening...')}>
            <Text style={styles.scanText}>Tap to open camera</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR ENTER MANUALLY</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <TextInput
            style={styles.input}
            placeholder="Booking ref: TKT-XXXX-XXXX"
            placeholderTextColor="#888"
            value={barcode}
            onChangeText={setBarcode}
            autoCapitalize="characters"
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enter Venue →</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.guestLink}>
            No ticket? <Text style={styles.linkBold}>Browse as guest</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  splash: {
    height: '45%',
    backgroundColor: '#0F3460',
    alignItems: 'center',
    paddingTop: 100,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 48,
    marginTop: -80,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  scanZone: {
    height: 90,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scanText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    opacity: 0.6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  guestLink: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 24,
  },
  linkBold: {
    color: '#60A5FA',
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});
