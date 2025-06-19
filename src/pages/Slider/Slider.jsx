import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import HelloCardComponent from "../helloCard";
import SecondHelloCardComponent from "../secondHelloCard";
import FirstLoginPageComponent from "../firstLoginPage";
import OneTimeVerification from "../OneTimeVerification/OneTimeVerification";

const { height } = Dimensions.get('window');

const Slider = ({ navigation }) => {
    const handleSwipeComplete = (index) => {
        if (index === 3) { 
            navigation.replace('Home');
        }
    };

    return (
        <View style={{ height: height, backgroundColor: '#fff' }}>
            <Swiper
                loop={false}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                paginationStyle={styles.pagination}
                showsButtons={false}
                autoplay={false}
                onIndexChanged={handleSwipeComplete}
            >
                <HelloCardComponent />
                <SecondHelloCardComponent />
                <FirstLoginPageComponent />
                {/* <OneTimeVerification /> */}
            </Swiper>
        </View>
    )
}

const styles = StyleSheet.create({
    dot: {
        backgroundColor: 'rgba(0,0,0,.15)',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#3575F6',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    pagination: {
        bottom: 30,
    },
});

export default Slider;