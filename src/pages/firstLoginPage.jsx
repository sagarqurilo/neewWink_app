import { Image, View, Text, TouchableOpacity, TextInput, Button, Alert } from "react-native";
import { horizontalScale, verticalScale, fontScale } from '../component/ResponsiveMetrix';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'; 

const FirstLoginPage = () => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState(''); 

  const handleLogin = async () => {
   
    if (!mobileNumber) {
      Alert.alert("Error", "Please enter your mobile number.");
      return;
    }

    try {
      const API_URL = "https://qdp1vbhp-2000.inc1.devtunnels.ms/api/auth/login";
      const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94"; // Your provided token

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`, // Include the authorization token
        },
        body: JSON.stringify({
          phone: mobileNumber, 

        }),
      });

      const data = await response.json();

      if (response.ok) {
        // API call was successful
        console.log("Login successful:", data);
        Alert.alert("Success", "Login successful!");
        navigation.navigate('OneTimeVerification'); // Navigate on success
        // You might want to save user data (e.g., another token) from 'data' here
      } else {
        // API call failed
        console.error("Login failed:", data);
        Alert.alert("Login Failed", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Network error or API call failed:", error);
      Alert.alert("Error", "Could not connect to the server. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Image
          source={require('../assets/images/loginpageimage.png')}
          style={{
            width: horizontalScale(287),
            height: verticalScale(256),
            top: verticalScale(64),
            left: horizontalScale(60)
          }}
          resizeMode="contain"
        />
      </View>
      <View style={{
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        marginVertical: verticalScale(17),
        top: verticalScale(150),
        width: horizontalScale(96),
        left: horizontalScale(148),
      }} />
      <View>
        <Text style={{
          width: horizontalScale(202),
          height: verticalScale(30),
          gap: horizontalScale(9),
          fontWeight: '800',
          top: verticalScale(200),
          left: horizontalScale(25),
          fontSize: fontScale(20)
        }}>LOGIN</Text>
        <Text style={{
          top: verticalScale(200),
          left: horizontalScale(25),
          fontSize: fontScale(14)
        }}>
          Don't have an account?
        </Text>
        <TouchableOpacity style={{
          top: verticalScale(181),
          left: horizontalScale(175)
        }}>
          <Text style={{
            color: 'blue',
            fontSize: fontScale(14)
          }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="   Enter Mobile Number..."
        keyboardType="phone-pad" // Suggests numeric keyboard
        value={mobileNumber} // Binds the input value to the state
        onChangeText={setMobileNumber} // Updates state when text changes
        style={{
          top: verticalScale(200),
          borderRadius: horizontalScale(10),
          width: horizontalScale(370),
          left: horizontalScale(22),
          height: verticalScale(45),
          borderWidth: 1,
          borderColor: '#ccc',
          fontSize: fontScale(14)
        }}
      />

      <View style={{
        top: verticalScale(250),
        width: horizontalScale(347),
        height: verticalScale(40),
        borderRadius: horizontalScale(4),
        left: horizontalScale(31)
      }}>
        <Button title="Login" onPress={handleLogin} /> {/* Call handleLogin here */}
      </View>
      <View style={{
        width: horizontalScale(347),
        height: verticalScale(40),
        borderRadius: horizontalScale(4),
        top: verticalScale(270),
        left: horizontalScale(31)
      }}>
        <TouchableOpacity>
          <Text style={{
            color: '#406FF3',
            left: horizontalScale(120),
            fontSize: fontScale(14)
          }}>Login With Email ID</Text>
        </TouchableOpacity>
      </View>
      <View style={{
        top: verticalScale(265),
        width: horizontalScale(347),
        height: verticalScale(41)
      }}>
        <Text style={{
          left: horizontalScale(160),
          color: 'rgba(153, 153, 153, 1)',
          fontWeight: '500',
          lineHeight: verticalScale(10),
          fontSize: fontScale(12),
        }}>or continue with</Text>

        <View style={{
          flexDirection: 'row',
          top: verticalScale(14),
          left: horizontalScale(164),
          gap: horizontalScale(15.96)
        }}>
          <TouchableOpacity>
            <Image
              source={require('../assets/images/google.png')}
              style={{ width: horizontalScale(24), height: verticalScale(24) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/images/facebook.png')}
              style={{ width: horizontalScale(24), height: verticalScale(24) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/images/apple.png')}
              style={{ width: horizontalScale(24), height: verticalScale(24) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default FirstLoginPage;