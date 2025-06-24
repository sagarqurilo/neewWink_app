import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  PixelRatio, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const USER_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwNzQ3NTA4LCJleHAiOjE3NTEzNTIzMDh9.wsB8rNth3RrLjH4FQ7s4D7tf1TwCo0kNUqzTNHtqJvM' ;
   const fetchWishlistData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/wishlist',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${USER_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok && Array.isArray(data.wishlist)) {
        setWishlistItems(data.wishlist);
      } else {
        console.error('Wishlist not loaded correctly:', data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWishlistData();
    }, [fetchWishlistData])
  );

  const renderItem = ({ item }) => {
    const product = item.product;
    const variant = item.variants?.[0]; // This was original and kept the same
    const image = variant?.images?.[0];
    const price = variant?.price;
    const name = item.name; // This was original and kept the same

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={require('../assets/images/heart1.png')} style={styles.heartIcon} />
          <Image source={require('../assets/images/sharelogo.png')} style={styles.shareIcon} />
        </View>

        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.noImage}><Text>No Image</Text></View>
        )}

        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>w/RGB LEDs, Light Weight</Text>

        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.rating}>⭐ 6.6   66 Reviews</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buyNow}>
            <Text style={styles.buyNowText}>Buy now</Text>
          </TouchableOpacity>
          <Image source={require('../assets/images/cartlogo.png')} style={styles.cartIcon} />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: verticalScale(10) }}>Loading wishlist...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" style={styles.backArrow} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <View style={styles.headerRight}>
          <Image source={require('../assets/images/search.png')} style={styles.headerIcon} />
          <Image source={require('../assets/images/cartlogo.png')} style={styles.headerIcon} />
        </View>
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item?.product?._id || item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: verticalScale(20), paddingHorizontal: scale(10) }}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerLeft: {
    padding: moderateScale(5), 
  },
  backArrow: {
    fontSize: responsiveFontSize(24), 
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: responsiveFontSize(18), 
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(12),
    color: '#777',
  },
  headerRight: {
    flexDirection: 'row',
    gap: scale(15), 
  },
  headerIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: moderateScale(5),
    borderRadius: moderateScale(10), 
    borderWidth: moderateScale(1),
    borderColor: '#ddd',
    alignItems: 'flex-start',
    padding: moderateScale(8),
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) }, // Responsive
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4), // Responsive
    elevation: moderateScale(3), // Responsive
    maxWidth: (SCREEN_WIDTH / 2) - scale(10), 
  },
  cardHeader: {
    position: 'absolute',
    top: verticalScale(10), // Responsive
    right: scale(10), // Responsive
    flexDirection: 'column',
    gap: verticalScale(2), // Responsive
    zIndex: 1, // Ensure icons are clickable
  },
  heartIcon: {
    width: moderateScale(20), // Responsive
    height: moderateScale(20), // Responsive
    resizeMode: 'contain',
  },
  shareIcon: {
    width: moderateScale(20), // Responsive
    height: moderateScale(20), // Responsive
    resizeMode: 'contain',
  },
  image: {
    width: moderateScale(100), // Responsive
    height: moderateScale(100), // Responsive
    resizeMode: 'contain',
    marginBottom: verticalScale(8), // Responsive
  },
  noImage: {
    width: moderateScale(100), // Responsive
    height: moderateScale(100), // Responsive
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(14), // Responsive
    marginVertical: verticalScale(4), // Responsive
  },
  subtitle: {
    fontSize: responsiveFontSize(12), // Responsive
    color: '#777',
    marginBottom: verticalScale(4), // Responsive
  },
  price: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(14), // Responsive
  },
  rating: {
    fontSize: responsiveFontSize(12), // Responsive
    color: '#888',
    marginBottom: verticalScale(6), // Responsive
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6), // Responsive
    justifyContent: 'space-between',
    width: '100%',
  },
  buyNow: {
    backgroundColor: '#407BFF',
    paddingHorizontal: scale(8), // Responsive
    paddingVertical: verticalScale(4), // Responsive
    borderRadius: moderateScale(6), // Responsive
  },
  buyNowText: {
    color: '#fff',
    fontSize: responsiveFontSize(12), // Responsive
    fontWeight: '600',
  },
  cartIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export default WishlistScreen;