import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { horizontalScale, verticalScale } from '../component/ResponsiveMetrix';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Slider');
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../assets/images/splash_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Image
                    source={require('../assets/images/splash_title.png')}
                    style={styles.title}
                    resizeMode="contain"
                />
                <Image
                    source={require('../assets/images/splash_title1.png')}
                    style={styles.subtitle}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#004CFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: horizontalScale(20),
    },
    logo: {
        width: horizontalScale(120),
        height: verticalScale(120),
        marginBottom: verticalScale(20),
    },
    title: {
        width: horizontalScale(240),
        height: verticalScale(60),
        marginBottom: verticalScale(10),
    },
    subtitle: {
        width: horizontalScale(200),
        height: verticalScale(48),
    },
});

export default SplashScreen;
