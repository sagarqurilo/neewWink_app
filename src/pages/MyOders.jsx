import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = size => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const responsiveFontSize = (size) => {
    const newSize = moderateScale(size, 0.5);
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const OrderItem = ({ order, renderStars, onViewOrder }) => (
  <View style={styles.orderItem}>
    <View style={styles.orderHeader}>
      <Text style={[
        styles.orderStatus,
        order.status === 'cancelled' && styles.cancelledStatus,
        order.status === 'pending' && styles.pendingStatus,
        order.status === 'processing' && styles.processingStatus,
        order.status === 'delivered' && styles.deliveredStatus
      ]}>
        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
      </Text>
      <Text style={styles.orderDate}>{order.date}</Text>
    </View>
    <View style={styles.orderDetails}>
      <Image
        source={{ uri: order.image || 'https://t4.ftcdn.net/jpg/01/43/42/83/360_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg' }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.orderId}>Order ID- {order.orderId}</Text>
        <Text style={styles.productName}>{order.productName}</Text>
        <Text style={styles.productBrand}>{order.brand}</Text>
        <Text style={styles.productAmount}>₹{parseFloat(order.totalAmount).toFixed(2)}</Text>
        {order.status !== 'cancelled' && (
          <>
            <Text style={styles.rateText}>Rate This Product Now</Text>
            {renderStars(order.rating)}
          </>
        )}
        <TouchableOpacity style={styles.viewOrderButton} onPress={() => onViewOrder(order)}>
          <Text style={styles.viewOrderButtonText}>View Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function MyOrders() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Completed');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const fetchOrders = async (tab) => {
    try {
      setLoading(true);
      setError(null);

      let status = '';
      if (tab === 'Active') status = '';
      else if (tab === 'Completed') status = 'delivered';
      else if (tab === 'Cancelled') status = 'cancelled';

      const response = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/order/user_orders?status=${status}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: totalStars }, (_, i) => (
          <Image
            key={i}
            source={require('../assets/images/starlogo.png')}
            style={[styles.starIcon, { opacity: i < rating ? 1 : 0.3 }]}
          />
        ))}
      </View>
    );
  };

  const handleViewOrder = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/arrowbtn.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.searchContainer}>
        <Image source={require('../assets/images/search.png')} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search in orders..." placeholderTextColor="#888" />
        <Image source={require('../assets/images/micro.png')} style={styles.microIcon} />
      </View>

      <View style={styles.tabsContainer}>
        {['Active', 'Completed', 'Cancelled'].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.orderList}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : orders.length === 0 ? (
          <Text style={styles.emptyText}>No orders found</Text>
        ) : (
          orders.map(order => (
            <OrderItem
              key={order._id}
              order={{
                ...order,
                productName: order.products[0]?.productName || 'Product Name',
                brand: order.products[0]?.productBrand || 'Brand',
                image: order.products[0]?.image || null,
                date: new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'}),
                orderId: order._id,
                rating: order.rating || 0,
                totalAmount: order.totalAmount || 0,
              }}
              renderStars={renderStars}
              onViewOrder={handleViewOrder}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: verticalScale(40) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: responsiveFontSize(18), fontWeight: 'bold', marginLeft: scale(10) },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(25),
    marginHorizontal: scale(15),
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(2),
  },
  searchIcon: { marginRight: scale(10), width: moderateScale(20), height: moderateScale(20) },
  searchInput: { flex: 1, fontSize: responsiveFontSize(16), paddingVertical: verticalScale(10) },
  microIcon: { width: moderateScale(20), height: moderateScale(24) },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  tab: { fontSize: responsiveFontSize(16), paddingVertical: verticalScale(10), paddingHorizontal: scale(20), color: '#888' },
  activeTab: { color: '#007BFF', borderBottomWidth: moderateScale(2), borderBottomColor: '#007BFF' },
  orderList: { flex: 1, paddingHorizontal: scale(15) },
  loader: { marginTop: verticalScale(20) },
  errorText: { color: 'red', textAlign: 'center', marginTop: verticalScale(20), fontSize: responsiveFontSize(14) },
  emptyText: { textAlign: 'center', marginTop: verticalScale(20), color: '#888', fontSize: responsiveFontSize(14) },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(5),
    padding: moderateScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(1),
    elevation: moderateScale(1),
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(10) },
  orderStatus: { fontSize: responsiveFontSize(14), fontWeight: 'bold', color: 'green' },
  cancelledStatus: { color: 'red' },
  pendingStatus: { color: '#FFA500' },
  processingStatus: { color: '#007BFF' },
  deliveredStatus: { color: 'green' },
  orderDate: { fontSize: responsiveFontSize(14), color: '#888' },
  orderDetails: { flexDirection: 'row' },
  productImage: { width: moderateScale(138.73), height: moderateScale(109), borderRadius: moderateScale(5), marginRight: scale(10) },
  productInfo: { flex: 1 },
  orderId: { fontSize: responsiveFontSize(14), color: '#555', marginBottom: verticalScale(5) },
  productName: { fontSize: responsiveFontSize(16), fontWeight: 'bold', marginBottom: verticalScale(5) },
  productBrand: { fontSize: responsiveFontSize(14), color: '#888', marginBottom: verticalScale(5) },
  productAmount: { fontSize: responsiveFontSize(14), fontWeight: 'bold', color: '#333', marginBottom: verticalScale(5) },
  rateText: { fontSize: responsiveFontSize(14), color: '#555', marginBottom: verticalScale(5) },
  viewOrderButton: {
    marginTop: verticalScale(10),
    borderColor: '#007BFF',
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(5),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(10),
    alignSelf: 'flex-start',
  },
  viewOrderButtonText: { color: '#007BFF', fontSize: responsiveFontSize(14) },
  backIcon: { width: moderateScale(24), height: moderateScale(20) },
  starIcon: { width: moderateScale(15), height: moderateScale(15), marginRight: scale(2) },
});