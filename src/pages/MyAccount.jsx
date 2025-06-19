import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyAccount = () => {
  const navigation = useNavigation();
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const data = await response.json();
      console.log('API response:', data);

      if (data.user) {
        const fullName = data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`;
        setProfileName(fullName.trim());
        setProfileEmail(data.user.email || '');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image source={require('../assets/images/headerimg.png')} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileEmail}>{profileEmail}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileText}>Edit Profile ✍️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Options */}
      <ScrollView>
        {[
          { label: 'My Orders', subtitle: 'Manage your orders', icon: '📦', screen: 'MyOders' },
          { label: 'My Wishlist', subtitle: 'View your wishlist', icon: '❤️', screen: 'WishList' },
          { label: 'My Address', subtitle: 'Manage your addresses', icon: '📍', screen: 'AddressBook' },
          { label: 'Contact Us', subtitle: 'Get help & support', icon: '☎️' },
          { label: 'Customer Support', subtitle: 'Need help?', icon: '💬' },
          { label: 'Terms of Use', subtitle: 'Read terms', icon: '📄' },
          { label: 'About Us', subtitle: 'Who we are', icon: 'ℹ️' },
          { label: 'Privacy Policy', subtitle: 'Your privacy matters', icon: '🔒' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <Text style={styles.optionIconPlaceholder}>{item.icon}</Text>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>{item.label}</Text>
              <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrowIconPlaceholder}>{'>'}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('FirstLogin')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backArrow: { fontSize: 24, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileTextContainer: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  profileEmail: { fontSize: 14, color: '#888', marginBottom: 5 },
  editProfileButton: { flexDirection: 'row', alignItems: 'center' },
  editProfileText: { fontSize: 14, color: '#007BFF', marginRight: 5 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionIconPlaceholder: {
    fontSize: 20,
    color: '#5E3B9E',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  optionSubtitle: { fontSize: 12, color: '#888' },
  arrowIconPlaceholder: { fontSize: 16, color: '#888', marginLeft: 10 },
  logoutButton: {
    margin: 20,
    padding: 15,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: { fontSize: 16, color: '#007BFF', fontWeight: 'bold' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyAccount;
