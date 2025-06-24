import React, { useEffect, useState, useCallback } from 'react'; 
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
  Dimensions,
  PixelRatio,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/MaterialIcons';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = size => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
const responsiveFontSize = (size) => {
    const newSize = moderateScale(size, 0.5);
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};


const AddressBookScreen = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { cartItems, totalAmount } = route.params || {};

  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';
  const BASE_API_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms';

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const data = result?.addresses || [];
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses:', err.message);
      setError(err.message || 'Failed to load addresses. Please check your network or try again later.');
      Alert.alert('Error', err.message || 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, [JWT_TOKEN, BASE_API_URL]); 

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
      return () => {
      };
    }, [fetchAddresses]) 
  );

  const handleDeleteAddress = async (addressId, indexToDelete) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await fetch(`${BASE_API_URL}/api/address/${addressId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${JWT_TOKEN}`,
                },
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to delete address. Status: ${response.status}`);
              }

              Alert.alert("Success", "Address deleted successfully!");
              await fetchAddresses();
              if (selectedIndex !== null) {
                if (selectedIndex === indexToDelete) {
                  setSelectedIndex(null);
                } else if (selectedIndex > indexToDelete) {
                  setSelectedIndex(selectedIndex - 1);
                }
              }
            } catch (err) {
              console.error('Error deleting address:', err);
              setError(err.message || "Failed to delete address. Please try again.");
              Alert.alert("Error", err.message || "Failed to delete address.");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditAddress = (address, index) => {
    navigation.navigate('EditScreen', { address, index });
  };

  const handleAddNew = () => navigation.navigate('EditScreen');
  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButtonTouchable}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Address Book</Text>
        </View>

        {/* Add New Address Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Saved Addresses</Text>

        {/* Address List Section */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#3D74F1" style={styles.loadingIndicator} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : addresses.length === 0 ? (
            <Text style={styles.emptyText}>No addresses found. Click "Add New Address" to get started.</Text>
          ) : (
            addresses.map((item, index) => (
              <TouchableOpacity
                key={item._id || index}
                style={[
                  styles.card,
                  selectedIndex === index && styles.cardSelected,
                ]}
                onPress={() => setSelectedIndex(index)}
                activeOpacity={0.7}
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
                <Text style={styles.address}>Pincode: {item.pincode || 'N/A'}</Text>

                {/* Action Row: Edit and Delete */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editRow} onPress={() => handleEditAddress(item, index)}>
                    <Image
                      source={require('../assets/images/edit_icon.png')}
                      style={styles.editIcon}
                    />
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteAddress(item._id, index)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Fixed "Continue to Payment" Button at the Bottom */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveBtn, selectedIndex === null && styles.saveBtnDisabled]}
            onPress={() => {
              if (selectedIndex === null) {
                Alert.alert(
                  "Select Address",
                  "Please select an address before proceeding to payment.",
                  [{ text: "OK" }]
                );
              } else {
                navigation.navigate('PaymentScreen', {
                  selectedAddress: addresses[selectedIndex],
                  cartItems,
                  totalAmount
                });
              }
            }}
            disabled={selectedIndex === null || loading}
          >
            <Text style={styles.saveBtnText}>Continue to Payment</Text>
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
    paddingTop:20
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    marginBottom: verticalScale(5),
  },
  backButtonTouchable: {
    padding: moderateScale(5),
    marginRight: moderateScale(5),
  },
  backIcon: {
    width: scale(24),
    height: scale(24),
      tintColor: '#000',
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    borderWidth: moderateScale(1),
    borderColor: '#3D74F1',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(20),
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(2),
  },
  addButtonText: {
    color: '#3D74F1',
    fontWeight: '600',
    fontSize: responsiveFontSize(16),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(30),
    fontSize: responsiveFontSize(15),
    color: '#777',
    paddingHorizontal: moderateScale(20),
    lineHeight: responsiveFontSize(22),
  },
  errorText: {
    textAlign: 'center',
    marginTop: verticalScale(30),
    fontSize: responsiveFontSize(15),
    color: 'red',
    paddingHorizontal: moderateScale(20),
    lineHeight: responsiveFontSize(22),
  },
  loadingIndicator: {
    marginTop: verticalScale(30),
  },
  card: {
    borderWidth: moderateScale(1),
    borderColor: '#ccc',
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginBottom: verticalScale(12),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(2),
  },
  cardSelected: {
    borderColor: '#3D74F1',
    borderWidth: moderateScale(2),
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  radioCircle: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: moderateScale(2),
    borderColor: '#3D74F1',
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: scale(10),
    height: scale(10),
    backgroundColor: '#3D74F1',
    borderRadius: scale(5),
  },
  name: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(16),
    color: '#000',
  },
  address: {
    fontSize: responsiveFontSize(14),
    marginBottom: verticalScale(2),
    color: '#333',
  },
  mobile: {
    fontSize: responsiveFontSize(14),
    marginBottom: verticalScale(6),
    color: '#555',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingTop: verticalScale(10),
    gap: scale(25),
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(6),
    tintColor: '#3D74F1',
  },
  editText: {
    color: '#3D74F1',
    fontWeight: '500',
    fontSize: responsiveFontSize(14),
  },
  deleteText: {
    color: '#FF3333',
    fontWeight: '500',
    fontSize: responsiveFontSize(14),
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(-2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(3),
    elevation: moderateScale(8),
  },
  saveBtn: {
    backgroundColor: '#3D74F1',
    padding: moderateScale(14),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#a0c7f8',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsiveFontSize(16),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: verticalScale(20),
  },
  });