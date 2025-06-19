import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';

const WelcomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View><Image
        source={require('../assets/images/image.png')}
        style={{ left: 344 }}
      /></View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/bluebag.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={{ left: 150, bottom: 70 }}>
        <Image source={require('../assets/images/blackWink.png')} />
      </View>

      <TouchableOpacity style={styles.shopButton}>
        <Text style={styles.shopButtonText}>Continue to Shop now!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sellerButton}>
        <Text style={styles.sellerButtonText}>Become a Seller</Text>

      </TouchableOpacity>
      <View >
        <TouchableOpacity >
          <Image source={require('../assets/images/blue.png')}
            style={{ left: 250, bottom: 40 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
    width: 150,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    left: 130,
    bottom: 30,

  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    top: 21,


  },

  shopButton: {
    backgroundColor: '#0066FF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,

    left: 20,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '90%',
    justifyContent: 'space-between',

    left: 20,
  },
  sellerButtonText: {
    fontSize: 16,
    color: '#555',
    left: 80,

  },

});

export default WelcomeScreen;
