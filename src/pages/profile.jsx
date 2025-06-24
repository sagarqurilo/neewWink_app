import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions, // Import Dimensions
  PixelRatio, // Import PixelRatio
} from 'react-native';

// --- Responsive Metrics Utility ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline base sizes based on a standard mobile device (e.g., iPhone 8)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

// Functions to scale sizes based on screen dimensions
const scale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = size => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Function for responsive font sizes
const responsiveFontSize = (size) => {
    const newSize = moderateScale(size, 0.5); // Adjust factor as needed
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
// --- End Responsive Metrics Utility ---

const WelcomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Right Image - Positioned absolutely */}
      <View style={styles.topRightImageContainer}>
        <Image
          source={require('../assets/images/image.png')}
          style={styles.topRightImage}
          resizeMode="contain"
        />
      </View>

      {/* Main Logo and Wink Image */}
      <View style={styles.centerContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/bluebag.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Image
          source={require('../assets/images/blackWink.png')}
          style={styles.blackWink}
          resizeMode="contain"
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.shopButton}>
        <Text style={styles.shopButtonText}>Continue to Shop now!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sellerButton}>
        <Text style={styles.sellerButtonText}>Become a Seller</Text>
      </TouchableOpacity>

      {/* Bottom Right Image - Positioned absolutely */}
      <View style={styles.bottomRightImageContainer}>
        <Image
          source={require('../assets/images/blue.png')}
          style={styles.bottomRightImage}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center', // Center content horizontally by default
    justifyContent: 'flex-end', // Push content towards the bottom, allowing space for top elements
    paddingHorizontal: moderateScale(24), // Responsive horizontal padding
    paddingBottom: verticalScale(40), // Space from the bottom edge
  },
  topRightImageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: moderateScale(150), // Adjust size responsively
    height: moderateScale(150), // Adjust size responsively
    overflow: 'hidden', // Hide parts that go outside
  },
  topRightImage: {
    width: '100%',
    height: '100%',
    // This image seems to be a decorative corner piece, so adjust its position within its container
    // If original asset size makes it too large, scale it down
    transform: [{ translateX: moderateScale(50) }, { translateY: moderateScale(-50) }], // Move it partly off-screen to match original visual
  },
  centerContent: {
    flex: 1, // Take up remaining space
    justifyContent: 'center', // Center vertically within this section
    alignItems: 'center', // Center horizontally within this section
    width: '100%', // Take full width
    marginBottom: verticalScale(40), // Space between content and buttons
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Center logo inside its container
    width: moderateScale(150),
    height: moderateScale(150),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(75), // Half of width/height for perfect circle
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: verticalScale(5) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(10),
    elevation: moderateScale(8),
    marginBottom: verticalScale(20), // Space below logo
  },
  logo: {
    width: moderateScale(100),
    height: moderateScale(100),
  },
  blackWink: {
    width: moderateScale(100), // Adjust size responsively
    height: moderateScale(100), // Adjust size responsively
    position: 'absolute', // Position relative to centerContent
    bottom: verticalScale(-20), // Adjust as needed to overlap or align
    left: '50%', // Start at the middle
    transform: [{ translateX: moderateScale(-50) }, { translateY: moderateScale(0) }], // Center it horizontally
  },
  shopButton: {
    backgroundColor: '#0066FF',
    borderRadius: moderateScale(30),
    paddingVertical: verticalScale(15),
    paddingHorizontal: moderateScale(40),
    width: '90%', // Use percentage for width
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  shopButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  sellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(30),
    paddingVertical: verticalScale(15),
    paddingHorizontal: moderateScale(20),
    width: '90%', // Use percentage for width
    justifyContent: 'center', // Center content within button
    marginBottom: verticalScale(10), // Space above the next image
  },
  sellerButtonText: {
    fontSize: responsiveFontSize(16),
    color: '#555',
    // The original `left: 80` was fixed and problematic.
    // Centering with `justifyContent: 'center'` on the button itself is better.
  },
  bottomRightImageContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(150), // Adjust size responsively
    height: moderateScale(150), // Adjust size responsively
    overflow: 'hidden',
  },
  bottomRightImage: {
    width: '100%',
    height: '100%',
    transform: [{ translateX: moderateScale(50) }, { translateY: moderateScale(50) }], // Move partly off-screen
  },
});

export default WelcomeScreen;