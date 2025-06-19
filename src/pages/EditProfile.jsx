import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

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
            Alert.alert('Missing Required Fields', 'Please fill all required fields (*).');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            Alert.alert('Invalid Email Format', 'Please enter a valid email address.');
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
                console.log('Response:', json);

                const onProfileUpdate = route.params?.onProfileUpdate;
                if (onProfileUpdate) {
                    onProfileUpdate(updatedData);
                }

                navigation.goBack();
            } else {
                Alert.alert('Error', json.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('API Error:', error);
            Alert.alert('Error', 'Something went wrong while updating profile.');
        }
    };

    return (
        <View style={styles.container}>
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
                        <Text style={{ color: '#fff' }}>📷</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.profileName}>Itunuoluwa Abidoye</Text>
                <Text style={styles.profileEmail}>itsdesign@gmail.com</Text>
            </View>

            <ScrollView style={styles.formSection}>
                <View style={styles.nameInputs}>
                    <View style={styles.inputContainerHalf}>
                        <Text style={styles.label}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>
                    <View style={styles.inputContainerHalf}>
                        <Text style={styles.label}>Last Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>
                </View>

                <View style={styles.inputContainerFull}>
                    <Text style={styles.label}>Contact <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="9895712689"
                        value={contact}
                        onChangeText={setContact}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainerFull}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="xyz123@gmail.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
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
                    <TextInput
                        style={styles.input}
                        placeholder="06-12-2003"
                        value={dob}
                        onChangeText={setDob}
                    />
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backArrow: {
        fontSize: 24,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 15,
        right: 5,
        backgroundColor: '#007BFF',
        borderRadius: 15,
        padding: 5,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
        color: '#888',
    },
    formSection: {
        flex: 1,
        paddingHorizontal: 15,
    },
    nameInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    inputContainerHalf: {
        width: '48%',
    },
    inputContainerFull: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    genderSection: {
        marginBottom: 15,
    },
    radioContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    radioSelected: {
        borderColor: '#007BFF',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#007BFF',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
    },
    updateButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default EditProfile;
