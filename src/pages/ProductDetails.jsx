import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    fontScale,
} from '../component/ResponsiveMetrix';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { product } = route.params;
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [selectedImage, setSelectedImage] = useState(0);

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product);
    };

    const handleBuyNow = () => {
        // TODO: Implement buy now functionality
        console.log('Buy now:', product);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/images/arrowbtn.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Image source={require('../assets/images/search.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Image source={require('../assets/images/heartlogo.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Product Images */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: selectedVariant.images[selectedImage] }}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.thumbnailContainer}
                    >
                        {selectedVariant.images.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedImage(index)}
                                style={[
                                    styles.thumbnail,
                                    selectedImage === index && styles.selectedThumbnail,
                                ]}
                            >
                                <Image source={{ uri: image }} style={styles.thumbnailImage} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.brandName}>{product.brand}</Text>
                    <Text style={styles.price}>₹{selectedVariant.price}</Text>

                    {/* Variants */}
                    <View style={styles.variantsContainer}>
                        <Text style={styles.sectionTitle}>Available Variants</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {product.variants.map((variant, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.variantButton,
                                        selectedVariant === variant && styles.selectedVariant,
                                    ]}
                                    onPress={() => setSelectedVariant(variant)}
                                >
                                    <Text style={[
                                        styles.variantText,
                                        selectedVariant === variant && styles.selectedVariantText,
                                    ]}>
                                        {variant.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(15),
    },
    backIcon: {
        width: horizontalScale(24),
        height: horizontalScale(24),
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: horizontalScale(15),
    },
    icon: {
        width: horizontalScale(24),
        height: horizontalScale(24),
        resizeMode: 'contain',
    },
    imageContainer: {
        marginBottom: verticalScale(20),
    },
    mainImage: {
        width: width,
        height: verticalScale(400),
        backgroundColor: '#f8f8f8',
    },
    thumbnailContainer: {
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(20),
        marginTop: verticalScale(10),
    },
    thumbnail: {
        width: horizontalScale(60),
        height: verticalScale(60),
        marginRight: horizontalScale(10),
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    selectedThumbnail: {
        borderColor: '#3575F6',
        borderWidth: 2,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    infoContainer: {
        paddingHorizontal: horizontalScale(20),
    },
    productName: {
        fontSize: fontScale(20),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: verticalScale(5),
    },
    brandName: {
        fontSize: fontScale(16),
        color: '#666',
        marginBottom: verticalScale(10),
    },
    price: {
        fontSize: fontScale(24),
        fontWeight: 'bold',
        color: '#3575F6',
        marginBottom: verticalScale(20),
    },
    variantsContainer: {
        marginBottom: verticalScale(20),
    },
    sectionTitle: {
        fontSize: fontScale(16),
        fontWeight: '600',
        color: '#333',
        marginBottom: verticalScale(10),
    },
    variantButton: {
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(10),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: horizontalScale(10),
    },
    selectedVariant: {
        backgroundColor: '#3575F6',
        borderColor: '#3575F6',
    },
    variantText: {
        fontSize: fontScale(14),
        color: '#333',
    },
    selectedVariantText: {
        color: '#fff',
    },
    descriptionContainer: {
        marginBottom: verticalScale(20),
    },
    description: {
        fontSize: fontScale(14),
        color: '#666',
        lineHeight: verticalScale(20),
    },
    bottomContainer: {
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(15),
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#3575F6',
        borderRadius: 8,
        paddingVertical: verticalScale(12),
        marginRight: horizontalScale(10),
        alignItems: 'center',
    },
    addToCartText: {
        color: '#3575F6',
        fontSize: fontScale(16),
        fontWeight: '600',
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: '#3575F6',
        borderRadius: 8,
        paddingVertical: verticalScale(12),
        alignItems: 'center',
    },
    buyNowText: {
        color: '#fff',
        fontSize: fontScale(16),
        fontWeight: '600',
    },
});

export default ProductDetails; 