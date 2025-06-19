import { StyleSheet } from "react-native";
import { fontScale, horizontalScale, verticalScale } from '../../component/ResponsiveMetrix'

const OneTimeVerificationStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    otpGraphic: {
        padding: verticalScale(60),
        alignItems: 'center'
    },
    otp_main_container:{

    },
    otp_container: {
        padding: verticalScale(20),

    },
    heading: {
        fontSize: fontScale(16),
        fontWeight: '700',
        color: '#393939',
        textTransform: 'uppercase'
    },
    gap_content: {
        paddingTop: verticalScale(10)
    },
    content: {
        fontSize: fontScale(12),
        fontWeight: '500',
        color: '#5F5F5F',
    },
    button: {
        backgroundColor: '#406FF3',
        height: verticalScale(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginTop: verticalScale(30)
    },
    button_text: {
        fontSize: fontScale(16),
        color: '#ffffff',
        fontWeight: '600'
    },
    link: {
        color: '#406FF3',
        textDecorationLine: 'underline',
        fontWeight: '500'
    },
    didNotSend: {
        alignItems: 'center',
        paddingTop: horizontalScale(30)
    },
    otpInputWrapper: {
        paddingTop: horizontalScale(20),
        alignSelf: 'center'
    },
    otpInputBlock: {
        maxWidth: 230
    }
})

export default OneTimeVerificationStyles