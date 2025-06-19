import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import OneTimeVerificationStyles from "./OneTimeVerification.stylesheet"
import OtpGraphic from '../../assets/images/otpGraphic.png'
import { OtpInput } from "react-native-otp-entry";
import { useNavigation } from '@react-navigation/native';

const OneTimeVerification = () => {
    const navigation = useNavigation();

    const handleVerify = () => {
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={OneTimeVerificationStyles.container}>
            <ScrollView>
                <View style={OneTimeVerificationStyles.otpGraphic}>
                    <Image source={OtpGraphic} />
                </View>
                <View >
                    <View style={OneTimeVerificationStyles.otp_container}>
                        <Text style={OneTimeVerificationStyles.heading}>OTP Verification</Text>
                        <View style={OneTimeVerificationStyles.gap_content}><Text>We have sent the OTP to 9********4.  <TouchableOpacity><Text style={OneTimeVerificationStyles.link}>Edit Number</Text></TouchableOpacity></Text></View>
                        <View style={OneTimeVerificationStyles.otpInputWrapper}>
                            <View style={OneTimeVerificationStyles.otpInputBlock}>
                                <OtpInput
                                    numberOfDigits={4}
                                />
                            </View>
                        </View>
                        <View style={[OneTimeVerificationStyles.gap_content, OneTimeVerificationStyles.didNotSend]}><Text>Didn't receive OTP ?  <TouchableOpacity><Text style={OneTimeVerificationStyles.link}>Resend</Text></TouchableOpacity></Text></View>
                        <TouchableOpacity style={OneTimeVerificationStyles.button} onPress={handleVerify}>
                            <Text style={OneTimeVerificationStyles.button_text}>Verify</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default OneTimeVerification