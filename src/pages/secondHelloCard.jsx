import { View, Text, Image, ImageBackground } from "react-native";
import { horizontalScale, verticalScale, fontScale } from '../component/ResponsiveMetrix';

const SecondHelloCardComponent = () => {
    return (
        <ImageBackground
            source={require('../assets/images/bubble.png')}
            style={{ width: '100%', height: verticalScale(442), marginTop: verticalScale(40) }}
            resizeMode="cover"
        >
            <View style={{position:'relative'}}>
                <Image
                    source={require('../assets/images/mobilegirl.png')}
                    style={{ 
                        top: verticalScale(170), 
                        width: horizontalScale(420), 
                        height: verticalScale(272),
                    }}
                    resizeMode="contain"
                />
            </View>
            <View>
                <Text style={{
                    width: horizontalScale(72),
                    height: verticalScale(36),
                    top: verticalScale(290),
                    left: horizontalScale(49),
                    fontWeight: '700',
                    fontSize: fontScale(28),
                    lineHeight: verticalScale(36),
                    letterSpacing: -0.28,
                }}>Hello</Text>
            </View>
            <View>
                <Text style={{
                    top: verticalScale(300),
                    left: horizontalScale(49),
                    paddingRight: horizontalScale(60),
                    fontWeight: '300',
                    fontSize: fontScale(19),
                    lineHeight: verticalScale(27),
                    width: horizontalScale(294),
                    height: verticalScale(111)
                }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non consectetur turpis. Morbi eu eleifend lacus.
                </Text>
            </View>
        </ImageBackground>
    )
}

export default SecondHelloCardComponent;