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
    Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const recommendedItemWidth = (width - 40) / 2;

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {

    const productName = item.product?.name || 'Product Name';
    const brandName = item.product?.brand || 'No Brand';
    const variantPrice = item.selectedVariant?.price; 
    const variantOriginalPrice = item.selectedVariant?.originalPrice || variantPrice; 
    const itemImage = item.selectedVariant?.images?.[0] || 'https://placehold.co/160x120/E0E0E0/333333?text=No+Image'; 

    const discountPercentage = (variantOriginalPrice && variantPrice && variantOriginalPrice > variantPrice)
        ? ((variantOriginalPrice - variantPrice) / variantOriginalPrice * 100).toFixed(0)
        : 0;

    return (
        <View style={styles.cartItemContainer}>
            <Image source={{ uri: itemImage }} style={styles.cartItemImage} resizeMode="contain" />
            <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{productName}</Text>
                <Text style={styles.cartItemBrand}>{brandName}</Text>
                <View style={styles.cartItemRating}>
                    {/* Star icons are still placeholders */}
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
        </View>
    );
};

const RecommendedItem = ({ item }) => {
    // Extract data from the API response structure
    const productName = item.name || 'Product Name';
    const brandName = item.brand || 'No Brand';
    const productImage = item.variants?.[0]?.images?.[0] || 'https://placehold.co/160x120/E0E0E0/333333?text=No+Image';
    const productPrice = item.variants?.[0]?.price || item.price || '0';
    const originalPrice = item.variants?.[0]?.mrp || item.offerPrice || productPrice;
    
    const discountPercentage = (originalPrice && productPrice && originalPrice > productPrice)
        ? ((originalPrice - productPrice) / originalPrice * 100).toFixed(0)
        : 0;

    return (
        <View style={styles.recommendedItemContainer}>
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
        </View>
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

    // Function to fetch trending products
    const fetchTrendingProducts = async () => {
        setTrendingLoading(true);
        setTrendingError(null);
        try {
            const response = await fetch(TRENDING_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log("Trending Products API Response:", data);

            if (response.ok && data.success) {
                setTrendingProducts(data.products || []);
            } else {
                console.error('Failed to fetch trending products:', data.message);
                setTrendingError(data.message || 'Failed to fetch trending products');
                setTrendingProducts([]);
            }
        } catch (err) {
            console.error("Error fetching trending products:", err);
            setTrendingError('Network error or unable to connect to server');
            setTrendingProducts([]);
        } finally {
            setTrendingLoading(false);
        }
    };

    // Function to fetch cart items
    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${CART_API_BASE_URL}user`, { // Fetch all user cart items
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
            });
            const data = await response.json();
            console.log("API Response Data (fetchCartItems):", data);

            if (response.ok) {
                let itemsToSet = data;
                if (data && typeof data === 'object' && Array.isArray(data.cartItems)) {
                    itemsToSet = data.cartItems;
                } else if (!Array.isArray(data)) {

                    console.warn("API returned non-array data, attempting to interpret as single cart or empty:", data);
                    itemsToSet = []; 
                }
                setCartItems(itemsToSet);
            } else {
                setError(data.message || `Failed to fetch cart items (Status: ${response.status})`);
            }
        } catch (err) {
            console.error("Error fetching cart items:", err);
            setError('Network error or no connection to server. Please check your device\'s internet connection or the server status.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
             const originalCartItems = cartItems
        setCartItems(cartItems.filter(item => item._id !== itemId));
        
        try {
            const response = await fetch(`${CART_API_BASE_URL}${itemId}`, { // DELETE endpoint with item ID
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log("API Response Data (handleRemoveItem):", data);

            if (response.ok) {
                Alert.alert('Success', data.message || 'Item removed from cart.');

            } else {
                setCartItems(originalCartItems);
                Alert.alert('Error', data.message || 'Failed to remove item from cart.');
                console.error(`Failed to delete item ${itemId}:`, data.message);
            }
        } catch (err) {
            setCartItems(originalCartItems);
            Alert.alert('Error', 'Network error or unable to connect to server. Please try again.');
            console.error("Error removing cart item:", err);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            Alert.alert(
                "Remove Item?",
                "Do you want to remove this item from your cart?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Remove",
                        onPress: () => handleRemoveItem(itemId)
                    }
                ]
            );
            return;
        }

        const originalCartItems = cartItems;
        setCartItems(cartItems.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        ));

        try {
            const response = await fetch(`${CART_API_BASE_URL}update/${itemId}`, { // Assuming an update endpoint like /api/addtocart/update/:id
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            const data = await response.json();
            console.log("API Response Data (handleUpdateQuantity):", data);

            if (!response.ok) {
                setCartItems(originalCartItems); 
                Alert.alert('Error', data.message || 'Failed to update quantity.');
            }
        } catch (err) {
            setCartItems(originalCartItems); 
            Alert.alert('Error', 'Network error or unable to connect to server. Could not update quantity.');
            console.error("Error updating quantity:", err);
        }
    };


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCartItems();
            fetchTrendingProducts(); // Fetch trending products when screen focuses
        });

        // Initial fetch when component mounts
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
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.headerIconLeft}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Image source={require('../assets/images/arrowbtn.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    <Text style={styles.headerSubtitle}>{cartItems.length} Item(s) valued at ₹{totalAmount}</Text>
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

            {/* Delivery Location */}
            <View style={styles.deliveryContainer}>
                <Image source={require('../assets/images/location.png')} style={styles.locationIcon } />
                <Text style={styles.deliveryText}>Deliver to - Delhi NCR , 110015</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddressBook')}>
                    <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
            </View>

            {/* Cart Items List */}
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
                            />
                        )}
                        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                        scrollEnabled={false}
                    />
                )}


                {/* Recommended Products */}
                <Text style={styles.recommendedTitle}>Recommended Products</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                    {/* <Text style={styles.viewAllButtonText}>View All</Text> */}
                </TouchableOpacity>

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
                        renderItem={({ item }) => <RecommendedItem item={item} />}
                        contentContainerStyle={styles.recommendedList}
                    />
                )}
            </ScrollView>

            {/* Footer Total and Proceed */}
            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.totalAmount}>₹{totalAmount}</Text>
                        <Text style={styles.totalSaved}>You saved ₹{totalSaved}</Text>
                    </View>
                    <TouchableOpacity style={styles.proceedButton} onPress={() => navigation.navigate('')}>
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#406FF3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-between',

    },
    headerIconLeft: {
        marginRight: 13,
    },
    headerIconRight: {
        marginLeft: 15,
    },
    headerIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
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
        padding: 15,
        justifyContent: 'space-between',
    },
    locationIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 5,
    },
    deliveryText: {
        fontSize: 14,
        color: '#000',
        flex: 1,
    },
    changeButtonText: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingBottom: 120, // Space for the footer
    },
    cartItemContainer: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 15,
        alignItems: 'center',
    },
    cartItemImage: {
        width: 160,
        height: 120,
        resizeMode: 'contain',
        marginRight: 15,
    },
    cartItemDetails: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartItemBrand: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    cartItemRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    smallIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 2,
    },
    cartItemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cartItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 5,
    },
    cartItemOriginalPrice: {
        fontSize: 12,
        color: '#888',
        textDecorationLine: 'line-through',
        marginRight: 5,
    },
    cartItemDiscount: {
        fontSize: 12,
        color: 'red',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
        width: 80,
        justifyContent: 'space-between',
    },
    quantityButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    removeButton: {
        marginLeft: 15,
        padding: 5,
    },
    deleteIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#888',
    },
    recommendedTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 15,
        marginTop: 20,
    },
    viewAllButton: {
        position: 'absolute',
        right: 15,
        top: 20,
    },
    viewAllButtonText: {
        fontSize: 12,
        color: '#000',
        fontWeight: 'bold',
    },
    recommendedList: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    recommendedItemContainer: {
        width: recommendedItemWidth,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    recommendedItemImage: {
        width: recommendedItemWidth * 0.8,
        height: recommendedItemWidth * 0.8,
        marginBottom: 10,
    },
    recommendedItemName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    recommendedItemBrand: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 5,
    },
    recommendedItemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    recommendedItemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 5,
    },
    recommendedItemOriginalPrice: {
        fontSize: 12,
        color: '#888',
        textDecorationLine: 'line-through',
        marginRight: 5,
    },
    recommendedItemDiscount: {
        fontSize: 12,
        color: 'red',
        fontWeight: 'bold',
    },
    recommendedItemRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recommendedItemRatingText: {
        fontSize: 10,
        marginLeft: 2,
        color: '#666',
    },
    recommendedItemReviewText: {
        fontSize: 10,
        color: '#666',
        marginLeft: 5,
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
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 15,
        height: 80,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    totalSaved: {
        fontSize: 12,
        color: 'green',
        fontWeight: 'bold',
        marginTop: 2,
    },
    proceedButton: {
        backgroundColor: '#406FF3',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#fff', // Explicitly set background to ensure visibility
        minHeight: 200, // Ensure it has some height even if content is small
    },
    emptyCartImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
        tintColor: '#ccc', // Make cart light grey
    },
    emptyCartText: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
        textAlign: 'center',
    },
    emptyCartButton: {
        backgroundColor: '#406FF3',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
    },
    emptyCartButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemSeparator: {
        height: 10, // Adds space between cart items
        backgroundColor: 'transparent',
    },
    trendingLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    trendingLoadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyTrendingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTrendingText: {
        fontSize: 16,
        color: '#666',
    },
    retryTrendingButton: {
        backgroundColor: '#406FF3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    retryTrendingButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    trendingErrorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default MyCart;