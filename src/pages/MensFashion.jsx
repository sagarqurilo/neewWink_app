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
    PixelRatio,
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

const SPACING = moderateScale(10);

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

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
        setShowScrollIndicator(true);
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Text style={styles.backArrow}>{'←'}</Text>
                    </TouchableOpacity>
                </View>

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

                <View style={styles.bannerContainer}>
                    <Image source={require('../assets/images/Placeholder_01.png')} style={styles.bannerImage} />
                    <View style={styles.liveTag}>
                        <TouchableOpacity><Text style={styles.liveText}>Live</Text></TouchableOpacity>
                    </View>
                </View>

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

                <Text style={styles.sectionTitle}>All Products</Text>

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

export default ClothingShoesJewelry;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: verticalScale(30),
    },
    container: {
        padding: moderateScale(14),
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    backButton: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(3),
        elevation: moderateScale(4),
    },
    backArrow: {
        fontSize: responsiveFontSize(18),
    },
    title: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginLeft: scale(10),
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: moderateScale(12),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        marginBottom: verticalScale(16),
    },
    searchIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
        tintColor: '#004CFF',
    },
    searchInput: {
        flex: 1,
        marginHorizontal: scale(10),
        fontSize: responsiveFontSize(14),
    },
    micIcon: {
        width: moderateScale(20),
        height: moderateScale(30),
        padding: moderateScale(5),
        tintColor: '#004CFF',
    },
    categoryScroll: {
        marginBottom: verticalScale(30),
        marginTop: verticalScale(5),
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: scale(18),
        position: 'relative',
    },
    activeCategoryItem: {
        backgroundColor: '#f0f8ff',
        padding: moderateScale(8),
        borderRadius: moderateScale(12),
    },
    categoryImage: {
        width: moderateScale(55),
        height: moderateScale(55),
        borderRadius: moderateScale(27.5),
    },
    categoryLabel: {
        fontSize: responsiveFontSize(12),
        textAlign: 'center',
        marginTop: verticalScale(6),
        width: scale(70),
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
        height: verticalScale(3),
        backgroundColor: '#406FF3',
    },
    bannerContainer: {
        marginBottom: verticalScale(20),
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: verticalScale(180),
        borderRadius: moderateScale(12),
    },
    liveTag: {
        position: 'absolute',
        bottom: verticalScale(10),
        right: scale(10),
        backgroundColor: 'green',
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(2),
        borderRadius: moderateScale(4),
    },
    liveText: {
        color: '#fff',
        fontSize: responsiveFontSize(14),
    },
    sectionTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        marginBottom: verticalScale(12),
    },
    dealsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
    },
    dealsrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dealCard: {
        width: moderateScale(100),
        backgroundColor: '#f9f9f9',
        borderRadius: moderateScale(12),
        padding: moderateScale(10),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(2),
        elevation: moderateScale(3),
    },
    dealImage: {
        width: moderateScale(60),
        height: moderateScale(60),
        marginBottom: verticalScale(8),
    },
    dealTitle: {
        fontSize: responsiveFontSize(14),
        marginBottom: verticalScale(4),
    },
    dealPrice: {
        fontWeight: 'bold',
        fontSize: responsiveFontSize(14),
    },
    cartBox: {
        position: 'absolute',
        bottom: verticalScale(0),
        left: scale(0),
        right: scale(0),
        backgroundColor: '#007bff',
        padding: moderateScale(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: moderateScale(16),
        borderTopRightRadius: moderateScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(-2) },
        shadowOpacity: 0.15,
        shadowRadius: moderateScale(6),
        elevation: moderateScale(10),
    },
    cartTitle: {
        color: '#fff',
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
    },
    cartSubtitle: {
        color: '#fff',
        fontSize: responsiveFontSize(12),
    },
    cartArrow: {
        fontSize: responsiveFontSize(22),
        color: '#fff',
    },
    trendingProductCard: {
        width: SCREEN_WIDTH * 0.4 - scale(5),
        marginRight: SPACING,
        backgroundColor: '#fff',
        borderRadius: moderateScale(8),
        padding: moderateScale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(2),
        elevation: moderateScale(2),
    },
    trendingProductImageContainer: {
        position: 'relative',
        width: '100%',
    },
    trendingProductImage: {
        width: '100%',
        height: verticalScale(140),
        borderRadius: moderateScale(4),
        marginBottom: verticalScale(8),
    },
    iconContainer: {
        position: 'absolute',
        top: verticalScale(5),
        right: scale(5),
        flexDirection: 'column',
        alignItems: 'center',
    },
    icon: {
        width: moderateScale(24),
        height: moderateScale(24),
        marginBottom: verticalScale(5),
        tintColor: '#000',
    },
    trendingProductTitle: {
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        marginBottom: verticalScale(4),
    },
    trendingProductDescription: {
        fontSize: responsiveFontSize(12),
        color: '#666',
        marginBottom: verticalScale(4),
    },
    trendingProductPrice: {
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: verticalScale(8),
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    starIcon: {
        width: moderateScale(12),
        height: moderateScale(12),
        marginRight: scale(4),
        tintColor: '#ffc107',
    },
    trendingProductRating: {
        fontSize: responsiveFontSize(12),
        color: '#000',
        marginRight: scale(4),
    },
    trendingProductReviews: {
        fontSize: responsiveFontSize(12),
        color: '#666',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buyNowButton: {
        backgroundColor: '#007bff',
        paddingVertical: verticalScale(8),
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(4),
        flex: 1,
        marginRight: scale(8),
        alignItems: 'center',
    },
    buyNowButtonText: {
        color: '#fff',
        fontSize: responsiveFontSize(14),
    },
    addToCartButton: {
        padding: moderateScale(8),
        borderRadius: moderateScale(4),
    },
    addToCartIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
        tintColor: '#000000',
    },
    tabsContainer: {
        marginBottom: verticalScale(20),
    },
    tabItem: {
        paddingVertical: verticalScale(8),
        paddingHorizontal: moderateScale(16),
        borderRadius: moderateScale(20),
        marginRight: scale(10),
        backgroundColor: '#f0f0f0',
    },
    activeTabItem: {
        backgroundColor: '#406FF3',
    },
    tabText: {
        fontSize: responsiveFontSize(14),
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
        width: (SCREEN_WIDTH - SPACING * 3) / 2,
        borderRadius: moderateScale(8),
        padding: moderateScale(10),
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
        borderRadius: moderateScale(4),
    },
    unavailableProductImage: {
        opacity: 0.5,
    },
    allProductIconContainer: {
        position: 'absolute',
        top: verticalScale(5),
        right: scale(5),
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconBackground: {
        padding: moderateScale(4),
        marginBottom: verticalScale(2),
    },
    heartIcon: {
        tintColor: '#406FF3',
    },
    shareIcon: {
        tintColor: '#406FF3',
    },
    allProductTitle: {
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        marginTop: verticalScale(8),
        marginBottom: verticalScale(4),
    },
    allProductDescription: {
        fontSize: responsiveFontSize(12),
        color: '#666',
        marginBottom: verticalScale(4),
    },
    allProductPrice: {
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: verticalScale(8),
    },
    allProductRating: {
        fontSize: responsiveFontSize(12),
        color: '#000',
        marginRight: scale(4),
    },
    allProductReviews: {
        fontSize: responsiveFontSize(12),
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
        borderRadius: moderateScale(8),
        padding: moderateScale(5),
    },
    unavailableTextOverlay: {
        textAlign: 'center',
        color: '#666',
        fontSize: responsiveFontSize(12),
    },
    unavailableText: {
        color: '#999',
    },
});