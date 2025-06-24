import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditScreen = () => {
  const navigation = useNavigation();

  // State for input fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [flat, setFlat] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState('Other');

  // Token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

  const handleAddAddress = async () => {
    // Validate required fields
    if (!name || !mobile || !email || !flat || !street || !city || !state || !country) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const payload = {
      fullName: name,
      mobileNumber: mobile,
      email: email,
      area: flat,
      street: street,
      city: city,
      state: state,
      country: country,
      latitude: 28.622371,
      longitude: 77.038184,
      pincode: "110081",
      landmark: landmark,
      addressType: addressType,
      houseNumber: flat
    };

    try {
      console.log("Sending payload:", payload);
      const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        Alert.alert('Success', 'Address added successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Network Error', 'Unable to connect to the server');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Address</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Contact *</Text>
        <TextInput
          placeholder="9895712689"
          style={styles.input}
          keyboardType="number-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <Text style={styles.label}>Email (optional)</Text>
        <TextInput
          placeholder="xyz123@gmail.com"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Flat No/House No/Building No *</Text>
        <TextInput
          placeholder="B-26 Janakpuri West, near Post office"
          style={styles.input}
          value={flat}
          onChangeText={setFlat}
        />

        <Text style={styles.label}>Street/Locality *</Text>
        <TextInput
          placeholder="New Delhi"
          style={styles.input}
          value={street}
          onChangeText={setStreet}
        />

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              placeholder="West Delhi"
              style={styles.halfInput}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>State</Text>
            <TextInput
              placeholder="Delhi"
              style={styles.halfInput}
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

        <Text style={styles.label}>Country</Text>
        <TextInput
          placeholder="India"
          style={styles.input}
          value={country}
          onChangeText={setCountry}
        />

        <TextInput
          placeholder="Landmark (Optional)"
          style={styles.input}
          value={landmark}
          onChangeText={setLandmark}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddAddress}>
          <Text style={styles.buttonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingRight: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    display: 'none', // Hide the original title
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInputContainer: {
    flex: 0.48,
  },
  halfInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3D74F1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
