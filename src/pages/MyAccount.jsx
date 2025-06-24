import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const data = await response.json();
      if (data.user) {
        const fullName = data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`;
        setProfileName(fullName.trim());
        setProfileEmail(data.user.email || '');
      } else {
        setProfileName('User Name N/A');
        setProfileEmail('user@example.com');
      }
    } catch (error) {
      setProfileName('Error loading name');
      setProfileEmail('Error loading email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image source={require('../assets/images/headerimg.png')} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileEmail}>{profileEmail}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile', { onProfileUpdate: fetchProfileData })}
          >
            <Text style={styles.editProfileText}>Edit Profile ✍️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {[
          { label: 'My Orders', subtitle: 'Manage your orders', icon: '📦', screen: 'MyOders' },
          { label: 'My Wishlist', subtitle: 'View your wishlist', icon: '❤️', screen: 'WishList' },
          { label: 'My Address', subtitle: 'Manage your addresses', icon: '📍', screen: 'AddressBook' },
          { label: 'Contact Us', subtitle: 'Get help & support', icon: '☎️', screen: null },
          { label: 'Customer Support', subtitle: 'Need help?', icon: '💬', screen: null },
          { label: 'Terms of Use', subtitle: 'Read terms', icon: '📄', screen: null },
          { label: 'About Us', subtitle: 'Who we are', icon: 'ℹ️', screen: null },
          { label: 'Privacy Policy', subtitle: 'Your privacy matters', icon: '🔒', screen: null },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            disabled={!item.screen}
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
    </SafeAreaView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: verticalScale(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    paddingBottom: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  backArrow: {
    fontSize: responsiveFontSize(24),
    marginRight: scale(10),
    color: '#000',
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#000',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(15),
    backgroundColor: '#fff',
    marginBottom: verticalScale(15),
  },
  profileImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    marginRight: scale(15),
  },
  profileTextContainer: { flex: 1 },
  profileName: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(2),
    color: '#000',
  },
  profileEmail: {
    fontSize: responsiveFontSize(14),
    color: '#888',
    marginBottom: verticalScale(5),
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: responsiveFontSize(14),
    color: '#007BFF',
    marginRight: scale(5),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(15),
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  optionIconPlaceholder: {
    fontSize: responsiveFontSize(20),
    color: '#5E3B9E',
    marginRight: scale(15),
    width: moderateScale(30),
    textAlign: 'center',
  },
  optionTextContainer: { flex: 1 },
  optionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(2),
    color: '#333',
  },
  optionSubtitle: {
    fontSize: responsiveFontSize(12),
    color: '#888',
  },
  arrowIconPlaceholder: {
    fontSize: responsiveFontSize(16),
    color: '#888',
    marginLeft: scale(10),
  },
  logoutButton: {
    margin: moderateScale(20),
    padding: moderateScale(15),
    borderColor: '#007BFF',
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(5),
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  logoutButtonText: {
    fontSize: responsiveFontSize(16),
    color: '#007BFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: responsiveFontSize(16),
    color: '#666',
  },
});