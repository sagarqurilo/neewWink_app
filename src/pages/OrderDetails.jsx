import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

function OrderDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};

  const priceDetails = {
    currentPrice: '₹500',
    originalPrice: '₹999',
    discount: '20% off',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
         
          <Image source={require('../assets/images/arrowbtn.png')} style={styles.backIcon} /> 
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Order Summary Card */}
        <View style={styles.card}>
          <Text style={[styles.cardHeader, order?.status === 'Cancelled' && styles.cancelledHeader]}>
            {order?.status} on 6 Mar 
          </Text>

          <View style={styles.orderSummaryDetails}>
            <Image source={order?.image} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.orderId}>Order ID- {order?.orderId}</Text>
              <Text style={styles.productName}>{order?.productName}</Text>
              <Text style={styles.productBrand}>{order?.brand}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>{priceDetails.currentPrice}</Text>
                <Text style={styles.originalPrice}>{priceDetails.originalPrice}</Text>
                <Text style={styles.discount}>{priceDetails.discount}</Text>
              </View>
              <TouchableOpacity style={styles.buyAgainButton}>
                <Text style={styles.buyAgainButtonText}>Buy again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Order Status Section */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.card}>
          <View style={styles.statusItem}>
            <View style={styles.statusIndicator}><Text style={styles.statusIndicatorText}>✓</Text></View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusText}>Order Placed</Text>
              <Text style={styles.statusDate}>22 Feb 2024, 12:00 PM </Text>
            </View>
           
            {/* <Text style={styles.statusIconPlaceholder}>--</Text>*/}
          </View>
          {/* Vertical Line */}
          <View style={styles.statusLine}></View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, styles.cancelledStatusIndicator]}><Text style={styles.statusIndicatorText}>X</Text></View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusText, styles.cancelledStatusText]}>Cancelled</Text>
              <Text style={styles.statusDate}>22 Feb 2024, 01:20 PM </Text>
            </View>
            
            <Text style={styles.statusIconPlaceholder}>X</Text>
          </View>
        </View>

        {/* Delivery Details Section */}
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <View style={styles.card}>
          <View style={styles.deliveryItem}>
             
            <Text style={styles.deliveryIconPlaceholder}>🏠</Text>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryName}>Name <Text style={styles.homeLabel}>Home</Text></Text>
              <Text style={styles.deliveryAddress}>B-26 Janakpuri west, near Post Office,</Text>
               <Text style={styles.deliveryAddress}>New Delhi - 110015 </Text>
            </View>
          </View>
          <View style={styles.deliveryItem}>
           
            <Text style={styles.deliveryIconPlaceholder}>📞</Text>
            <Text style={styles.deliveryPhone}>(+91) 9589425789</Text>
          </View>
        </View>

        {/* Price Details Section */}
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.card}>
          <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>Total MRP</Text>
            <Text style={styles.priceDetailValue}>₹1050 </Text>
          </View>
          
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backIcon: {
    width: 24, 
    height: 20
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  
  },
  helpText: {
    fontSize: 14,
    color: '#007BFF', 
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  cancelledHeader: {
    color: 'red',
  },
  orderSummaryDetails: {
    flexDirection: 'row',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discount: {
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
  },
  buyAgainButton: {
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  buyAgainButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    marginLeft: 5,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
    cancelledStatusIndicator: {
    backgroundColor: 'red',
  },
  statusIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelledStatusText: {
    color: 'red',
  },
  statusDate: {
    fontSize: 12,
    color: '#888',
  },
  statusIconPlaceholder: {
    fontSize: 12,
    color: '#888', 
  },
   statusLine: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 24, 
    width: 2, 
    backgroundColor: '#ccc', 
  },
  deliveryItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  deliveryIconPlaceholder: {
     fontSize: 18, 
     color: '#555', 
     marginRight: 10,
     marginTop: 2, 
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
     fontSize: 14,
     fontWeight: 'bold',
     marginBottom: 2,
  },
  homeLabel: {
    fontSize: 12,
    color: '#007BFF', 
    backgroundColor: '#e0f2ff', 
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginLeft: 5,
    fontWeight: 'normal',
  },
  deliveryAddress: {
     fontSize: 14,
     color: '#555',
  },
  deliveryPhone: {
     fontSize: 14,
     color: '#555',
     marginTop: 2,
  },
  priceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priceDetailLabel: {
    fontSize: 14,
    color: '#555',
  },
  priceDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
})

export default OrderDetails
