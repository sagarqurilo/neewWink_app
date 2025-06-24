import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    horizontalScale,
    verticalScale,
    fontScale,
} from '../component/ResponsiveMetrix';

const BottomNavigationBar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const activeBottomTab = route.name;

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                    navigation.navigate('Home');
                }}
            >
                <Image
                    source={require('../assets/images/homelogo.png')}
                    style={[
                        styles.navIcon,
                        activeBottomTab === 'Home' && { tintColor: '#406FF3' }
                    ]}
                    resizeMode="contain"
                />
                <Text style={activeBottomTab === 'Home' ? styles.navTextActive : styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                    navigation.navigate('Categories');
                }}
            >
                <Image
                    source={require('../assets/images/categeroies.png')}
                    style={[
                        styles.navIcon,
                        activeBottomTab === 'Categories' && { tintColor: '#3575FF' }
                    ]}
                    resizeMode="contain"
                />
                <Text style={activeBottomTab === 'Categories' ? styles.navTextActive : styles.navText}>Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                    navigation.navigate('WishList');
                }}
            >
                <Image
                    source={require('../assets/images/heartlogo.png')}
                    style={[
                        styles.navIcon,
                        activeBottomTab === 'WishList' && { tintColor: '#3575F6' }
                    ]}
                    resizeMode="contain"
                />
                <Text style={activeBottomTab === 'WishList' ? styles.navTextActive : styles.navText}>Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                    navigation.navigate('MyCart');
                }}
            >
                <Image
                    source={require('../assets/images/cartlogo.png')}
                    style={[
                        styles.navIcon,
                        activeBottomTab === 'Cart' && { tintColor: '#406FF3' }
                    ]}
                    resizeMode="contain"
                />
                <Text style={activeBottomTab === 'MyCart' ? styles.navTextActive : styles.navText}>Cart</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: verticalScale(60),
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        paddingBottom: verticalScale(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 5,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: horizontalScale(60),
        paddingVertical: verticalScale(8),
        borderRadius: 8,
    },
    navIcon: {
        width: horizontalScale(22),
        height: horizontalScale(22),
        marginBottom: 2,
    },
    navText: {
        fontSize: fontScale(10),
        color: '#888',
    },
    navTextActive: {
        fontSize: fontScale(10),
        color: '#3575F6',
        fontWeight: '600',
    },
});

export default BottomNavigationBar;
