import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
  PixelRatio,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Responsive Metrics Utility
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

const ViewProducts = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  const USER_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTJhZTY5N2RhZDEyZmM2N2Q5ZDVmYyIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUwMjQ5MDc3LCJleHAiOjE3NTA4NTM4Nzd9.SBpXqkVhAyLYnb2F8sSsjudsA7Q_mPdTdgUSf5jcZ94';

  useEffect(() => {
    setLoading(true);

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/user_fetch/${productId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${USER_AUTH_TOKEN}`
          },
        });
        const data = await response.json();

        if (response.ok && data.product) {
          setProductData(data.product);
          if (data.product.variants && data.product.variants.length > 0) {
 
            const allSizes = Array.from(new Set(data.product.variants.flatMap(v => v.sizes || []))).filter(s => s);
            setSelectedSize(allSizes.length > 0 ? allSizes[0] : null);

            const allColors = Array.from(new Set(data.product.variants.flatMap(v => v.colors || []))).filter(c => c);
            setSelectedColor(allColors.length > 0 ? allColors[0] : null);

            if (data.product.variants[0]?.images?.length > 0) {
              setMainImage(data.product.variants[0].images[0]);
            }
          }
          await checkWishlistStatus(productId);
        } else {
          setMessage(data.message || "Failed to load product details.");
          setProductData(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setMessage("Failed to connect to server. Please try again.");
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); 

  const checkWishlistStatus = async (pId) => {
    if (!USER_AUTH_TOKEN) {
      console.warn("Authentication token not available for wishlist status check.");
      return;
    }
    try {
        const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/wishlist/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${USER_AUTH_TOKEN}`,
            },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data.wishlist)) {
            const isInWishlist = data.wishlist.some(item => item.product._id === pId);
            setIsWishlisted(isInWishlist);
        } else {
            console.warn("Failed to fetch wishlist status or unexpected data:", data);
        }
    } catch (error) {
        console.error("Error checking wishlist status:", error);
    }
  };

  const selectedVariant = useMemo(() => {
    if (!productData || !productData.variants) return null;

    let variant = productData.variants.find(v =>
      (selectedSize === null || (v.sizes && v.sizes.includes(selectedSize))) &&
      (selectedColor === null || (v.colors && v.colors.includes(selectedColor)))
    );

    if (!variant && selectedSize !== null) {
      variant = productData.variants.find(v => v.sizes && v.sizes.includes(selectedSize));
    }

    if (!variant && selectedColor !== null) {
      variant = productData.variants.find(v => v.colors && v.colors.includes(selectedColor));
    }

    if (!variant && productData.variants.length > 0) {
      variant = productData.variants[0];
    }
    return variant;
  }, [selectedSize, selectedColor, productData]);

  useEffect(() => {
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      setMainImage(selectedVariant.images[0]);
    } else {
      setMainImage(null);
    }
  }, [selectedVariant]);
  

  const allAvailableSizes = useMemo(() => {
    if (!productData || !productData.variants) return [];
    return Array.from(new Set(productData.variants.flatMap(v => v.sizes || []))).filter(s => s);
  }, [productData]);

  const allAvailableColors = useMemo(() => {
    if (!productData || !productData.variants) return [];
    return Array.from(new Set(productData.variants.flatMap(v => v.colors || []))).filter(c => c);
  }, [productData]);

  const getAvailableSizesForColor = (color) => {
    if (!productData || !productData.variants) return [];
    const sizes = new Set();
    productData.variants.forEach(v => {
      if (v.colors && v.colors.includes(color) && v.sizes) {
        v.sizes.forEach(s => sizes.add(s));
      }
    });
    return Array.from(sizes).filter(s => s);
  };

  const getAvailableColorsForSize = (size) => {
    if (!productData || !productData.variants) return [];
    const colors = new Set();
    productData.variants.forEach(v => {
      if (v.sizes && v.sizes.includes(size) && v.colors) {
        v.colors.forEach(c => colors.add(c));
      }
    });
    return Array.from(colors).filter(c => c);
  };

  const sizesToRender = selectedColor ? getAvailableSizesForColor(selectedColor) : allAvailableSizes;
  const colorsToRender = selectedSize ? getAvailableColorsForSize(selectedSize) : allAvailableColors;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (selectedColor && !getAvailableColorsForSize(size).includes(selectedColor)) {
      const availableColors = getAvailableColorsForSize(size);
      setSelectedColor(availableColors.length > 0 ? availableColors[0] : null);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (selectedSize && !getAvailableSizesForColor(color).includes(selectedSize)) {
      const availableSizes = getAvailableSizesForColor(color);
      setSelectedSize(availableSizes.length > 0 ? availableSizes[0] : null);
    }
  };

  const handleAddToCart = async () => {
    if (!productData || !selectedVariant) {
      setMessage("Please select a valid product variant.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${USER_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          product: productData._id,
          variantId: selectedVariant._id,
          quantity: 1, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Item added to cart!");
        navigation.navigate('MyCart', { cartItemAdded: true });
      } else {
        setMessage(`Failed to add item: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage("Error adding item to cart. Please try again.");
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleWishlistToggle = async () => {
    if (!USER_AUTH_TOKEN || !productData?._id) {
      setMessage("Please log in or product data is missing.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const endpoint = `https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/add_to_wishlist/${productData._id}`;
      const method = 'PUT'; 

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${USER_AUTH_TOKEN}`,
       
        },
      });

      const data = await response.json();

      if (response.ok) {
       
        const newStatus = data.message.includes('added') || data.message.includes('success') ? true : false;
        setIsWishlisted(newStatus); 
        setMessage(data.message || `Product ${newStatus ? 'added to' : 'updated in'} wishlist!`);
        navigation.navigate('WishlistScreen', { wishlistUpdated: true }); 
      } else {
        setMessage(`Failed to update wishlist: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setMessage("Error updating wishlist. Please try again.");
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#406FF3" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (!productData || !productData.variants?.length || !selectedVariant) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Product not found or failed to load.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentPrice = selectedVariant?.price;
  const currentOriginalPrice = selectedVariant?.originalPrice;
  const currentImages = selectedVariant?.images || [];
  const discountPercentage = currentOriginalPrice && currentPrice && currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : null;


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image
            source={{ uri: mainImage || 'https://placehold.co/400x400/E0E0E0/333333?text=No+Image' }}
            style={styles.mainProductImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
          </TouchableOpacity>

          
          
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistToggle}
          >
            <Image
              source={require('../assets/images/heart1.png')}
              style={[
                styles.wishlistIcon,
        
                { tintColor: isWishlisted ? '#406FF3' : '#fff' }
              ]}
            />
          </TouchableOpacity>

          {currentImages.length > 0 && (
            <FlatList
              data={currentImages}
              keyExtractor={(item, index) => item + index}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContainer}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setMainImage(item)}>
                  <Image source={{ uri: item || 'https://placehold.co/60x60/E0E0E0/333333?text=No+Image' }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.unitsText}>
            {productData.unitsSold || '7000'}+ Units Sold
          </Text>
          <Text style={styles.title}>{productData.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹ {currentPrice}</Text>
            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
              <>
                <Text style={styles.oldPrice}>₹ {currentOriginalPrice}</Text>
                {discountPercentage !== null && (
                  <Text style={styles.discount}>{discountPercentage}% Off</Text>
                )}
              </>
            )}
          </View>

          {sizesToRender.length > 0 && (
            <>
              <Text style={styles.selectSizeLabel}>Select Size: {selectedSize || 'N/A'}</Text>
              <View style={styles.sizeRow}>
                {sizesToRender.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      selectedSize === size && styles.sizeSelected,
                      (selectedColor && !getAvailableColorsForSize(selectedColor).includes(size)) ? styles.disabledOption : null
                    ]}
                    onPress={() => handleSizeSelect(size)}
                    disabled={selectedColor && !getAvailableColorsForSize(selectedColor).includes(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextSelected,
                        (selectedColor && !getAvailableColorsForSize(selectedColor).includes(size)) ? styles.disabledText : null
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {colorsToRender.length > 0 && (
            <View style={styles.colorsSection}>
              <Text style={styles.colorsLabel}>Colors:</Text>
              <View style={styles.colorPalette}>
                {colorsToRender.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorSelectedRing,
                      (selectedSize && !getAvailableColorsForSize(selectedSize).includes(color)) ? styles.disabledOption : null
                    ]}
                    onPress={() => handleColorSelect(color)}
                    disabled={selectedSize && !getAvailableColorsForSize(selectedSize).includes(color)}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.cartText}>🛒 Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyText}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          {message && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.couponOfferBox}>
          <Text style={styles.couponIcon}>%</Text>
          <View style={styles.couponTextContainer}>
            <Text style={styles.couponTitle}>Coupons & Offers</Text>
            <Text style={styles.couponSubtitle}>Apply now and Save Extra !</Text>
          </View>
          <Text style={styles.couponArrow}>&gt;</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  center: {
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
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(18),
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  retryButton: {
    backgroundColor: '#406FF3',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(5),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  imageSection: {
    position: 'relative',
    backgroundColor: '#fff',
    paddingBottom: verticalScale(10),
  },
  mainProductImage: {
    width: '100%',
    height: verticalScale(400),
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(40),
    left: scale(20),
    zIndex: 1, // Ensure button is clickable
  },
  backText: { // Not used with MaterialIcons, but kept for completeness
    fontSize: responsiveFontSize(20),
    color: '#fff',
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: verticalScale(40),
    right: scale(20),
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: moderateScale(15),
    width: moderateScale(30),
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure button is clickable
  },
  wishlistIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  thumbnailContainer: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(10),
  },
  thumbnailImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(8),
    marginRight: scale(10),
    borderWidth: moderateScale(1),
    borderColor: '#eee',
    resizeMode: 'cover',
  },
  infoSection: {
    padding: moderateScale(15),
    backgroundColor: '#fff',
    marginTop: verticalScale(10),
    borderRadius: moderateScale(8),
    marginHorizontal: scale(10),
  },
  unitsText: {
    color: '#004CFF',
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    marginBottom: verticalScale(5),
  },
  title: {
    fontSize: responsiveFontSize(22),
    fontWeight: 'bold',
    marginVertical: verticalScale(5),
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  price: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    marginRight: scale(10),
    color: '#333',
  },
  oldPrice: {
    fontSize: responsiveFontSize(14),
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: scale(10),
  },
  discount: {
    fontSize: responsiveFontSize(14),
    color: 'green',
    fontWeight: 'bold',
  },
  selectSizeLabel: {
    fontSize: responsiveFontSize(16),
    color: '#333',
    marginBottom: verticalScale(10),
    fontWeight: '500',
  },
  sizeRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
    flexWrap: 'wrap',
  },
  sizeButton: {
    borderWidth: moderateScale(1),
    borderColor: '#ccc',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(15),
    borderRadius: moderateScale(5),
    marginRight: scale(10),
    marginBottom: verticalScale(10),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: moderateScale(50),
  },
  sizeSelected: {
    backgroundColor: '#406FF3',
    borderColor: '#406FF3',
  },
  sizeText: {
    fontSize: responsiveFontSize(16),
    color: '#333',
    fontWeight: '500',
  },
  sizeTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledOption: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  disabledText: {
    color: '#999',
  },
  colorsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  colorsLabel: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    color: '#333',
    marginRight: scale(10),
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    borderColor: '#ddd',
    marginRight: scale(10),
    marginBottom: verticalScale(10),
  },
  colorSelectedRing: {
    borderWidth: moderateScale(2),
    borderColor: '#406FF3',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
  },
  cartButton: {
    flex: 1,
    borderWidth: moderateScale(1),
    borderColor: '#406FF3',
    padding: moderateScale(12),
    alignItems: 'center',
    borderRadius: moderateScale(5),
    marginRight: scale(10),
    backgroundColor: '#fff',
  },
  cartText: {
    color: '#406FF3',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#406FF3',
    padding: moderateScale(12),
    alignItems: 'center',
    borderRadius: moderateScale(5),
  },
  buyText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: '#e6ffe6',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginHorizontal: scale(10),
  },
  messageText: {
    color: '#006400',
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
  },
  couponOfferBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: moderateScale(8),
    padding: moderateScale(15),
    marginHorizontal: scale(10),
    marginVertical: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(2),
  },
  couponIcon: {
    fontSize: responsiveFontSize(28),
    fontWeight: 'bold',
    color: '#406FF3',
    marginRight: scale(15),
  },
  couponTextContainer: {
    flex: 1,
  },
  couponTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(2),
  },
  couponSubtitle: {
    fontSize: responsiveFontSize(13),
    color: '#666',
  },
  couponArrow: {
    fontSize: responsiveFontSize(20),
    color: '#666',
    marginLeft: scale(15),
  },
});

export default ViewProducts;