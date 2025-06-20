import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
    ScrollView, Image, Dimensions
} from 'react-native';

// Try different import methods if one doesn't work
import RazorpayCheckout from 'react-native-razorpay';
// Alternative: const RazorpayCheckout = require('react-native-razorpay');

const { width } = Dimensions.get('window');

const PaymentScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    const { objectCart } = route.params;

    const ORDER_API_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/order/create_order';
    const VERIFY_API_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/order/verify_rz_order';
    const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

    const RAZORPAY_KEY_ID = 'rzp_test_QQ2xEaZTHS3IDN';
    const COMPANY_NAME = 'Wink';
    const COMPANY_LOGO = 'https://your-company-logo-url.com/logo.png';

    useEffect(() => {
        if (route.params) {
            const { cartItems: items, totalAmount: total, selectedAddress: address } = route.params;
            setCartItems(items || []);
            setTotalAmount(total || 0);
            setSelectedAddress(address || null);
        }
    }, [route.params]);

    const formatProductsForAPI = () => {
        return cartItems.map(item => ({
            productId: item.product?._id || item.productId,
            variantId: item.selectedVariant?._id || item.variantId,
            quantity: item.quantity
        }));
    };

    // New function to verify payment
    const verifyPayment = async (paymentData) => {
        try {
            console.log("Starting payment verification...", paymentData);
            
            const verificationData = {
                razorpayOrderId: paymentData.razorpay_order_id,
                razorpayPaymentId: paymentData.razorpay_payment_id,
                razorpaySignature: paymentData.razorpay_signature
            };

            console.log("Verification data being sent:", verificationData);

            const response = await fetch(VERIFY_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verificationData),
            });

            const verificationResult = await response.json();
            console.log("Verification response:", verificationResult);

            if (response.ok && verificationResult.status) {
                console.log("Payment verification successful");
                return { success: true, data: verificationResult };
            } else {
                console.log("Payment verification failed:", verificationResult);
                return { 
                    success: false, 
                    error: verificationResult.message || 'Payment verification failed' 
                };
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            return { 
                success: false, 
                error: 'Network error during verification' 
            };
        }
    };

    const handleCashOnDelivery = async () => {
        if (!selectedAddress) {
            Alert.alert('Error', 'Please select a delivery address');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                isCod: true,
                products: formatProductsForAPI(),
                address: selectedAddress._id || selectedAddress
            };

            const response = await fetch(ORDER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok && data.status) {
                const orderId = data.orders?.[0]?._id;
                Alert.alert(
                    'Order Placed',
                    'Cash on Delivery selected.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('OrderSuccess', {
                                orderId,
                                paymentMethod: 'Cash on Delivery'
                            })
                        }
                    ]
                );
            } else {
                Alert.alert('Order Failed', data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('COD Error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        if (!selectedAddress) {
            Alert.alert('Error', 'Please select a delivery address');
            return;
        }

        // Check if RazorpayCheckout is available
        if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
            Alert.alert(
                'Payment Error', 
                'Payment service is not available. Please try Cash on Delivery or reinstall the app.',
                [{ text: 'OK' }]
            );
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                isCod: false,
                products: formatProductsForAPI(),
                address: selectedAddress._id || selectedAddress
            };

            const response = await fetch(ORDER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok && data.status) {
                console.log("Order Created Response:", data);

                const razorpayOrderId = data.intent?.id;
                const amount = data.intent?.amount;
                const orderId = data.orders?.[0]?._id;

                // Debug logs
                console.log("Razorpay Order ID:", razorpayOrderId);
                console.log("Amount:", amount);
                console.log("Order ID:", orderId);

                // Validate required fields
                if (!razorpayOrderId) {
                    Alert.alert('Error', 'Invalid order ID from backend');
                    return;
                }

                if (!amount || amount <= 0) {
                    Alert.alert('Error', 'Invalid amount from backend');
                    return;
                }

                const options = {
                    description: 'Order Payment',
                    image: COMPANY_LOGO,
                    currency: data.intent?.currency || 'INR',
                    key: RAZORPAY_KEY_ID,
                    amount: amount,
                    name: COMPANY_NAME,
                    order_id: razorpayOrderId,
                    prefill: {
                        email: 'customer@example.com',
                        contact: '7982900770',
                        name: 'Customer Name'
                    },
                    theme: { color: '#406FF3' }
                };

                console.log("Razorpay Options:", options);

                try {
                    console.log("option:::", options);
                    console.log("rz:::", RazorpayCheckout);
                    const paymentData = await RazorpayCheckout.open(options);
                    console.log("Payment Success Data:", paymentData);
                    await handlePaymentSuccess(paymentData, orderId);
                } catch (paymentError) {
                    console.log("Payment Error:", paymentError);
                    handlePaymentError(paymentError);
                }

            } else {
                Alert.alert('Order Failed', data.message || 'Could not create order');
            }
        } catch (error) {
            console.error('Online Payment Error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentData, orderId) => {
        console.log("Processing payment success...");
        
        // Show loading state during verification
        setLoading(true);
        
        try {
            // Verify the payment
            const verificationResult = await verifyPayment(paymentData);
            
            if (verificationResult.success) {
                // Payment verified successfully
                Alert.alert(
                    'Payment Successful!',
                    `Payment verified and completed successfully.\nPayment ID: ${paymentData.razorpay_payment_id}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('OrderSuccess', {
                                orderId,
                                paymentMethod: 'Online Payment',
                                paymentId: paymentData.razorpay_payment_id,
                                verified: true
                            })
                        }
                    ]
                );
            } else {
                // Payment verification failed
                Alert.alert(
                    'Payment Verification Failed',
                    `Payment was processed but verification failed: ${verificationResult.error}\n\nPlease contact support with Payment ID: ${paymentData.razorpay_payment_id}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('OrderSuccess', {
                                orderId,
                                paymentMethod: 'Online Payment',
                                paymentId: paymentData.razorpay_payment_id,
                                verified: false,
                                verificationError: verificationResult.error
                            })
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error during verification process:', error);
            Alert.alert(
                'Verification Error',
                `Payment completed but verification failed due to network error.\nPayment ID: ${paymentData.razorpay_payment_id}\n\nPlease contact support.`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('OrderSuccess', {
                            orderId,
                            paymentMethod: 'Online Payment',
                            paymentId: paymentData.razorpay_payment_id,
                            verified: false,
                            verificationError: 'Network error during verification'
                        })
                    }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentError = (error) => {
        console.log("Payment Error Details:", error);
        
        let errorMessage = 'Payment was cancelled or failed';
        
        if (error.code) {
            switch (error.code) {
                case 'BAD_REQUEST_ERROR':
                    errorMessage = 'Invalid payment details';
                    break;
                case 'GATEWAY_ERROR':
                    errorMessage = 'Payment gateway error';
                    break;
                case 'NETWORK_ERROR':
                    errorMessage = 'Network connection error';
                    break;
                case 'SERVER_ERROR':
                    errorMessage = 'Server error occurred';
                    break;
                default:
                    errorMessage = error.description || 'Payment failed';
            }
        }
        
        Alert.alert(
            'Payment Failed',
            errorMessage,
            [{ text: 'OK' }]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#406FF3" />
                <Text style={styles.loadingText}>Processing...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconLeft}>
                    <Image source={require('../assets/images/arrowbtn.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Items:</Text>
                        <Text style={styles.summaryValue}>{cartItems.length}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Amount:</Text>
                        <Text style={styles.summaryValue}>₹{totalAmount}</Text>
                    </View>
                </View>

                <View style={styles.addressContainer}>
                    <Text style={styles.addressTitle}>Delivery Address</Text>
                    {selectedAddress ? (
                        <View style={styles.addressCard}>
                            <Text style={styles.addressText}>{selectedAddress.area}</Text>
                            <Text style={styles.addressText}>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.selectAddressButton}
                            onPress={() => navigation.navigate('AddressBook', { cartItems })}
                        >
                            <Text style={styles.selectAddressText}>Select Address</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.paymentContainer}>
                    <Text style={styles.paymentTitle}>Choose Payment Method</Text>

                    <TouchableOpacity
                        style={styles.paymentOption}
                        onPress={handleCashOnDelivery}
                        disabled={loading}
                    >
                        <Image source={require('./../assets/images/bluebag.png')} style={styles.paymentIcon} />
                        <View style={styles.paymentDetails}>
                            <Text style={styles.paymentMethodTitle}>Cash on Delivery</Text>
                            <Text style={styles.paymentMethodSubtitle}>Pay when order is delivered</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.paymentOption}
                        onPress={handleOnlinePayment}
                        disabled={loading}
                    >
                        <Image source={require('./../assets/images/bluebag.png')} style={styles.paymentIcon} />
                        <View style={styles.paymentDetails}>
                            <Text style={styles.paymentMethodTitle}>Pay Online</Text>
                            <Text style={styles.paymentMethodSubtitle}>Credit/Debit Card, UPI, Net Banking</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', marginTop: 30 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerIconLeft: { marginRight: 15 },
    headerIcon: { width: 24, height: 24, resizeMode: 'contain' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    content: { flex: 1, padding: 15 },
    summaryContainer: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginBottom: 20 },
    summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    summaryLabel: { fontSize: 14, color: '#666' },
    summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    addressContainer: { marginBottom: 20 },
    addressTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
    addressCard: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15 },
    addressText: { fontSize: 14, color: '#000', marginBottom: 5 },
    selectAddressButton: { backgroundColor: '#406FF3', borderRadius: 10, padding: 15, alignItems: 'center' },
    selectAddressText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    paymentContainer: { marginBottom: 20 },
    paymentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#000' },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#eee',
    },
    paymentIcon: { width: 24, height: 24, resizeMode: 'contain', marginRight: 15 },
    paymentDetails: { flex: 1 },
    paymentMethodTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 2 },
    paymentMethodSubtitle: { fontSize: 12, color: '#666' },
});

export default PaymentScreen;