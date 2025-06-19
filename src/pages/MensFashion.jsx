import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const SPACING = 10;

const categories = [
    { title: "Men's fashion", image: require('../assets/images/beauty.png') },
    { title: "Women's Fashion", image: require('../assets/images/cloths.png') },
    { title: 'Shoes', image: require('../assets/images/beauty.png') },
    { title: 'Kids & Baby', image: require('../assets/images/beauty.png') },
    { title: 'Watches', image: require('../assets/images/beauty.png') },
];

const deals = [
    { title: 'T-Shirts', price: '₹799', image: require('../assets/images/beauty.png') },
    { title: 'Formalwear', price: '₹799', image: require('../assets/images/beauty.png') },
    { title: 'Watches', price: '₹799', image: require('../assets/images/beauty.png') },
];
const tabs = ['Fashion', 'Electronics', 'Beauty', 'Personal Care'];

const trendingProducts = [
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/cloths.png'),
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/beauty.png'),
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/beauty.png'),
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/beauty.png'),
    },
];

const allProducts = [
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/cloths.png'),
        available: true,
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/beauty.png'),
        available: true,
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/cloths.png'),
        available: true,
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/beauty.png'),
        available: true,
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/beauty.png'),
        available: true,
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/cloths.png'),
        available: true,
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/cloths.png'),
        available: true,
    },
    {
        title: 'Marshall Major',
        description: 'w/RGB LEDs, Lig..',
        price: '₹500',
        rating: 6.6,
        reviews: 66,
        image: require('../assets/images/beauty.png'),
        available: true,
    },
];

function ClothingShoesJewelry() {

    const navigation = useNavigation();
    const [activeCategory, setActiveCategory] = useState("Men's fashion");
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [activeTab, setActiveTab] = useState('Fashion');

    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const handleCartPress = () => {
        navigation.navigate('Cart');
    };

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
        setShowScrollIndicator(true);
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                {/* Back Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backArrow}>{'←'}</Text>
                    </TouchableOpacity>

                </View>



                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={showScrollIndicator}
                    style={styles.categoryScroll}
                    onScrollBeginDrag={() => setShowScrollIndicator(true)}
                    onScrollEndDrag={() => setShowScrollIndicator(false)}
                    scrollEventThrottle={16}
                >
                    {categories.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.categoryItem,
                                activeCategory === item.title && styles.activeCategoryItem
                            ]}
                            onPress={() => handleCategoryPress(item.title)}
                        >
                            <Image source={item.image} style={styles.categoryImage} />
                            <Text style={[
                                styles.categoryLabel,
                                activeCategory === item.title && styles.activeCategoryLabel
                            ]}>{item.title}</Text>
                            {activeCategory === item.title && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Banner */}
                <View style={styles.bannerContainer}>
                    <Image source={require('../assets/images/Placeholder_01.png')} style={styles.bannerImage} />
                    <View style={styles.liveTag}>
                        <TouchableOpacity><Text style={styles.liveText}>Live</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Top Deals */}

                <Text style={styles.sectionTitle}>Top Deals</Text>
                <View style={styles.dealsRow}>
                    {deals.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.dealCard}>
                            <Image source={item.image} style={styles.dealImage} />
                            <Text style={styles.dealTitle}>{item.title}</Text>
                            <Text style={styles.dealPrice}>{item.price}</Text>
                        </TouchableOpacity>
                    ))}
                </View>


                {/* Trending Products */}


                <Text style={styles.sectionTitle}>Trending Products</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={trendingProducts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.trendingProductCard}>
                            <View style={styles.trendingProductImageContainer}>
                                <Image source={item.image} style={styles.trendingProductImage} />
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity>
                                        <Image source={require('../assets/images/cloths.png')} style={styles.icon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={require('../assets/images/cloths.png')} style={styles.icon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.trendingProductTitle}>{item.title}</Text>
                            <Text style={styles.trendingProductDescription}>{item.description}</Text>
                            <Text style={styles.trendingProductPrice}>{item.price}</Text>
                            <View style={styles.ratingRow}>
                                <Image source={require('../assets/images/beauty.png')} style={styles.starIcon} />
                                <Text style={styles.trendingProductRating}>{item.rating}</Text>
                                <Text style={styles.trendingProductReviews}>{item.reviews} Reviews</Text>
                            </View>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.buyNowButton}>
                                    <Text style={styles.buyNowButtonText}>Buy now</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addToCartButton}>
                                    <Image source={require('../assets/images/beauty.png')} style={styles.addToCartIcon} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                {/* All Products Section */}
                <Text style={styles.sectionTitle}>All Products</Text>

                {/* Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Product Grid */}
                <FlatList
                    data={allProducts}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.allProductCard, !item.available && styles.unavailableProductCard]}
                            onPress={() => {
                                if (activeTab === 'Fashion') {
                                    navigation.navigate('ViewProducts');
                                }
                            }}
                        >
                            <View style={styles.allProductImageContainer}>
                                <Image source={item.image} style={[styles.allProductImage, !item.available && styles.unavailableProductImage]} />
                                <View style={styles.allProductIconContainer}>
                                    <TouchableOpacity style={styles.iconBackground}>
                                        <Image source={require('../assets/images/heartlogo.png')} style={[styles.icon, styles.heartIcon]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconBackground}>
                                        <Image source={require('../assets/images/sharelogo.png')} style={[styles.icon, styles.shareIcon]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={[styles.allProductTitle, !item.available && styles.unavailableText]}>{item.title}</Text>
                            <Text style={[styles.allProductDescription, !item.available && styles.unavailableText]}>{item.description}</Text>
                            {item.available ? (
                                <>
                                    <Text style={styles.allProductPrice}>{item.price}</Text>
                                    <View style={styles.ratingRow}>
                                        <Image source={require('../assets/images/starlogo.png')} style={styles.starIcon} />
                                        <Text style={styles.allProductRating}>{item.rating}</Text>
                                        <Text style={styles.allProductReviews}>{item.reviews} Reviews</Text>
                                    </View>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.buyNowButton}>
                                            <Text style={styles.buyNowButtonText}>Buy now</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.addToCartButton}>
                                            <Image source={require('../assets/images/cartlogo.png')} style={styles.addToCartIcon} />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.unavailableOverlay}>
                                    <Text style={styles.unavailableTextOverlay}>Not Available at your{"\n"}Current Pincode</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30,

    },
    container: {
        padding: 14,
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    backArrow: {
        fontSize: 18,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#004CFF',
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 14,
    },
    micIcon: {
        width: 20,
        height: 30,
        pading: 5,
        tintColor: '#004CFF',
    },
    categoryScroll: {
        marginBottom: 30,
        marginTop: 5,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 18,
        position: 'relative',
    },
    activeCategoryItem: {
        backgroundColor: '#f0f8ff',
        padding: 8,
        borderRadius: 12,
    },
    categoryImage: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    categoryLabel: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 6,
        width: 70,
        color: '#666',
    },
    activeCategoryLabel: {
        color: '#007bff',
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 3,
        backgroundColor: '#406FF3',
    },
    bannerContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
    },
    liveTag: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'green',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    liveText: {
        color: '#fff',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    dealsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },

    trendsrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    dealCard: {
        width: '30%',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },

    dealImage: {
        width: 60,
        height: 60,
        marginBottom: 8,
    },
    dealTitle: {
        fontSize: 14,
        marginBottom: 4,
    },
    dealPrice: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    cartBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#007bff',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 10,
    },
    cartTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cartSubtitle: {
        color: '#fff',
        fontSize: 12,
    },
    cartArrow: {
        fontSize: 22,
        color: '#fff',
    },
    trendingProductCard: {
        width: width * 0.4,
        marginRight: SPACING,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    trendingProductImageContainer: {
        position: 'relative',
        width: '100%',
    },
    trendingProductImage: {
        width: '100%',
        height: 140,
        borderRadius: 4,
        marginBottom: 8,
    },
    iconContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        flexDirection: 'column',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        marginBottom: 5,
        tintColor: '#000',
    },
    trendingProductTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    trendingProductDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    trendingProductPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    starIcon: {
        width: 12,
        height: 12,
        marginRight: 4,
        tintColor: '#ffc107',
    },
    trendingProductRating: {
        fontSize: 12,
        color: '#000',
        marginRight: 4,
    },
    trendingProductReviews: {
        fontSize: 12,
        color: '#666',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buyNowButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    buyNowButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    addToCartButton: {
        padding: 8,
        borderRadius: 4,
    },
    addToCartIcon: {
        width: 20,
        height: 20,
        tintColor: '#000000',
    },
    tabsContainer: {
        marginBottom: 20,
    },
    tabItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
    },
    activeTabItem: {
        backgroundColor: '#406FF3',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
        marginBottom: SPACING,
    },
    allProductCard: {
        width: (width - SPACING * 3) / 2,
        borderRadius: 8,
        padding: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 2,
        // elevation: 2,
    },
    unavailableProductCard: {
        backgroundColor: '#f9f9f9',
    },
    allProductImageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
    },
    allProductImage: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    },
    unavailableProductImage: {
        opacity: 0.5,
    },
    allProductIconContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconBackground: {
        padding: 4,
        marginBottom: 2,
    },
    heartIcon: {
        tintColor: '#406FF3',
    },
    shareIcon: {
        tintColor: '#406FF3',
    },
    allProductTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    allProductDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    allProductPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    allProductRating: {
        fontSize: 12,
        color: '#000',
        marginRight: 4,
    },
    allProductReviews: {
        fontSize: 12,
        color: '#666',
    },
    unavailableOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 8,
    },
    unavailableTextOverlay: {
        textAlign: 'center',
        color: '#666',
        fontSize: 12,
    },
    unavailableText: {
        color: '#999',
    }
});

export default ClothingShoesJewelry;
