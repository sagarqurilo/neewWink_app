import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  PixelRatio,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

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

const EditProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState(null);
    const [dob, setDob] = useState('');

    const handleUpdateProfile = async () => {
        if (!firstName || !lastName || !contact) {
            Alert.alert('Missing Fields', 'Please fill all required fields (*).');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        const updatedData = {
            name: firstName.trim()+" "+lastName.trim(),
            contact: contact,
            email: email,
            gender: gender,
            dob: dob,
        };
        try {
            const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/auth/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94',
                },
                body: JSON.stringify(updatedData),
            });
            const json = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully!');
                const onProfileUpdate = route.params?.onProfileUpdate;
                if (onProfileUpdate) {
                    onProfileUpdate(updatedData);
                }
                navigation.goBack();
            } else {
                Alert.alert('Error', json.message || 'Failed to update profile.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while updating profile.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Account</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                    <Image source={require('../assets/images/headerimg.png')} style={styles.profileImage} />
                    <TouchableOpacity style={styles.cameraIcon}>
                        <Text style={styles.cameraIconText}>📷</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.profileName}>Itunuoluwa Abidoye</Text>
                <Text style={styles.profileEmail}>itsdesign@gmail.com</Text>
            </View>

            <ScrollView style={styles.formSection} showsVerticalScrollIndicator={false}>
                <View style={styles.nameInputs}>
                    <View style={styles.inputContainerHalf}>
                        <Text style={styles.label}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput style={styles.input} placeholder="Name" value={firstName} onChangeText={setFirstName} />
                    </View>
                    <View style={styles.inputContainerHalf}>
                        <Text style={styles.label}>Last Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput style={styles.input} placeholder="Name" value={lastName} onChangeText={setLastName} />
                    </View>
                </View>

                <View style={styles.inputContainerFull}>
                    <Text style={styles.label}>Contact <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="9895712689" value={contact} onChangeText={setContact} keyboardType="phone-pad" />
                </View>

                <View style={styles.inputContainerFull}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="xyz123@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
                </View>

                <View style={styles.genderSection}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity style={styles.radioOption} onPress={() => setGender('Female')}>
                            <View style={[styles.radioCircle, gender === 'Female' && styles.radioSelected]}>
                                {gender === 'Female' && <View style={styles.radioInner} />}
                            </View>
                            <Text style={styles.radioLabel}>Female</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.radioOption} onPress={() => setGender('Male')}>
                            <View style={[styles.radioCircle, gender === 'Male' && styles.radioSelected]}>
                                {gender === 'Male' && <View style={styles.radioInner} />}
                            </View>
                            <Text style={styles.radioLabel}>Male</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainerFull}>
                    <Text style={styles.label}>DOB</Text>
                    <TextInput style={styles.input} placeholder="DD-MM-YYYY" value={dob} onChangeText={setDob} />
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: verticalScale(20),
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
    profileSection: {
        alignItems: 'center',
        padding: moderateScale(20),
        backgroundColor: '#fff',
        marginBottom: verticalScale(15),
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        marginBottom: verticalScale(10),
    },
    cameraIcon: {
        position: 'absolute',
        bottom: verticalScale(15),
        right: scale(5),
        backgroundColor: '#007BFF',
        borderRadius: moderateScale(15),
        padding: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIconText: {
        fontSize: responsiveFontSize(14),
        color: '#fff',
    },
    profileName: {
        fontSize: responsiveFontSize(18),
        fontWeight: 'bold',
        marginBottom: verticalScale(2),
        color: '#000',
    },
    profileEmail: {
        fontSize: responsiveFontSize(14),
        color: '#888',
    },
    formSection: {
        flex: 1,
        paddingHorizontal: moderateScale(15),
        paddingBottom: verticalScale(20),
    },
    nameInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
    },
    inputContainerHalf: {
        width: moderateScale(155),
    },
    inputContainerFull: {
        marginBottom: verticalScale(15),
    },
    label: {
        fontSize: responsiveFontSize(14),
        color: '#333',
        marginBottom: verticalScale(5),
        fontWeight: 'bold',
    },
    input: {
        borderWidth: moderateScale(1),
        borderColor: '#ccc',
        borderRadius: moderateScale(5),
        padding: moderateScale(10),
        fontSize: responsiveFontSize(14),
        backgroundColor: '#fff',
        height: verticalScale(45),
    },
    genderSection: {
        marginBottom: verticalScale(15),
    },
    radioContainer: {
        flexDirection: 'row',
        marginTop: verticalScale(5),
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: scale(20),
    },
    radioCircle: {
        height: moderateScale(20),
        width: moderateScale(20),
        borderRadius: moderateScale(10),
        borderWidth: moderateScale(1),
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(5),
    },
    radioSelected: {
        borderColor: '#007BFF',
    },
    radioInner: {
        height: moderateScale(12),
        width: moderateScale(12),
        borderRadius: moderateScale(6),
        backgroundColor: '#007BFF',
    },
    radioLabel: {
        fontSize: responsiveFontSize(14),
        color: '#333',
    },
    updateButton: {
        backgroundColor: '#007BFF',
        padding: moderateScale(15),
        borderRadius: moderateScale(5),
        alignItems: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(20),
    },
    updateButtonText: {
        color: '#fff',
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
    }
});