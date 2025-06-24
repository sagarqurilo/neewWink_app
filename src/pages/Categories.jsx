import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
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

const Categories = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Mzk3YTYzYWM5MTRhYzhlYWI4YmVjNiIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ5Mjc0NjE0LCJleHAiOjE3NDk4Nzk0MTR9.o1xji-JxI6Is79qOPOwXVYbwalRQAgp7qvU7xEeNxqY`;

  const handleCategoryPress = (item) => {
    if (!item || !item.name) return;
    const categoryType = item.name.toLowerCase().replace(/\s+/g, '');
    navigation.navigate('ClothingShoesJewelry', { categoryType });
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/category",
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      let fetchedCategories = response.data;
      if (fetchedCategories.length % 2 !== 0) {
        fetchedCategories = [...fetchedCategories, { _id: 'dummy', name: '', image: '', empty: true }];
      }
      setCategories(fetchedCategories);
    } catch (error) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: responsiveFontSize(24) }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#406FF3" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: responsiveFontSize(24) }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: responsiveFontSize(24) }} />
      </View>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          if (item.empty) {
            return <View style={[styles.gridItem, styles.emptyItem]} />;
          }
          return (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.image }} style={styles.gridImg} />
              <Text style={styles.gridText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(22),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(10),
    borderBottomWidth: moderateScale(1),
    borderColor: '#eee',
  },
  backButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(-10),
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(10),
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    margin: moderateScale(8),
    backgroundColor: '#f8f8f8',
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
  },
  emptyItem: {
    backgroundColor: 'transparent',
  },
  gridImg: {
    width: moderateScale(150),
    height: moderateScale(120),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(8),
  },
  gridText: {
    fontSize: responsiveFontSize(14),
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: verticalScale(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: moderateScale(20),
  },
  errorText: {
    fontSize: responsiveFontSize(16),
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  retryButton: {
    backgroundColor: '#406FF3',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(5),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
});