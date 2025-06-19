import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Categories = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // const handleCategoryPress = (item) => {
  //   let categoryType = 'fashion'; 

    
  //   const itemName = item.name.toLowerCase();
  //   if (itemName.includes('cosmetic') || itemName.includes('beauty') || itemName.includes('personal care')) {
  //     categoryType = 'cosmetics';
  //   } else if (itemName.includes('snack') || itemName.includes('food') || itemName.includes('beverage')) {
  //     categoryType = 'snacks';
  //   }

  //   navigation.navigate('ClothingShoesJewelry', { categoryType });
  // };
const handleCategoryPress = (item) => {
  if (!item || !item.name) return;
  const categoryType = item.name.toLowerCase().replace(/\s+/g, '');
  navigation.navigate('ClothingShoesJewelry', { categoryType });
};




  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://qdp1vbhp-2000.inc1.devtunnels.ms/api/product/category",
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Mzk3YTYzYWM5MTRhYzhlYWI4YmVjNiIsInBob25lIjoiNzk4MjkwMDc3MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ5Mjc0NjE0LCJleHAiOjE3NDk4Nzk0MTR9.o1xji-JxI6Is79qOPOwXVYbwalRQAgp7qvU7xEeNxqY`
            }
          }
        );

        let fetchedCategories = response.data;
        if (fetchedCategories.length % 2 !== 0) {
          fetchedCategories = [...fetchedCategories, { _id: 'dummy', name: '', image: '', empty: true }];
        }
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

 
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#406FF3" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              fetchCategories();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 24 }} />
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
              <Image
                source={{ uri: item.image }}
                style={styles.gridImg}
              />
              <Text style={styles.gridText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginLeft: -10,
  },
  backArrow: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '300',
    width: 24,
    textAlign: 'left',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 14,
  },
  emptyItem: {
    backgroundColor: 'transparent',
  },
  gridImg: {
    width: 150,
    height: 120,
    borderRadius: 16,
    marginBottom: 8,
  },
  gridText: {
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
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
});

export default Categories; 