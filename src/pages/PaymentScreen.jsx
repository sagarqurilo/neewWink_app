// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     Alert,
//     ActivityIndicator,
//     ScrollView,
//     Image,
//     Dimensions
// } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';


// const { width } = Dimensions.get('window');

// const PaymentScreen = ({ navigation, route }) => {
//     const [loading, setLoading] = useState(false);
//     const [cartItems, setCartItems] = useState([]);
//     const [selectedAddress, setSelectedAddress] = useState(null);
//     const [totalAmount, setTotalAmount] = useState(0);

//     const ORDER_API_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/order/create_order';
//     const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

//     // Razorpay configuration
//     const RAZORPAY_KEY_ID = 'rzp_test_QQ2xEaZTHS3IDN'; // Replace with your actual key
//     const COMPANY_NAME = 'Wink';
//     const COMPANY_LOGO = 'https://your-company-logo-url.com/logo.png'; // Replace with your logo URL

//     useEffect(() => {
//         // Get data passed from cart screen
//         if (route.params) {
//             const { cartItems: items, totalAmount: total, selectedAddress: address } = route.params;
//             setCartItems(items || []);
//             setTotalAmount(total || 0);
//             setSelectedAddress(address || null);
//         }
//     }, [route.params]);

//     // Format cart items for API
//     const formatProductsForAPI = () => {
//         return cartItems.map(item => ({
//             productId: item.product?._id || item.productId,
//             variantId: item.selectedVariant?._id || item.variantId,
//             quantity: item.quantity
//         }));
//     };

//     // Handle Cash on Delivery
//     const handleCashOnDelivery = async () => {
//         if (!selectedAddress) {
//             Alert.alert('Error', 'Please select a delivery address');
//             return;
//         }

//         setLoading(true);
//         try {
//             const orderData = {
//                 isCod: true,
//                 products: formatProductsForAPI(),
//                 address: selectedAddress._id || selectedAddress
//             };

//             console.log('COD Order Data:', orderData);

//             const response = await fetch(ORDER_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${TOKEN}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData),
//             });

//             const data = await response.json();
//             console.log('COD API Response:', data);

//             if (response.ok && data.success) {
//                 Alert.alert(
//                     'Order Placed Successfully!',
//                     'Your order has been placed. You can pay cash on delivery.',
//                     [
//                         {
//                             text: 'OK',
//                             onPress: () => navigation.navigate('OrderSuccess', { 
//                                 orderId: data.orderId || data._id,
//                                 paymentMethod: 'Cash on Delivery'
//                             })
//                         }
//                     ]
//                 );
//             } else {
//                 Alert.alert('Order Failed', data.message || 'Failed to place order');
//             }
//         } catch (error) {
//             console.error('COD Error:', error);
//             Alert.alert('Error', 'Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle Online Payment with Razorpay
//     const handleOnlinePayment = async () => {
//         if (!selectedAddress) {
//             Alert.alert('Error', 'Please select a delivery address');
//             return;
//         }

//         setLoading(true);
//         try {
//             // First create order in backend
//             const orderData = {
//                 isCod: false,
//                 products: formatProductsForAPI(),
//                 address: selectedAddress._id || selectedAddress
//             };

//             console.log('Online Payment Order Data:', orderData);

//             const response = await fetch(ORDER_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${TOKEN}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData),
//             });

//             const data = await response.json();
//             console.log('Online Payment API Response:', data);

//             if (response.ok && data.success) {
//                 // Initialize Razorpay payment
//                 const options = {
//                     description: 'Order Payment',
//                     image: COMPANY_LOGO,
//                     currency: 'INR',
//                     key: RAZORPAY_KEY_ID,
//                     amount: Math.round(totalAmount * 100), // Amount in paise
//                     name: COMPANY_NAME,
//                     order_id: data.razorpayOrderId || '', // If your backend creates Razorpay order
//                     prefill: {
//                         email: 'customer@example.com', // You can get this from user profile
//                         contact: '7982900770', // You can get this from user profile
//                         name: 'Customer Name' // You can get this from user profile
//                     },
//                     theme: { color: '#406FF3' }
//                 };

//                 console.log('Razorpay Options:', options);

//                 RazorpayCheckout.open(options)
//                     .then((paymentData) => {
//                         console.log('Payment Success:', paymentData);
//                         // Payment successful
//                         handlePaymentSuccess(paymentData, data.orderId || data._id);
//                     })
//                     .catch((error) => {
//                         console.log('Payment Error:', error);
//                         handlePaymentError(error);
//                     });
//             } else {
//                 Alert.alert('Order Failed', data.message || 'Failed to create order');
//             }
//         } catch (error) {
//             console.error('Online Payment Error:', error);
//             Alert.alert('Error', 'Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle payment success
//     const handlePaymentSuccess = async (paymentData, orderId) => {
//         try {
//             // You can send payment verification to your backend here
//             console.log('Payment successful for order:', orderId);
//             console.log('Payment data:', paymentData);

//             Alert.alert(
//                 'Payment Successful!',
//                 `Payment ID: ${paymentData.razorpay_payment_id}`,
//                 [
//                     {
//                         text: 'OK',
//                         onPress: () => navigation.navigate('OrderSuccess', { 
//                             orderId: orderId,
//                             paymentMethod: 'Online Payment',
//                             paymentId: paymentData.razorpay_payment_id
//                         })
//                     }
//                 ]
//             );
//         } catch (error) {
//             console.error('Payment success handling error:', error);
//         }
//     };

//     // Handle payment error
//     const handlePaymentError = (error) => {
//         console.log('Payment failed:', error);
//         Alert.alert(
//             'Payment Failed',
//             error.description || 'Payment was cancelled or failed',
//             [
//                 { text: 'OK' }
//             ]
//         );
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#406FF3" />
//                 <Text style={styles.loadingText}>Processing...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={styles.headerIconLeft}
//                 >
//                     <Image source={require('../assets/images/arrowbtn.png')} style={styles.headerIcon} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Payment</Text>
//             </View>

//             <ScrollView style={styles.content}>
//                 {/* Order Summary */}
//                 <View style={styles.summaryContainer}>
//                     <Text style={styles.summaryTitle}>Order Summary</Text>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Items:</Text>
//                         <Text style={styles.summaryValue}>{cartItems.length}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Total Amount:</Text>
//                         <Text style={styles.summaryValue}>₹{totalAmount}</Text>
//                     </View>
//                 </View>

//                 {/* Delivery Address */}
//                 <View style={styles.addressContainer}>
//                     <Text style={styles.addressTitle}>Delivery Address</Text>
//                     {selectedAddress ? (
//                         <View style={styles.addressCard}>
//                             <Text style={styles.addressText}>
//                                 {selectedAddress.street || selectedAddress.address}
//                             </Text>
//                             <Text style={styles.addressText}>
//                                 {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
//                             </Text>
//                         </View>
//                     ) : (
//                         <TouchableOpacity 
//                             style={styles.selectAddressButton}
//                             onPress={() => navigation.navigate('AddressBook')}
//                         >
//                             <Text style={styles.selectAddressText}>Select Address</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 {/* Payment Methods */}
//                 <View style={styles.paymentContainer}>
//                     <Text style={styles.paymentTitle}>Choose Payment Method</Text>

//                     {/* Cash on Delivery */}
//                     <TouchableOpacity 
//                         style={styles.paymentOption}
//                         onPress={handleCashOnDelivery}
//                         disabled={loading}
//                     >
//                         <View style={styles.paymentIconContainer}>
//                             <Image 
//                                 source={require('./../assets/images/bluebag.png')} 
//                                 style={styles.paymentIcon} 
//                             />
//                         </View>
//                         <View style={styles.paymentDetails}>
//                             <Text style={styles.paymentMethodTitle}>Cash on Delivery</Text>
//                             <Text style={styles.paymentMethodSubtitle}>Pay when order is delivered</Text>
//                         </View>
//                         <Image 
//                             source={require('./../assets/images/bluebag.png')} 
//                             style={styles.arrowIcon} 
//                         />
//                     </TouchableOpacity>

//                     {/* Online Payment */}
//                     <TouchableOpacity 
//                         style={styles.paymentOption}
//                         onPress={handleOnlinePayment}
//                         disabled={loading}
//                     >
//                         <View style={styles.paymentIconContainer}>
//                             <Image 
//                                 source={require('./../assets/images/bluebag.png')} 
//                                 style={styles.paymentIcon} 
//                             />
//                         </View>
//                         <View style={styles.paymentDetails}>
//                             <Text style={styles.paymentMethodTitle}>Pay Online</Text>
//                             <Text style={styles.paymentMethodSubtitle}>Credit/Debit Card, UPI, Net Banking</Text>
//                         </View>
//                         <Image 
//                             source={require('./../assets/images/bluebag.png')} 
//                             style={styles.arrowIcon} 
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         marginTop: 30,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#666',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     headerIconLeft: {
//         marginRight: 15,
//     },
//     headerIcon: {
//         width: 24,
//         height: 24,
//         resizeMode: 'contain',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     content: {
//         flex: 1,
//         padding: 15,
//     },
//     summaryContainer: {
//         backgroundColor: '#f9f9f9',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 20,
//     },
//     summaryTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#000',
//     },
//     summaryRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 5,
//     },
//     summaryLabel: {
//         fontSize: 14,
//         color: '#666',
//     },
//     summaryValue: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     addressContainer: {
//         marginBottom: 20,
//     },
//     addressTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#000',
//     },
//     addressCard: {
//         backgroundColor: '#f9f9f9',
//         borderRadius: 10,
//         padding: 15,
//     },
//     addressText: {
//         fontSize: 14,
//         color: '#000',
//         marginBottom: 5,
//     },
//     selectAddressButton: {
//         backgroundColor: '#406FF3',
//         borderRadius: 10,
//         padding: 15,
//         alignItems: 'center',
//     },
//     selectAddressText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     paymentContainer: {
//         marginBottom: 20,
//     },
//     paymentTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         color: '#000',
//     },
//     paymentOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 10,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         borderWidth: 1,
//         borderColor: '#eee',
//     },
//     paymentIconContainer: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#f0f0f0',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 15,
//     },
//     paymentIcon: {
//         width: 24,
//         height: 24,
//         resizeMode: 'contain',
//     },
//     paymentDetails: {
//         flex: 1,
//     },
//     paymentMethodTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#000',
//         marginBottom: 2,
//     },
//     paymentMethodSubtitle: {
//         fontSize: 12,
//         color: '#666',
//     },
//     arrowIcon: {
//         width: 16,
//         height: 16,
//         resizeMode: 'contain',
//         tintColor: '#666',
//     },
// });

// export default PaymentScreen;


// import React, { useState, useEffect } from 'react';
// import {
//     View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
//     ScrollView, Image, Dimensions
// } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';

// const { width } = Dimensions.get('window');

// const PaymentScreen = ({ navigation, route }) => {
//     const [loading, setLoading] = useState(false);
//     const [cartItems, setCartItems] = useState([]);
//     const [selectedAddress, setSelectedAddress] = useState(null);
//     const [totalAmount, setTotalAmount] = useState(0);

//     const { objectCart } = route.params;

//     const ORDER_API_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/order/create_order';
//     const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

//     const RAZORPAY_KEY_ID = 'rzp_test_QQ2xEaZTHS3IDN';
//     const COMPANY_NAME = 'Wink';
//     const COMPANY_LOGO = 'https://your-company-logo-url.com/logo.png';

//     useEffect(() => {
//         if (route.params) {
//             const { cartItems: items, totalAmount: total, selectedAddress: address } = route.params;
//             setCartItems(items || []);
//             setTotalAmount(total || 0);
//             setSelectedAddress(address || null);
//             // console.log("++++++++++++++++++", cartItems);
//             // console.log("==================", objectCart);
//         }
//     }, [route.params]);

//     const formatProductsForAPI = () => {
//         return cartItems.map(item => ({
//             productId: item.product?._id || item.productId,
//             variantId: item.selectedVariant?._id || item.variantId,
//             quantity: item.quantity
//         }));
//     };

//     const handleCashOnDelivery = async () => {
//         if (!selectedAddress) {
//             Alert.alert('Error', 'Please select a delivery address');
//             return;
//         }

//         setLoading(true);
//         try {
//             const orderData = {
//                 isCod: true,
//                 products: formatProductsForAPI(),
//                 address: selectedAddress._id || selectedAddress
//             };

//             const response = await fetch(ORDER_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${TOKEN}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData),
//             });

//             const data = await response.json();

//             if (response.ok && data.status) {
//                 const orderId = data.orders?.[0]?._id;
//                 Alert.alert(
//                     'Order Placed',
//                     'Cash on Delivery selected.',
//                     [
//                         {
//                             text: 'OK',
//                             onPress: () => navigation.navigate('OrderSuccess', {
//                                 orderId,
//                                 paymentMethod: 'Cash on Delivery'
//                             })
//                         }
//                     ]
//                 );
//             } else {
//                 Alert.alert('Order Failed', data.message || 'Something went wrong');
//             }
//         } catch (error) {
//             console.error('COD Error:', error);
//             Alert.alert('Error', 'Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

// const handleOnlinePayment = async () => {
//     if (!selectedAddress) {
//         Alert.alert('Error', 'Please select a delivery address');
//         return;
//     }

//     // Check if RazorpayCheckout is available
//     if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
//         Alert.alert(
//             'Payment Error', 
//             'Payment service is not available. Please try Cash on Delivery.',
//             [{ text: 'OK' }]
//         );
//         return;
//     }

//     setLoading(true);
//     try {
//         const orderData = {
//             isCod: false,
//             products: formatProductsForAPI(),
//             address: selectedAddress._id || selectedAddress
//         };

//         const response = await fetch(ORDER_API_URL, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${TOKEN}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(orderData),
//         });

//         const data = await response.json();

//         if (response.ok && data.status) {
//             console.log("Order Created Response:", data);

//             const razorpayOrderId = data.intent?.id;
//             const amount = data.intent?.amount;
//             const orderId = data.orders?.[0]?._id;

//             // Validate required fields
//             if (!razorpayOrderId) {
//                 Alert.alert('Error', 'Invalid order ID from backend');
//                 return;
//             }

//             if (!amount || amount <= 0) {
//                 Alert.alert('Error', 'Invalid amount from backend');
//                 return;
//             }

//             const options = {
//                 description: 'Order Payment',
//                 image: COMPANY_LOGO,
//                 currency: data.intent?.currency || 'INR',
//                 key: RAZORPAY_KEY_ID,
//                 amount: amount,
//                 name: COMPANY_NAME,
//                 order_id: razorpayOrderId,
//                 prefill: {
//                     email: 'customer@example.com',
//                     contact: '7982900770',
//                     name: 'Customer Name'
//                 },
//                 theme: { color: '#406FF3' }
//             };

//             console.log("Opening Razorpay with options:", options);

//             // Use try-catch for Razorpay.open
//             try {
//                 const paymentData = await RazorpayCheckout.open(options);
//                 console.log("Payment Success Data:", paymentData);
//                 handlePaymentSuccess(paymentData, orderId);
//             } catch (paymentError) {
//                 console.log("Payment Error:", paymentError);
//                 handlePaymentError(paymentError);
//             }

//         } else {
//             Alert.alert('Order Failed', data.message || 'Could not create order');
//         }
//     } catch (error) {
//         console.error('Online Payment Error:', error);
//         Alert.alert('Error', 'Network error. Please try again.');
//     } finally {
//         setLoading(false);
//     }
// };

//     const handlePaymentSuccess = (paymentData, orderId) => {
//         Alert.alert(
//             'Payment Successful!',
//             `Payment ID: ${paymentData.razorpay_payment_id}`,
//             [
//                 {
//                     text: 'OK',
//                     onPress: () => navigation.navigate('OrderSuccess', {
//                         orderId,
//                         paymentMethod: 'Online Payment',
//                         paymentId: paymentData.razorpay_payment_id
//                     })
//                 }
//             ]
//         );
//     };

//     const handlePaymentError = (error) => {
//     console.log("Payment Error Details:", error);
    
//     let errorMessage = 'Payment was cancelled or failed';
    
//     if (error.code) {
//         switch (error.code) {
//             case 'BAD_REQUEST_ERROR':
//                 errorMessage = 'Invalid payment details';
//                 break;
//             case 'GATEWAY_ERROR':
//                 errorMessage = 'Payment gateway error';
//                 break;
//             case 'NETWORK_ERROR':
//                 errorMessage = 'Network connection error';
//                 break;
//             case 'SERVER_ERROR':
//                 errorMessage = 'Server error occurred';
//                 break;
//             default:
//                 errorMessage = error.description || 'Payment failed';
//         }
//     }
    
//     Alert.alert(
//         'Payment Failed',
//         errorMessage,
//         [{ text: 'OK' }]
//     );
// };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#406FF3" />
//                 <Text style={styles.loadingText}>Processing...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconLeft}>
//                     <Image source={require('../assets/images/arrowbtn.png')} style={styles.headerIcon} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Payment</Text>
//             </View>

//             <ScrollView style={styles.content}>
//                 <View style={styles.summaryContainer}>
//                     <Text style={styles.summaryTitle}>Order Summary</Text>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Items:</Text>
//                         <Text style={styles.summaryValue}>{cartItems.length}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Total Amount:</Text>
//                         <Text style={styles.summaryValue}>₹{totalAmount}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.addressContainer}>
//                     <Text style={styles.addressTitle}>Delivery Address</Text>
//                     {selectedAddress ? (
//                         <View style={styles.addressCard}>
//                             <Text style={styles.addressText}>{selectedAddress.area}</Text>
//                             <Text style={styles.addressText}>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</Text>
//                         </View>
//                     ) : (
//                         <TouchableOpacity
//                             style={styles.selectAddressButton}
//                             onPress={() => navigation.navigate('AddressBook', { cartItems })}
//                         >
//                             <Text style={styles.selectAddressText}>Select Address</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 <View style={styles.paymentContainer}>
//                     <Text style={styles.paymentTitle}>Choose Payment Method</Text>

//                     <TouchableOpacity
//                         style={styles.paymentOption}
//                         onPress={handleCashOnDelivery}
//                         disabled={loading}
//                     >
//                         <Image source={require('./../assets/images/bluebag.png')} style={styles.paymentIcon} />
//                         <View style={styles.paymentDetails}>
//                             <Text style={styles.paymentMethodTitle}>Cash on Delivery</Text>
//                             <Text style={styles.paymentMethodSubtitle}>Pay when order is delivered</Text>
//                         </View>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.paymentOption}
//                         onPress={handleOnlinePayment}
//                         disabled={loading}
//                     >
//                         <Image source={require('./../assets/images/bluebag.png')} style={styles.paymentIcon} />
//                         <View style={styles.paymentDetails}>
//                             <Text style={styles.paymentMethodTitle}>Pay Online</Text>
//                             <Text style={styles.paymentMethodSubtitle}>Credit/Debit Card, UPI, Net Banking</Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff', marginTop: 30 },
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
//     loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
//     header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
//     headerIconLeft: { marginRight: 15 },
//     headerIcon: { width: 24, height: 24, resizeMode: 'contain' },
//     headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
//     content: { flex: 1, padding: 15 },
//     summaryContainer: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginBottom: 20 },
//     summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
//     summaryLabel: { fontSize: 14, color: '#666' },
//     summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#000' },
//     addressContainer: { marginBottom: 20 },
//     addressTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
//     addressCard: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15 },
//     addressText: { fontSize: 14, color: '#000', marginBottom: 5 },
//     selectAddressButton: { backgroundColor: '#406FF3', borderRadius: 10, padding: 15, alignItems: 'center' },
//     selectAddressText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//     paymentContainer: { marginBottom: 20 },
//     paymentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#000' },
//     paymentOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 10,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         borderWidth: 1,
//         borderColor: '#eee',
//     },
//     paymentIcon: { width: 24, height: 24, resizeMode: 'contain', marginRight: 15 },
//     paymentDetails: { flex: 1 },
//     paymentMethodTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 2 },
//     paymentMethodSubtitle: { fontSize: 12, color: '#666' },
// });

// export default PaymentScreen;








// import React, { useState, useEffect } from 'react';
// import {
//     View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
//     ScrollView, Image, Dimensions
// } from 'react-native';

// // Try different import methods if one doesn't work
// import RazorpayCheckout from 'react-native-razorpay';
// // Alternative: const RazorpayCheckout = require('react-native-razorpay');

// const { width } = Dimensions.get('window');

// const PaymentScreen = ({ navigation, route }) => {
//     const [loading, setLoading] = useState(false);
//     const [cartItems, setCartItems] = useState([]);
//     const [selectedAddress, setSelectedAddress] = useState(null);
//     const [totalAmount, setTotalAmount] = useState(0);

//     const { objectCart } = route.params;

//     const ORDER_API_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/order/create_order';
//     const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

//     const RAZORPAY_KEY_ID = 'rzp_test_QQ2xEaZTHS3IDN';
//     const COMPANY_NAME = 'Wink';
//     const COMPANY_LOGO = 'https://your-company-logo-url.com/logo.png';

//     useEffect(() => {
//         if (route.params) {
//             const { cartItems: items, totalAmount: total, selectedAddress: address } = route.params;
//             setCartItems(items || []);
//             setTotalAmount(total || 0);
//             setSelectedAddress(address || null);
//         }
//     }, [route.params]);

//     const formatProductsForAPI = () => {
//         return cartItems.map(item => ({
//             productId: item.product?._id || item.productId,
//             variantId: item.selectedVariant?._id || item.variantId,
//             quantity: item.quantity
//         }));
//     };

//     const handleCashOnDelivery = async () => {
//         if (!selectedAddress) {
//             Alert.alert('Error', 'Please select a delivery address');
//             return;
//         }

//         setLoading(true);
//         try {
//             const orderData = {
//                 isCod: true,
//                 products: formatProductsForAPI(),
//                 address: selectedAddress._id || selectedAddress
//             };

//             const response = await fetch(ORDER_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${TOKEN}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData),
//             });

//             const data = await response.json();

//             if (response.ok && data.status) {
//                 const orderId = data.orders?.[0]?._id;
//                 Alert.alert(
//                     'Order Placed',
//                     'Cash on Delivery selected.',
//                     [
//                         {
//                             text: 'OK',
//                             onPress: () => navigation.navigate('OrderSuccess', {
//                                 orderId,
//                                 paymentMethod: 'Cash on Delivery'
//                             })
//                         }
//                     ]
//                 );
//             } else {
//                 Alert.alert('Order Failed', data.message || 'Something went wrong');
//             }
//         } catch (error) {
//             console.error('COD Error:', error);
//             Alert.alert('Error', 'Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleOnlinePayment = async () => {
//         if (!selectedAddress) {
//             Alert.alert('Error', 'Please select a delivery address');
//             return;
//         }

//         // Check if RazorpayCheckout is available
//         if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
//             Alert.alert(
//                 'Payment Error', 
//                 'Payment service is not available. Please try Cash on Delivery or reinstall the app.',
//                 [{ text: 'OK' }]
//             );
//             return;
//         }

//         setLoading(true);
//         try {
//             const orderData = {
//                 isCod: false,
//                 products: formatProductsForAPI(),
//                 address: selectedAddress._id || selectedAddress
//             };

//             const response = await fetch(ORDER_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${TOKEN}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData),
//             });

//             const data = await response.json();

//             if (response.ok && data.status) {
//                 console.log("Order Created Response:", data);

//                 const razorpayOrderId = data.intent?.id;
//                 const amount = data.intent?.amount;
//                 const orderId = data.orders?.[0]?._id;

//                 // Debug logs
//                 console.log("Razorpay Order ID:", razorpayOrderId);
//                 console.log("Amount:", amount);
//                 console.log("Order ID:", orderId);

//                 // Validate required fields
//                 if (!razorpayOrderId) {
//                     Alert.alert('Error', 'Invalid order ID from backend');
//                     return;
//                 }

//                 if (!amount || amount <= 0) {
//                     Alert.alert('Error', 'Invalid amount from backend');
//                     return;
//                 }

//                 const options = {
//                     description: 'Order Payment',
//                     image: COMPANY_LOGO,
//                     currency: data.intent?.currency || 'INR',
//                     key: RAZORPAY_KEY_ID,
//                     amount: amount,
//                     name: COMPANY_NAME,
//                     order_id: razorpayOrderId,
//                     prefill: {
//                         email: 'customer@example.com',
//                         contact: '7982900770',
//                         name: 'Customer Name'
//                     },
//                     theme: { color: '#406FF3' }
//                 };

//                 console.log("Razorpay Options:", options);

//                 try {
//                     const paymentData = await RazorpayCheckout.open(options);
//                     console.log("Payment Success Data:", paymentData);
//                     handlePaymentSuccess(paymentData, orderId);
//                 } catch (paymentError) {
//                     console.log("Payment Error:", paymentError);
//                     handlePaymentError(paymentError);
//                 }

//             } else {
//                 Alert.alert('Order Failed', data.message || 'Could not create order');
//             }
//         } catch (error) {
//             console.error('Online Payment Error:', error);
//             Alert.alert('Error', 'Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePaymentSuccess = (paymentData, orderId) => {
//         Alert.alert(
//             'Payment Successful!',
//             `Payment ID: ${paymentData.razorpay_payment_id}`,
//             [
//                 {
//                     text: 'OK',
//                     onPress: () => navigation.navigate('OrderSuccess', {
//                         orderId,
//                         paymentMethod: 'Online Payment',
//                         paymentId: paymentData.razorpay_payment_id
//                     })
//                 }
//             ]
//         );
//     };

//     const handlePaymentError = (error) => {
//         console.log("Payment Error Details:", error);
        
//         let errorMessage = 'Payment was cancelled or failed';
        
//         if (error.code) {
//             switch (error.code) {
//                 case 'BAD_REQUEST_ERROR':
//                     errorMessage = 'Invalid payment details';
//                     break;
//                 case 'GATEWAY_ERROR':
//                     errorMessage = 'Payment gateway error';
//                     break;
//                 case 'NETWORK_ERROR':
//                     errorMessage = 'Network connection error';
//                     break;
//                 case 'SERVER_ERROR':
//                     errorMessage = 'Server error occurred';
//                     break;
//                 default:
//                     errorMessage = error.description || 'Payment failed';
//             }
//         }
        
//         Alert.alert(
//             'Payment Failed',
//             errorMessage,
//             [{ text: 'OK' }]
//         );
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#406FF3" />
//                 <Text style={styles.loadingText}>Processing...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconLeft}>
//                     <Image source={require('../assets/images/arrowbtn.png')} style={styles.headerIcon} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Payment</Text>
//             </View>

//             <ScrollView style={styles.content}>
//                 <View style={styles.summaryContainer}>
//                     <Text style={styles.summaryTitle}>Order Summary</Text>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Items:</Text>
//                         <Text style={styles.summaryValue}>{cartItems.length}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryLabel}>Total Amount:</Text>
//                         <Text style={styles.summaryValue}>₹{totalAmount}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.addressContainer}>
//                     <Text style={styles.addressTitle}>Delivery Address</Text>
//                     {selectedAddress ? (
//                         <View style={styles.addressCard}>
//                             <Text style={styles.addressText}>{selectedAddress.area}</Text>
//                             <Text style={styles.addressText}>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</Text>
//                         </View>
//                     ) : (
//                         <TouchableOpacity
//                             style={styles.selectAddressButton}
//                             onPress={() => navigation.navigate('AddressBook', { cartItems })}
//                         >
//                             <Text style={styles.selectAddressText}>Select Address</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 <View style={styles.paymentContainer}>
//                     <Text style={styles.paymentTitle}>Choose Payment Method</Text>

//                     <TouchableOpacity
//                         style={styles.paymentOption}
//                         onPress={handleCashOnDelivery}
//                         disabled={loading}
//                     >
//                         <Image source={require('./../assets/images/bluebag.png')} style={styles.paymentIcon} />
//                         <View style={styles.paymentDetails}>
//                             <Text style={styles.paymentMethodTitle}>Cash on Delivery</Text>
//                             <Text style={styles.paymentMethodSubtitle}>Pay when order is delivered</Text>
//                         </View>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.paymentOption}
//                         onPress={handleOnlinePayment}
//                         disabled={loading}
//                     >
//                         <Image source={require('./../assets/images/bluebag.png')} style={styles.paymentIcon} />
//                         <View style={styles.paymentDetails}>
//                             <Text style={styles.paymentMethodTitle}>Pay Online</Text>
//                             <Text style={styles.paymentMethodSubtitle}>Credit/Debit Card, UPI, Net Banking</Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff', marginTop: 30 },
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
//     loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
//     header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
//     headerIconLeft: { marginRight: 15 },
//     headerIcon: { width: 24, height: 24, resizeMode: 'contain' },
//     headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
//     content: { flex: 1, padding: 15 },
//     summaryContainer: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginBottom: 20 },
//     summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
//     summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
//     summaryLabel: { fontSize: 14, color: '#666' },
//     summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#000' },
//     addressContainer: { marginBottom: 20 },
//     addressTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
//     addressCard: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15 },
//     addressText: { fontSize: 14, color: '#000', marginBottom: 5 },
//     selectAddressButton: { backgroundColor: '#406FF3', borderRadius: 10, padding: 15, alignItems: 'center' },
//     selectAddressText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//     paymentContainer: { marginBottom: 20 },
//     paymentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#000' },
//     paymentOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 10,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         borderWidth: 1,
//         borderColor: '#eee',
//     },
//     paymentIcon: { width: 24, height: 24, resizeMode: 'contain', marginRight: 15 },
//     paymentDetails: { flex: 1 },
//     paymentMethodTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 2 },
//     paymentMethodSubtitle: { fontSize: 12, color: '#666' },
// });

// export default PaymentScreen;














































// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const PaymentScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { cartItems, totalAmount, selectedAddress } = route.params;

//     const [isCod, setIsCod] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const TOKEN = 'your-token-here'; // Replace with real token
//     const ORDER_API = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/order/create_order';

//     const handlePayment = async () => {
//         if (!selectedAddress) {
//             Alert.alert("Error", "Please select a delivery address.");
//             return;
//         }

//         const products = cartItems.map(item => ({
//             productId: item.product?._id,
//             variantId: item.selectedVariant?._id,
//             quantity: item.quantity
//         }));

//         setLoading(true);

//         try {
//             const response = await fetch(ORDER_API, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${TOKEN}`,
//                 },
//                 body: JSON.stringify({
//                     isCod,
//                     products,
//                     address: selectedAddress,
//                 }),
//             });

//             const data = await response.json();
//             console.log("Order API Response:", data);

//             if (!response.ok || !data.success) {
//                 Alert.alert("Error", data.message || "Failed to create order.");
//                 return;
//             }

//             if (isCod) {
//                 Alert.alert("Success", "Order placed successfully via Cash on Delivery.");
//                 navigation.navigate('Home');
//             } else {
//                 const { razorpayOrder } = data;

//                 const options = {
//                     description: 'Order Payment',
//                     image: 'https://yourlogo.png',
//                     currency: 'INR',
//                     key: razorpayOrder.key,
//                     amount: razorpayOrder.amount,
//                     name: 'Your App Name',
//                     order_id: razorpayOrder.id,
//                     prefill: {
//                         email: razorpayOrder.email || 'user@example.com',
//                         contact: razorpayOrder.contact || '9876543210',
//                         name: razorpayOrder.name || 'Customer'
//                     },
//                     theme: { color: '#406FF3' }
//                 };

//                 RazorpayCheckout.open(options)
//                     .then(paymentData => {
//                         Alert.alert("Payment Success", "Your payment was successful.");
//                         navigation.navigate('Home');
//                     })
//                     .catch(error => {
//                         console.log("Razorpay Error:", error);
//                         Alert.alert("Payment Failed", "Payment was cancelled or failed.");
//                     });
//             }
//         } catch (error) {
//             console.error("Order Create Error:", error);
//             Alert.alert("Error", "Something went wrong. Try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.title}>Select Payment Method</Text>

//             <TouchableOpacity
//                 style={[styles.optionButton, isCod && styles.selectedButton]}
//                 onPress={() => setIsCod(true)}
//             >
//                 <Text style={styles.optionText}>Cash on Delivery</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={[styles.optionButton, !isCod && styles.selectedButton]}
//                 onPress={() => setIsCod(false)}
//             >
//                 <Text style={styles.optionText}>Pay Online</Text>
//             </TouchableOpacity>

//             <View style={styles.summaryBox}>
//                 <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
//                 <Text style={styles.summaryText}>Items: {cartItems.length}</Text>
//             </View>

//             <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
//                 {loading ? (
//                     <ActivityIndicator color="#fff" />
//                 ) : (
//                     <Text style={styles.payButtonText}>
//                         {isCod ? "Place Order" : "Pay Now"}
//                     </Text>
//                 )}
//             </TouchableOpacity>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         backgroundColor: '#fff',
//         flexGrow: 1,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     optionButton: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         padding: 15,
//         marginBottom: 15,
//     },
//     selectedButton: {
//         backgroundColor: '#e0ecff',
//         borderColor: '#406FF3',
//     },
//     optionText: {
//         fontSize: 16,
//     },
//     summaryBox: {
//         padding: 15,
//         backgroundColor: '#f8f8f8',
//         borderRadius: 8,
//         marginTop: 20,
//     },
//     summaryText: {
//         fontSize: 16,
//         marginBottom: 5,
//     },
//     payButton: {
//         marginTop: 30,
//         backgroundColor: '#406FF3',
//         padding: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     payButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default PaymentScreen;
