import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    Platform,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

import {
    horizontalScale,
    verticalScale,
    moderateScale,
    fontScale,
} from '../component/ResponsiveMetrix';

const Home = () => {
    const navigation = useNavigation();

    const [tabs, setTabs] = useState([]);
    // const [activeTab, setActiveTab] = useState('');
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeBottomTab, setActiveBottomTab] = useState('Home');
    const [topDeals, setTopDeals] = useState([]);
    const [loadingDeals, setLoadingDeals] = useState(true);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [error, setError] = useState(null);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loadingTrending, setLoadingTrending] = useState(true); // State for trending products loading

    const [nearbyStores, setNearbyStores] = useState([]);
    const [loadingNearbyStores, setLoadingNearbyStores] = useState(true);
    const [locationError, setLocationError] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    const [activeCategory, setActiveCategory] = useState(null);

    const API_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Mzk3YTYzYWM5MTRhYzhlYWI4YmVjNiIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ5NjM2NzQzLCJleHAiOjE3NTAyNDE1NDN9.IK3-YQN8tQWOxUdEmX33OHQ6hAL6LNeKiMwZ_-CiX5c`;

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/category', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategories(data);
                const allSubCategories = data.reduce((acc, category) => {
                    if (category.subCategories && Array.isArray(category.subCategories)) {
                        return [...acc, ...category.subCategories];
                    }
                    return acc;
                }, []);
                setSubCategories(allSubCategories);
            }
        } catch (error) {
            console.error('API fetch error (Categories):', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

   
    const fetchTopDeals = async () => {
        try {
            setLoadingDeals(true);
            const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/top_deals', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });
            const data = await response.json();
            if (data && data.products) {
                setTopDeals(data.products);
            }
        } catch (error) {
            console.error('Top Deals API fetch error:', error);
        } finally {
            setLoadingDeals(false);
        }
    };

    const fetchTrendingProducts = async () => {
        try {
            setLoadingTrending(true);
            const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/trending', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });
            const data = await response.json();
            console.log("Trending Products API Response:", data); 

            if (data && Array.isArray(data)) {
                setTrendingProducts(data);
            } else if (data && Array.isArray(data.products)) { 
                setTrendingProducts(data.products);
            } else {
                console.warn("Trending products API response is not in expected format:", data);
                setTrendingProducts([]); 
            }
        } catch (error) {
            console.error('Trending Products API fetch error:', error);
        } finally {
            setLoadingTrending(false); 
        }
    };


    const requestLocationPermission = async () => {
        console.log("Requesting location permission...");
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location to find nearby stores.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Location permission granted');
                    getCurrentLocation();
                } else {
                    console.log('Location permission denied');
                    setLocationError('Location permission denied. Cannot show nearby stores.');
                    setLoadingNearbyStores(false);
                }
            } catch (err) {
                console.warn('Error requesting location permission:', err);
                setLocationError('Error requesting location permission.');
                setLoadingNearbyStores(false);
            }
        } else {
            console.log('iOS platform detected, getting location...');
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        console.log("Getting current location...");
        setLoadingNearbyStores(true);
        setLocationError(null);
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Location obtained:', { latitude, longitude });
                setCurrentLocation({ latitude, longitude });
                fetchNearbyStores(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Could not retrieve your current location.';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = 'Location permission was denied. Please enable it in app settings.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = 'Location information is unavailable.';
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = 'Location request timed out. Please try again.';
                }
                setLocationError(errorMessage);
                setLoadingNearbyStores(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
    };

    const fetchNearbyStores = async (lat, long) => {
        console.log("Fetching nearby stores with coordinates:", { lat, long });
        try {
            setLoadingNearbyStores(true);
            const url = `https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/nearby_stores?lat=${lat}&long=${long}&radius=100000`;
            console.log("API URL:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });
            const data = await response.json();
            console.log("Nearby Stores API Response:", data);

            if (data && data.nearbyStores) {
                console.log("Setting nearby stores:", data.nearbyStores);
                setNearbyStores(data.nearbyStores);
                setLocationError(null);
            } else {
                console.log("No stores found in response");
                setNearbyStores([]);
                setLocationError('No stores found nearby.');
            }
        } catch (error) {
            console.error('Nearby Stores API fetch error:', error);
            setLocationError('Failed to load nearby stores. Please try again later.');
        } finally {
            setLoadingNearbyStores(false);
        }
    };

    useEffect(() => {
        console.log("Component mounted, initializing...");
        fetchData();
        fetchTopDeals();
        fetchTrendingProducts(); 
        requestLocationPermission();
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: verticalScale(80) }}>
                {/* Top Bar - Location and Avatar */}
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.locationTitle}>Janakpuri</Text>
                        <Text style={styles.locationSubtitle}>
                            {currentLocation ?
                                `Lat: ${currentLocation.latitude.toFixed(4)}, Long: ${currentLocation.longitude.toFixed(4)}`
                                : locationError ? locationError : 'Getting location...'}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('MyAccount')}>
                        <Image
                            source={require('../assets/images/headerimg.png')}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder="Search for Products..."
                        style={styles.searchInput}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/images/micro.png')}
                            style={styles.searchIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* Categories Section */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#3575F6" style={{ marginVertical: verticalScale(20) }} />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <FlatList
                        data={subCategories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.categoryList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.categoryCard}
                                onPress={() => {
                                    setActiveCategory(item._id);
                                    navigation.navigate('CategoryProducts', { category: item });
                                }}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.categoryImg}
                                    resizeMode="cover"
                                />
                                <Text style={styles.categoryText}>{item.name}</Text>
                                {activeCategory === item._id && (
                                    <View style={styles.activeCategoryIndicator} />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyText}>No subcategories available</Text>
                        )}
                    />
                )}

                {/* Banner */}
                <View style={styles.banner}>
                    <Image
                        source={require('../assets/images/Placeholder_01.png')}
                        style={styles.bannerImg}
                        resizeMode="cover"
                    />
                </View>

                {/* Stores Near by you Section  */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Stores Near by you</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {loadingNearbyStores ? (
                    <ActivityIndicator size="large" color="#3575F6" style={{ marginVertical: verticalScale(20) }} />
                ) : locationError ? (
                    <Text style={styles.errorText}>{locationError}</Text>
                ) : (
                    <FlatList
                        data={nearbyStores}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.storeList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.storeCard}
                                onPress={() => console.log('Navigating to store details:', item.store)}
                            >
                                <View style={styles.storeImageContainer}>
                                    {/* Placeholder image for stores, replace with actual store image if available */}
                                    <Image
                                        source={require('../assets/images/Placeholder_01.png')}
                                        style={styles.storeImg}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.storeInfoContainer}>
                                    <Text style={styles.storeText} numberOfLines={1}>{item.store}</Text>
                                    <Text style={styles.storeAddress} numberOfLines={2}>{item.storeAddress}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No stores found near your location.</Text>
                            </View>
                        )}
                    />
                )}


                {/* Trending Products Section (Tabs removed) */}
                <Text style={[styles.sectionTitle, { marginHorizontal: horizontalScale(20), marginTop: verticalScale(20) }]}>Trending Products</Text>
                {loadingTrending ? (
                    <ActivityIndicator size="large" color="#3575F6" style={{ marginVertical: verticalScale(20) }} />
                ) : (
                    <FlatList
                        data={trendingProducts} // Directly use trendingProducts without filtering
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => `trending-${item._id}-${index}`}
                        contentContainerStyle={styles.trendingList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.trendingCard}
                                onPress={() => navigation.navigate('ViewProducts', { productId: item._id })}
                            >
                                <Image
                                    
                                    source={{ uri: item.variants?.[0]?.images?.[0] || 'https://via.placeholder.com/150' }} // Fallback image
                                    style={styles.trendingImg}
                                    resizeMode="cover"
                                />
                                <Text style={styles.trendingText} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.brandText}>{item.brand}</Text>
                                <Text style={styles.trendingPrice}>₹{item.variants?.[0]?.price}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No trending products available.</Text>
                            </View>
                        )}
                    />
                )}

                {/* Top Deals Section (kept as per original) */}
                <Text style={[styles.sectionTitle, { marginHorizontal: horizontalScale(20), marginTop: verticalScale(20) }]}>Top Deals</Text>
                {loadingDeals ? (
                    <ActivityIndicator size="large" color="#3575F6" style={{ marginVertical: verticalScale(20) }} />
                ) : (
                    <FlatList
                        data={topDeals}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => `deals-${item._id}-${index}`}
                        contentContainerStyle={styles.trendingList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.trendingCard}
                                onPress={() => navigation.navigate('ViewProducts', { productId: item._id })}
                            >
                                <Image
                                    source={{ uri: item.variants?.[0]?.images?.[0] || 'https://via.placeholder.com/150' }} // Handle nested variants/images or provide fallback
                                    style={styles.trendingImg}
                                    resizeMode="cover"
                                />
                                <Text style={styles.trendingText} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.brandText}>{item.brand}</Text>
                                <Text style={styles.trendingPrice}>₹{item.variants?.[0]?.price}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No top deals available</Text>
                            </View>
                        )}
                    />
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => {
                        setActiveBottomTab('Home');
                        navigation.navigate('Home');
                    }}
                >
                    <Image
                        source={require('../assets/images/homelogo.png')}
                        style={[
                            styles.navIcon,
                            activeBottomTab === 'Home' && { tintColor: '#406FF3' }
                        ]}
                        resizeMode="contain"
                    />
                    <Text style={activeBottomTab === 'Home' ? styles.navTextActive : styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => {
                        setActiveBottomTab('Categories');
                        navigation.navigate('Categories');
                    }}
                >
                    <Image
                        source={require('../assets/images/categeroies.png')}
                        style={[
                            styles.navIcon,
                            activeBottomTab === 'Categories' && { tintColor: '#3575FF' }
                        ]}
                        resizeMode="contain"
                    />
                    <Text style={activeBottomTab === 'Categories' ? styles.navTextActive : styles.navText}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => {
                        setActiveBottomTab('Wishlist');
                        navigation.navigate('WishList');
                    }}
                >
                    <Image
                        source={require('../assets/images/heartlogo.png')}
                        style={[
                            styles.navIcon,
                            activeBottomTab === 'Wishlist' && { tintColor: '#3575F6' }
                        ]}
                        resizeMode="contain"
                    />
                    <Text style={activeBottomTab === 'Wishlist' ? styles.navTextActive : styles.navText}>Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => {
                        setActiveBottomTab('Cart');
                        navigation.navigate('MyCart');
                    }}
                >
                    <Image
                        source={require('../assets/images/cartlogo.png')}
                        style={[
                            styles.navIcon,
                            activeBottomTab === 'Cart' && { tintColor: '#406FF3' }
                        ]}
                        resizeMode="contain"
                    />
                    <Text style={activeBottomTab === 'Cart' ? styles.navTextActive : styles.navText}>Cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(20),
        paddingTop: verticalScale(60),
        marginBottom: verticalScale(10),
    },
    locationTitle: {
        fontSize: fontScale(14),
        fontWeight: '400', // Changed to string for consistency
        color: '#000000',
    },
    locationSubtitle: {
        fontSize: fontScale(12),
        color: '#000000',
        marginTop: verticalScale(2),
    },
    avatar: {
        width: horizontalScale(34),
        height: horizontalScale(38),
        borderRadius: horizontalScale(19),
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginHorizontal: horizontalScale(20),
        paddingHorizontal: horizontalScale(13),
        marginBottom: verticalScale(8),
        marginTop: verticalScale(10),
        height: verticalScale(42),
        shadowColor: '#000', // Added subtle shadow for search bar
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: fontScale(14),
        color: '#222',
        fontWeight: '400', // Changed to string
    },
    searchIcon: {
        width: horizontalScale(22),
        height: horizontalScale(22),
        tintColor: '#888',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: horizontalScale(16),
        marginTop: verticalScale(30),
        marginBottom: verticalScale(6),
    },
    sectionTitle: {
        fontSize: fontScale(16),
        fontWeight: 'bold',
        color: '#222',
    },
    seeAll: {
        fontSize: fontScale(12),
        color: '#3575F6',
        marginBottom: verticalScale(8),
    },
    categoryList: {
        paddingLeft: horizontalScale(20),
        paddingRight: horizontalScale(10),
        marginBottom: verticalScale(12),
    },
    categoryCard: {
        alignItems: 'center',
        marginRight: horizontalScale(24),
        width: horizontalScale(80),
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: moderateScale(12),
    },
    categoryImg: {
        width: horizontalScale(48),
        height: horizontalScale(48),
        borderRadius: horizontalScale(24),
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    categoryText: {
        fontSize: fontScale(12),
        color: '#333',
        textAlign: 'center',
        fontWeight: '500',
    },
    activeCategoryIndicator: {
        height: 3,
        backgroundColor: '#3575F6',
        width: '80%',
        borderRadius: 2,
        marginTop: 5,
    },
    banner: {
        flexDirection: 'row',
        borderRadius: 16,
        marginHorizontal: horizontalScale(10),
        top: verticalScale(10),
        padding: moderateScale(1),
        marginBottom: verticalScale(10),
        minHeight: verticalScale(100),
    },
    bannerImg: {
        width: '100%',
        height: verticalScale(170),
        borderRadius: 16,
        marginBottom: verticalScale(10),
    },
    storeList: {
        paddingLeft: horizontalScale(20),
        marginBottom: verticalScale(10),
    },
    storeCard: {
        width: horizontalScale(200),
        marginRight: horizontalScale(15),
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    storeImageContainer: {
        width: '100%',
        height: verticalScale(120),
    },
    storeImg: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    storeInfoContainer: {
        padding: moderateScale(12),
    },
    storeText: {
        fontSize: fontScale(14),
        color: '#333',
        fontWeight: '600',
        marginBottom: 4,
    },
    storeAddress: {
        fontSize: fontScale(12),
        color: '#666',
        lineHeight: 16,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(20),
        marginBottom: verticalScale(15),
        marginTop: verticalScale(10),
    },
    tab: {
        paddingHorizontal: horizontalScale(15),
        paddingVertical: verticalScale(8),
        marginRight: horizontalScale(10),
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeTab: {
        backgroundColor: '#3575F6',
    },
    tabText: {
        fontSize: fontScale(12),
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '500',
    },
    trendingList: {
        paddingLeft: horizontalScale(20),
        paddingRight: horizontalScale(10),
        marginBottom: verticalScale(15),
    },
    trendingCard: {
        width: horizontalScale(160),
        marginRight: horizontalScale(15),
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: moderateScale(12),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    trendingImg: {
        width: '100%',
        height: verticalScale(140),
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#f0f0f0', // Placeholder background
    },
    trendingText: {
        fontSize: fontScale(14),
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
    },
    trendingPrice: {
        fontSize: fontScale(15),
        color: '#3575F6',
        fontWeight: '600',
        marginTop: 4,
    },
    brandText: {
        fontSize: fontScale(12),
        color: '#666',
        marginBottom: 2,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: verticalScale(60),
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        paddingBottom: verticalScale(4),
        shadowColor: '#000', // Subtle shadow for bottom nav
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 5,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: horizontalScale(60),
        paddingVertical: verticalScale(8),
        borderRadius: 8,
    },
    navIcon: {
        width: horizontalScale(22),
        height: horizontalScale(22),
        marginBottom: 2,
    },
    navText: {
        fontSize: fontScale(10),
        color: '#888',
    },
    navTextActive: {
        fontSize: fontScale(10),
        color: '#3575F6',
        fontWeight: '600',
    },
    loader: { // Defined but not directly used in the current structure
        marginVertical: verticalScale(20),
    },
    emptyContainer: {
        padding: verticalScale(20),
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
    },
    emptyText: {
        fontSize: fontScale(14),
        color: '#666',
        textAlign: 'center',
        marginTop: verticalScale(10),
        fontStyle: 'italic',
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        marginVertical: verticalScale(20),
        fontSize: fontScale(14),
        fontWeight: '500',
    },
});

export default Home;