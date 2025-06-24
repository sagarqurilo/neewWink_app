import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Alert,
    PixelRatio,
    SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const recommendedItemWidth = moderateScale(160);

const CartItem = ({ item, onRemove, onUpdateQuantity, onPress }) => {
    const productName = item.product?.name || 'Product Name';
    const brandName = item.product?.brand || 'No Brand';
    const variantPrice = item.selectedVariant?.price;
    const variantOriginalPrice = item.selectedVariant?.originalPrice || variantPrice;
    const itemImage = item.selectedVariant?.images?.[0] || 'https://placehold.co/160x120/E0E0E0/333333?text=No+Image';

    const discountPercentage = (variantOriginalPrice && variantPrice && variantOriginalPrice > variantPrice)
        ? ((variantOriginalPrice - variantPrice) / variantOriginalPrice * 100).toFixed(0)
        : 0;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.cartItemContainer}>
            <Image source={{ uri: itemImage }} style={styles.cartItemImage} resizeMode="contain" />
            <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{productName}</Text>
                <Text style={styles.cartItemBrand}>{brandName}</Text>
                <View style={styles.cartItemRating}>
                    <Image source={require('../assets/images/starlogo.png')} style={[styles.smallIcon, { tintColor: '#FFD700' }]} />
                    <Image source={require('../assets/images/starlogo.png')} style={[styles.smallIcon, { tintColor: '#FFD700' }]} />
                    <Image source={require('../assets/images/starlogo.png')} style={[styles.smallIcon, { tintColor: '#FFD700' }]} />
                    <Image source={require('../assets/images/starlogo.png')} style={[styles.smallIcon, { tintColor: '#FFD700' }]} />
                    <Image source={require('../assets/images/starlogo.png')} style={styles.smallIcon} />
                </View>
                <View style={styles.cartItemPriceRow}>
                    <Text style={styles.cartItemPrice}>₹{variantPrice}</Text>
                    {variantOriginalPrice > variantPrice && (
                        <>
                            <Text style={styles.cartItemOriginalPrice}>₹{variantOriginalPrice}</Text>
                            <Text style={styles.cartItemDiscount}>{discountPercentage}% Off</Text>
                        </>
                    )}
                </View>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => onUpdateQuantity(item._id, item.quantity - 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => onUpdateQuantity(item._id, item.quantity + 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => onRemove(item._id)} style={styles.removeButton}>
                <Image source={require('../assets/images/delete.png')} style={styles.deleteIcon} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const RecommendedItem = ({ item, onPress }) => {
    const productName = item.name || 'Product Name';
    const brandName = item.brand || 'No Brand';
    const productImage = item.variants?.[0]?.images?.[0] || 'https://placehold.co/160x120/E0E0E0/333333?text=No+Image';
    const productPrice = item.variants?.[0]?.price || item.price || '0';
    const originalPrice = item.variants?.[0]?.mrp || item.offerPrice || productPrice;

    const discountPercentage = (originalPrice && productPrice && originalPrice > productPrice)
        ? ((originalPrice - productPrice) / originalPrice * 100).toFixed(0)
        : 0;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.recommendedItemContainer}>
            <Image source={{ uri: productImage }} style={styles.recommendedItemImage} resizeMode="contain" />
            <Text style={styles.recommendedItemName}>{productName}</Text>
            <Text style={styles.recommendedItemBrand}>{brandName}</Text>
            <View style={styles.recommendedItemPriceRow}>
                <Text style={styles.recommendedItemPrice}>₹{productPrice}</Text>
                {originalPrice > productPrice && (
                    <>
                        <Text style={styles.recommendedItemOriginalPrice}>₹{originalPrice}</Text>
                        <Text style={styles.recommendedItemDiscount}>{discountPercentage}% Off</Text>
                    </>
                )}
            </View>
            <View style={styles.recommendedItemRatingContainer}>
                <Image source={require('../assets/images/starlogo.png')} style={[styles.smallIcon, { tintColor: '#FFD700' }]} />
                <Text style={styles.recommendedItemRatingText}>4.5</Text>
                <Text style={styles.recommendedItemReviewText}>Reviews</Text>
            </View>
        </TouchableOpacity>
    );
};

function MyCart({ navigation, route }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(false);
    const [trendingError, setTrendingError] = useState(null);

    const CART_API_BASE_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/addtocart/';
    const TRENDING_API_URL = 'https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/trending';
    const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

    const fetchTrendingProducts = async () => {
        setTrendingLoading(true);
        setTrendingError(null);
        try {
            const response = await fetch(TRENDING_API_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setTrendingProducts(data.products || []);
            } else {
                setTrendingError(data.message || 'Failed to fetch trending products');
                setTrendingProducts([]);
            }
        } catch (err) {
            setTrendingError('Network error or unable to connect to server');
            setTrendingProducts([]);
        } finally {
            setTrendingLoading(false);
        }
    };

    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${CART_API_BASE_URL}user`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${TOKEN}` },
            });
            const data = await response.json();
            if (response.ok) {
                let itemsToSet = data;
                if (data && typeof data === 'object' && Array.isArray(data.cartItems)) {
                    itemsToSet = data.cartItems;
                } else if (!Array.isArray(data)) {
                    itemsToSet = [];
                }
                setCartItems(itemsToSet);
            } else {
                setError(data.message || `Failed to fetch cart items (Status: ${response.status})`);
            }
        } catch (err) {
            setError('Network error or no connection to server. Please check your device\'s internet connection or the server status.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        const originalCartItems = cartItems
        setCartItems(cartItems.filter(item => item._id !== itemId));
        try {
            const response = await fetch(`${CART_API_BASE_URL}${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', data.message || 'Item removed from cart.');
            } else {
                setCartItems(originalCartItems);
                Alert.alert('Error', data.message || 'Failed to remove item from cart.');
            }
        } catch (err) {
            setCartItems(originalCartItems);
            Alert.alert('Error', 'Network error or unable to connect to server. Please try again.');
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            Alert.alert(
                "Remove Item?",
                "Do you want to remove this item from your cart?",
                [{ text: "Cancel", style: "cancel" }, { text: "Remove", onPress: () => handleRemoveItem(itemId) }]
            );
            return;
        }
        const originalCartItems = cartItems;
        setCartItems(cartItems.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        ));
        try {
            const response = await fetch(`${CART_API_BASE_URL}${itemId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            const data = await response.json();
            if (!response.ok) {
                setCartItems(originalCartItems);
                Alert.alert('Error', data.message || 'Failed to update quantity.');
            }
        } catch (err) {
            setCartItems(originalCartItems);
            Alert.alert('Error', 'Network error or unable to connect to server. Could not update quantity.');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCartItems();
            fetchTrendingProducts();
        });
        fetchTrendingProducts();
        return unsubscribe;
    }, [navigation]);

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.selectedVariant?.price || 0) * item.quantity, 0);
    const totalSaved = cartItems.reduce((sum, item) => {
        const price = item.selectedVariant?.price || 0;
        const originalPrice = item.selectedVariant?.originalPrice || price;
        return sum + (originalPrice - price) * item.quantity;
    }, 0);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#406FF3" />
                <Text style={styles.loadingText}>Loading cart items...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchCartItems}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconLeft} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    <Text style={styles.headerSubtitle}>{cartItems.length} Item(s) valued at ₹{totalAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerIconRight}>
                        <Image source={require('../assets/images/search.png')} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconRight}>
                        <Image source={require('../assets/images/heartlogo.png')} style={styles.headerIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.deliveryContainer}>
                <Image source={require('../assets/images/location.png')} style={styles.locationIcon} />
                <Text style={styles.deliveryText}>Deliver to - Delhi NCR , 110015</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddressBook', { cartItems, totalAmount })}>
                    <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                {cartItems.length === 0 ? (
                    <View style={styles.emptyCartContainer}>
                        <Image source={require('../assets/images/cartlogo.png')} style={styles.emptyCartImage} />
                        <Text style={styles.emptyCartText}>Your cart is empty!</Text>
                        <TouchableOpacity style={styles.emptyCartButton} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.emptyCartButtonText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <CartItem
                                item={item}
                                onRemove={handleRemoveItem}
                                onUpdateQuantity={handleUpdateQuantity}
                                onPress={() => navigation.navigate('ViewProducts', { productId: item.product._id })}
                            />
                        )}
                        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                        scrollEnabled={false}
                    />
                )}

                <Text style={styles.recommendedTitle}>Recommended Products</Text>

                {trendingLoading ? (
                    <View style={styles.trendingLoadingContainer}>
                        <ActivityIndicator size="small" color="#406FF3" />
                        <Text style={styles.trendingLoadingText}>Loading trending products...</Text>
                    </View>
                ) : trendingError ? (
                    <View style={styles.emptyTrendingContainer}>
                        <Text style={styles.trendingErrorText}>Error: {trendingError}</Text>
                        <TouchableOpacity style={styles.retryTrendingButton} onPress={fetchTrendingProducts}>
                            <Text style={styles.retryTrendingButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : trendingProducts.length === 0 ? (
                    <View style={styles.emptyTrendingContainer}>
                        <Text style={styles.emptyTrendingText}>No trending products available</Text>
                        <TouchableOpacity style={styles.retryTrendingButton} onPress={fetchTrendingProducts}>
                            <Text style={styles.retryTrendingButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={trendingProducts}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <RecommendedItem
                                item={item}
                                onPress={() => navigation.navigate('ViewProducts', { productId: item._id })}
                            />
                        )}
                        contentContainerStyle={styles.recommendedList}
                    />
                )}
            </ScrollView>

            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
                        <Text style={styles.totalSaved}>You saved ₹{totalSaved.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={styles.proceedButton} onPress={() => {
                        navigation.navigate('PaymentScreen', { cartItems: cartItems, totalAmount: totalAmount, selectedAddress: null });
                    }}>
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

export default MyCart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: verticalScale(30),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: verticalScale(10),
        fontSize: responsiveFontSize(16),
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: moderateScale(20),
    },
    errorText: {
        color: 'red',
        fontSize: responsiveFontSize(16),
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },
    retryButton: {
        backgroundColor: '#406FF3',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(5),
    },
    retryButtonText: {
        color: '#fff',
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
        justifyContent: 'space-between',
    },
    headerIconLeft: {
        marginRight: scale(13),
    },
    headerIconRight: {
        marginLeft: scale(15),
    },
    headerIcon: {
        width: moderateScale(24),
        height: moderateScale(24),
        resizeMode: 'contain',
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: scale(10),
    },
    headerTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: responsiveFontSize(12),
        color: '#666',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0eaff',
        padding: moderateScale(15),
        justifyContent: 'space-between',
    },
    locationIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
        resizeMode: 'contain',
        marginRight: scale(5),
    },
    deliveryText: {
        fontSize: responsiveFontSize(14),
        color: '#000',
        flex: 1,
    },
    changeButtonText: {
        fontSize: responsiveFontSize(14),
        color: '#000',
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingBottom: verticalScale(120),
    },
    cartItemContainer: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: moderateScale(10),
        padding: moderateScale(15),
        marginBottom: verticalScale(10),
        marginHorizontal: scale(15),
        alignItems: 'center',
    },
    cartItemImage: {
        width: moderateScale(160),
        height: moderateScale(120),
        resizeMode: 'contain',
        marginRight: scale(15),
    },
    cartItemDetails: {
        flex: 1,
    },
    cartItemName: {
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
    },
    cartItemBrand: {
        fontSize: responsiveFontSize(12),
        color: '#666',
        marginBottom: verticalScale(5),
    },
    cartItemRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(5),
    },
    smallIcon: {
        width: moderateScale(15),
        height: moderateScale(15),
        resizeMode: 'contain',
        marginRight: scale(2),
    },
    cartItemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    cartItemPrice: {
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
        color: '#000',
        marginRight: scale(5),
    },
    cartItemOriginalPrice: {
        fontSize: responsiveFontSize(12),
        color: '#888',
        textDecorationLine: 'line-through',
        marginRight: scale(5),
    },
    cartItemDiscount: {
        fontSize: responsiveFontSize(12),
        color: 'red',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: moderateScale(1),
        borderColor: '#eee',
        borderRadius: moderateScale(5),
        width: moderateScale(80),
        justifyContent: 'space-between',
    },
    quantityButton: {
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(4),
    },
    quantityButtonText: {
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
        color: '#000',
    },
    quantityText: {
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        color: '#000',
    },
    removeButton: {
        marginLeft: scale(15),
        padding: moderateScale(5),
    },
    deleteIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
        resizeMode: 'contain',
        tintColor: '#888',
    },
    recommendedTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
        marginHorizontal: scale(15),
        marginTop: verticalScale(20),
    },
    viewAllButton: {
        position: 'absolute',
        right: scale(15),
        top: verticalScale(20),
    },
    viewAllButtonText: {
        fontSize: responsiveFontSize(12),
        color: '#000',
        fontWeight: 'bold',
    },
    recommendedList: {
        paddingHorizontal: scale(15),
        marginTop: verticalScale(10),
    },
    recommendedItemContainer: {
        width: recommendedItemWidth,
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginRight: scale(10),
        alignItems: 'center',
        elevation: moderateScale(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(2),
    },
    recommendedItemImage: {
        width: recommendedItemWidth * 0.8,
        height: recommendedItemWidth * 0.8,
        marginBottom: verticalScale(10),
    },
    recommendedItemName: {
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    recommendedItemBrand: {
        fontSize: responsiveFontSize(12),
        color: '#666',
        textAlign: 'center',
        marginBottom: verticalScale(5),
    },
    recommendedItemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(5),
    },
    recommendedItemPrice: {
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        color: '#000',
        marginRight: scale(5),
    },
    recommendedItemOriginalPrice: {
        fontSize: responsiveFontSize(12),
        color: '#888',
        textDecorationLine: 'line-through',
        marginRight: scale(5),
    },
    recommendedItemDiscount: {
        fontSize: responsiveFontSize(12),
        color: 'red',
        fontWeight: 'bold',
    },
    recommendedItemRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recommendedItemRatingText: {
        fontSize: responsiveFontSize(10),
        marginLeft: scale(2),
        color: '#666',
    },
    recommendedItemReviewText: {
        fontSize: responsiveFontSize(10),
        color: '#666',
        marginLeft: scale(5),
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eee',
        padding: moderateScale(15),
        height: verticalScale(80),
    },
    totalAmount: {
        fontSize: responsiveFontSize(20),
        fontWeight: 'bold',
        color: '#000',
    },
    totalSaved: {
        fontSize: responsiveFontSize(12),
        color: 'green',
        fontWeight: 'bold',
        marginTop: verticalScale(2),
    },
    proceedButton: {
        backgroundColor: '#406FF3',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(30),
        borderRadius: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(50),
        padding: moderateScale(20),
        backgroundColor: '#fff',
        minHeight: verticalScale(200),
    },
    emptyCartImage: {
        width: moderateScale(150),
        height: moderateScale(150),
        resizeMode: 'contain',
        marginBottom: verticalScale(20),
        tintColor: '#ccc',
    },
    emptyCartText: {
        fontSize: responsiveFontSize(18),
        color: '#888',
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },
    emptyCartButton: {
        backgroundColor: '#406FF3',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(25),
        borderRadius: moderateScale(5),
    },
    emptyCartButtonText: {
        color: '#fff',
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
    },
    itemSeparator: {
        height: verticalScale(10),
        backgroundColor: 'transparent',
    },
    trendingLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
    },
    trendingLoadingText: {
        marginTop: verticalScale(10),
        fontSize: responsiveFontSize(16),
        color: '#666',
    },
    emptyTrendingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
    },
    emptyTrendingText: {
        fontSize: responsiveFontSize(16),
        color: '#666',
    },
    retryTrendingButton: {
        backgroundColor: '#406FF3',
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(5),
    },
    retryTrendingButtonText: {
        color: '#fff',
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
    },
    trendingErrorText: {
        color: 'red',
        fontSize: responsiveFontSize(16),
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },
});