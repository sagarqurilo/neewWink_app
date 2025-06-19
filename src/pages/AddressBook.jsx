import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddressBookScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

    try {
      setLoading(true);
      const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      const data = result?.addresses || [];
      setAddresses(data);
    } catch (error) {
      console.warn('Failed to fetch addresses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => navigation.navigate('EditScreen');
  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Image
              source={require('../assets/images/arrowbtn.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Address Book</Text>
        </View>

        {/* Add New Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Saved Addresses</Text>

        {/* Address List */}
        <ScrollView style={styles.scrollView}>
          {loading ? (
            <ActivityIndicator size="large" color="#3D74F1" />
          ) : addresses.length === 0 ? (
            <Text style={styles.emptyText}>No addresses found.</Text>
          ) : (
            addresses.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  selectedIndex === index && styles.cardSelected,
                ]}
                onPress={() => setSelectedIndex(index)}
              >
                <View style={styles.radioRow}>
                  <View style={styles.radioCircle}>
                    {selectedIndex === index && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.name}>Name: {item.fullName || 'N/A'}</Text>
                </View>

                <Text style={styles.mobile}>Mobile: {item.mobileNumber || 'N/A'}</Text>
                <Text style={styles.address}>Area: {item.area || 'N/A'}</Text>
                <Text style={styles.address}>Country: {item.country || 'N/A'}</Text>
                <Text style={styles.address}>Landmark: {item.landmark || 'N/A'}</Text>

                <View style={styles.actionRow}>
                  <View style={styles.editRow}>
                    <Image
                      source={require('../assets/images/edit_icon.png')}
                      style={styles.editIcon}
                    />
                    <Text style={styles.editText}>Edit</Text>
                  </View>
                  <Text style={styles.deleteText}>Delete</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity 
            style={styles.saveBtn}
            onPress={() => {
              if (selectedIndex === null) {
                Alert.alert(
                  "Select Address",
                  "Please select an address",
                  [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                  ]
                );
              } else {
                navigation.navigate('MyCart');
              }
            }}
          >
            <Text style={styles.saveBtnText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddressBookScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#3D74F1',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addButtonText: {
    color: '#3D74F1',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#777',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardSelected: {
    borderColor: '#3D74F1',
    borderWidth: 1.5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#3D74F1',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    backgroundColor: '#3D74F1',
    borderRadius: 4,
  },
  name: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#000',
  },
  address: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  mobile: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    gap: 20,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: '#3D74F1',
  },
  editText: {
    color: '#3D74F1',
    fontWeight: '500',
    fontSize: 14,
  },
  deleteText: {
    color: '#FF3333',
    fontWeight: '500',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#3D74F1',
    padding: 14,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    marginBottom: 80,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
