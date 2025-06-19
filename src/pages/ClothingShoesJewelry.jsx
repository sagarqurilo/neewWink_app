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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function ClothingShoesJewelry() {
  const navigation = useNavigation();
  const route = useRoute();
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState('');

  useEffect(() => {
    const categoryType = route.params?.categoryType;
    setCategoryTitle(formatCategoryTitle(categoryType));
    fetchCategories(categoryType);
    setProducts([]);
    setSelectedSubCategory(null);
  }, [route.params?.categoryType]);

  const formatCategoryTitle = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const fetchCategories = async (categoryType) => {
    try {
      setLoading(true);
      const response = await fetch('https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/category');
      const data = await response.json();

      const normalizedType = categoryType.toLowerCase().replace(/\s+/g, '');
      const matchedCategory = data.find(cat =>
        cat.name.toLowerCase().replace(/\s+/g, '') === normalizedType
      );

      if (matchedCategory?.subCategories) {
        setSubCategories(matchedCategory.subCategories);
      } else {
        setSubCategories([]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchProductsBySubCategory = async (subCategoryId) => {
    try {
      setLoading(true);
      const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/product_by_category/${subCategoryId}`);
      const data = await res.json();
      setProducts(data.products);
      console.log(data.products);
      
      setSelectedSubCategory(subCategoryId);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <ScrollView style={{ padding: 14 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{categoryTitle}</Text>
        </View>

        <View style={styles.searchBox}>
          <TouchableOpacity><Image source={require('../assets/images/search.png')} style={styles.searchIcon} /></TouchableOpacity>
          <TextInput placeholder={`Search in ${categoryTitle}...`} style={styles.searchInput} placeholderTextColor="#aaa" />
          <TouchableOpacity><Image source={require('../assets/images/micro.png')} style={styles.micIcon} /></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : subCategories.length === 0 ? (
          <Text style={styles.errorText}>No {categoryTitle.toLowerCase()} categories found</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {subCategories.map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => fetchProductsBySubCategory(item._id)}>
                <Image source={{ uri: item.image  }} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {products.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Products</Text>
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.trendingProductCard}
                  onPress={() => navigation.navigate('ViewProducts', {
                    productId: item._id,
                  })}
                >
                  <Image source={{ uri: item.variants[0].images[0] }} style={styles.trendingProductImage} />
                  <Text style={styles.trendingProductTitle}>{item.name}</Text>
                  <Text style={styles.trendingProductTitle}>{item.brand}</Text>
                  <Text style={styles.trendingProductPrice}>₹{item.variants[0].price}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  micIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryItem: {
    marginRight: 15,
    alignItems: 'center',
    width: 100,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  trendingProductCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trendingProductImage: {
    width: '100%',
    height: 140,
    borderRadius: 4,
    marginBottom: 8,
  },
  trendingProductTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trendingProductBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  trendingProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ClothingShoesJewelry;
