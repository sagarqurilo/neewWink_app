import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const USER_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94' ;
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
    const variant = item.variants?.[0];
    const image = variant?.images?.[0];
    const price = variant?.price;
    const name = item.name;

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
        <Text style={{ marginTop: 10 }}>Loading wishlist...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Text style={styles.backArrow}>&lt;</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Wishlist</Text>
          {/* <Text style={styles.headerSubtitle}>8 Items</Text> */}
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
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerLeft: {
    padding: 5,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'flex-start',
    padding: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    gap: 2,
  },
  heartIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  shareIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  noImage: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  price: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rating: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
    width: '100%',
  },
  buyNow: {
    backgroundColor: '#407BFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cartIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export default WishlistScreen;
