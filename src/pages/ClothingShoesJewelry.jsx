import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
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

function ClothingShoesJewelry() {
  const navigation = useNavigation();
  const route = useRoute();

  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topDeals, setTopDeals] = useState([]);
  const [reimaginedArticleBanner, setReimaginedArticleBanner] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingSubCategoryProducts, setLoadingSubCategoryProducts] = useState(false);
  const [error, setError] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState('');

  useEffect(() => {
    const categoryType = route.params?.categoryType;
    setCategoryTitle(formatCategoryTitle(categoryType));
    setProducts([]);
    setSelectedSubCategory(null);

    const loadAllInitialData = async () => {
      setLoadingInitialData(true);
      setError(null);

      try {
        await Promise.all([
          fetchCategoriesData(categoryType),
          fetchTrendingProductsData(),
          fetchTopDealsData(),
          fetchReimaginedArticleBannerData(),
        ]);
      } catch (err) {
        setError(err.message || "Failed to load initial data.");
      } finally {
        setLoadingInitialData(false);
      }
    };

    loadAllInitialData();
  }, [route.params?.categoryType]);

  const formatCategoryTitle = (type) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const fetchCategoriesData = async (categoryType) => {
    try {
      const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/category');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const normalizedType = categoryType?.toLowerCase().replace(/\s+/g, '');
      const matchedCategory = data.find(cat =>
        cat.name?.toLowerCase().replace(/\s+/g, '') === normalizedType
      );
      if (matchedCategory?.subCategories && Array.isArray(matchedCategory.subCategories)) {
        setSubCategories(matchedCategory.subCategories);
      } else {
        setSubCategories([]);
      }
    } catch (err) {
      throw new Error(err.message || "Failed to load sub-categories.");
    }
  };

  const fetchTrendingProductsData = async () => {
    try {
      const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/trending`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setTrendingProducts(data.products || []);
    } catch (error) {
      throw new Error(error.message || "Failed to load trending products.");
    }
  };

  const fetchTopDealsData = async () => {
    try {
      const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/top_deals`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setTopDeals(data.products || []);
    } catch (error) {
      throw new Error(error.message || "Failed to load top deals.");
    }
  };

  const fetchReimaginedArticleBannerData = async () => {
    setReimaginedArticleBanner({
      _id: 'reimagined-banner',
      image: require('../assets/images/artical.png'), // Updated to use local image asset
      live: true,
    });
  };

  const fetchProductsBySubCategory = async (subCategoryId) => {
    try {
      setLoadingSubCategoryProducts(true);
      setError(null);
      const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/product_by_category/${subCategoryId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data.products || []);
      setSelectedSubCategory(subCategoryId);
    } catch (error) {
      setError(error.message || "Failed to load products for this sub-category.");
      setProducts([]);
    } finally {
      setLoadingSubCategoryProducts(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.title}>{categoryTitle}</Text>
        </View>

        <View style={styles.searchBox}>
          <TouchableOpacity><Image source={require('../assets/images/search.png')} style={styles.searchIcon} /></TouchableOpacity>
          <TextInput placeholder={`Search by Products...`} style={styles.searchInput} placeholderTextColor="#aaa" />
          <TouchableOpacity><Image source={require('../assets/images/micro.png')} style={styles.micIcon} /></TouchableOpacity>
        </View>

        {loadingInitialData ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <>
            {subCategories.length === 0 ? (
              <Text style={styles.emptyText}>No {categoryTitle?.toLowerCase()} sub-categories found</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {subCategories.map((item, index) => (
                  <TouchableOpacity
                    key={item._id || index}
                    style={[
                      styles.categoryItem,
                      selectedSubCategory === item._id && styles.selectedCategoryItem
                    ]}
                    onPress={() => fetchProductsBySubCategory(item._id)}
                  >
                    <Image source={{ uri: item.image || 'https://placehold.co/80x80/E0E0E0/FFFFFF?text=No+Img' }} style={styles.categoryImage} />
                    <Text style={styles.categoryLabel}>{item.name}</Text>
                    {selectedSubCategory === item._id && <View style={styles.activeIndicator} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {reimaginedArticleBanner && (
              <View style={styles.reimaginedSectionContainer}>
                {/* <Text style={styles.sectionTitle}>ARTICALE REIMAGINED</Text> */}
                <TouchableOpacity style={styles.reimaginedBannerContainer}>
                  <Image
                    source={reimaginedArticleBanner.image} // Using local image
                    style={styles.reimaginedBannerImage}
                  />
                  {reimaginedArticleBanner.live && (
                    <View style={styles.liveTagContainer}>
                      <Text style={styles.liveTagText}>Live</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {!loadingInitialData && !error && !reimaginedArticleBanner && (
                <Text style={styles.emptyText}>No articles reimagined found.</Text>
            )}

            {loadingSubCategoryProducts ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
            ) : selectedSubCategory && products.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Products</Text>
                <FlatList
                  data={products}
                  keyExtractor={(item) => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productListContainer}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.productCard}
                      onPress={() => navigation.navigate('ViewProducts', { productId: item._id, productDetails: item })}
                    >
                      <Image
                        source={{ uri: item.variants?.[0]?.images?.[0] || 'https://placehold.co/140x140/E0E0E0/FFFFFF?text=No+Img' }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.productBrand} numberOfLines={1}>{item.brand}</Text>
                      <Text style={styles.productPrice}>₹{item.variants?.[0]?.price || 'N/A'}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            ) : selectedSubCategory && products.length === 0 && (
                <Text style={styles.emptyText}>No products found for this sub-category.</Text>
            )}

            {topDeals.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Top Deals</Text>
                <FlatList
                  data={topDeals}
                  keyExtractor={(item) => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productListContainer}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.productCard}
                      onPress={() => navigation.navigate('ViewProducts', { productId: item._id, productDetails: item })}
                    >
                      <Image
                        source={{ uri: item.variants?.[0]?.images?.[0] || 'https://placehold.co/140x140/E0E0E0/FFFFFF?text=No+Img' }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.productBrand} numberOfLines={1}>{item.brand}</Text>
                      <Text style={styles.productPrice}>₹{item.variants?.[0]?.price || 'N/A'}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            {!loadingInitialData && !error && topDeals.length === 0 && (
                <Text style={styles.emptyText}>No top deals found.</Text>
            )}

            {trendingProducts.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Trending Products</Text>
                <FlatList
                  data={trendingProducts}
                  keyExtractor={(item) => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productListContainer}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.productCard}
                      onPress={() => navigation.navigate('ViewProducts', { productId: item._id, productDetails: item })}
                    >
                      <Image
                        source={{ uri: item.variants?.[0]?.images?.[0] || 'https://placehold.co/140x140/E0E0E0/FFFFFF?text=No+Img' }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.productBrand} numberOfLines={1}>{item.brand}</Text>
                      <Text style={styles.productPrice}>₹{item.variants?.[0]?.price || 'N/A'}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            {!loadingInitialData && !error && trendingProducts.length === 0 && (
                <Text style={styles.emptyText}>No trending products found.</Text>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.viewCartButton}>
          <Text style={styles.viewCartButtonText}>View Cart</Text>
          <Text style={styles.viewCartCountText}>Item added to cart (1)</Text>
          <Icon name="chevron-right" size={responsiveFontSize(24)} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ClothingShoesJewelry;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: verticalScale(30),
  },
  scrollViewContent: {
    padding: moderateScale(14),
    paddingBottom: verticalScale(70),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  backButton: {
    padding: moderateScale(8),
  },
  backArrow: {
    fontSize: responsiveFontSize(24),
    color: '#000',
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    marginLeft: scale(10),
    color: '#000',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: verticalScale(15),
  },
  searchIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    color: '#000',
    height: verticalScale(40),
  },
  micIcon: {
    width: scale(20),
    height: scale(20),
    marginLeft: scale(10),
  },
  categoryScroll: {
    marginBottom: verticalScale(10),
  },
  categoryItem: {
    marginRight: moderateScale(15),
    alignItems: 'center',
    width: moderateScale(70),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(10),
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  selectedCategoryItem: {
    borderColor: '#3D74F1',
    borderWidth: moderateScale(2),
  },
  categoryImage: {
    width: moderateScale(45),
    height: moderateScale(45),
    borderRadius: moderateScale(22.5),
    marginBottom: verticalScale(5),
    backgroundColor: '#e0e0e0',
    resizeMode: 'cover',
  },
  categoryLabel: {
    fontSize: responsiveFontSize(12),
    color: '#333',
    textAlign: 'center',
    marginTop: verticalScale(2),
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: verticalScale(3),
    backgroundColor: '#3D74F1',
    borderBottomLeftRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontSize: responsiveFontSize(16),
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontSize: responsiveFontSize(16),
  },
  loadingIndicator: {
    marginTop: verticalScale(20),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(12),
    color: '#000',
  },
  productListContainer: {
    marginBottom: verticalScale(15),
  },
  productCard: {
    width: moderateScale(160),
    marginRight: moderateScale(15),
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(2),
  },
  productImage: {
    width: '100%',
    height: moderateScale(140),
    borderRadius: moderateScale(4),
    marginBottom: verticalScale(8),
    backgroundColor: '#e0e0e0',
  },
  productTitle: {
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
    color: '#333',
  },
  productBrand: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    marginBottom: verticalScale(4),
  },
  productPrice: {
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
    color: '#000',
  },
  reimaginedSectionContainer: {
    marginBottom: verticalScale(15),
  },
  reimaginedBannerContainer: {
    width: '100%',
    height: verticalScale(150),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(2),
  },
  reimaginedBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  liveTagContainer: {
    position: 'absolute',
    bottom: moderateScale(8),
    right: moderateScale(8),
    backgroundColor: 'red',
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(6),
    paddingVertical: verticalScale(2),
  },
  liveTagText: {
    color: '#fff',
    fontSize: responsiveFontSize(10),
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(10),
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3D74F1',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(20),
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  viewCartCountText: {
    color: '#fff',
    fontSize: responsiveFontSize(12),
    marginRight: moderateScale(8),
  },
});
