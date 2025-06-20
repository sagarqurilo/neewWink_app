import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const OrderSuccess = ({ route, navigation }) => {
    const { orderId, paymentMethod, paymentId } = route.params;

    return (
        <View style={styles.container}>
            <Image
                source={require('./../assets/images/splash_logo.png')} // replace with your success image
                style={styles.image}
            />
            <Text style={styles.title}>Order Placed Successfully!</Text>
            <Text style={styles.message}>Thank you for your purchase.</Text>

            <View style={styles.detailsBox}>
                <Text style={styles.detailText}>Order ID: {orderId}</Text>
                <Text style={styles.detailText}>Payment Method: {paymentMethod}</Text>
                {paymentId && <Text style={styles.detailText}>Payment ID: {paymentId}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText}>Continue Shopping</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#fff', padding: 20,
    },
    image: {
        width: 120, height: 120, marginBottom: 20,
    },
    title: {
        fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10,
    },
    message: {
        fontSize: 16, color: '#555', marginBottom: 20,
    },
    detailsBox: {
        backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 30,
        width: '100%',
    },
    detailText: {
        fontSize: 14, color: '#333', marginBottom: 5,
    },
    button: {
        backgroundColor: '#406FF3', paddingVertical: 12, paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff', fontSize: 16, fontWeight: 'bold',
    },
});

export default OrderSuccess;
