import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ClothingShoesJewelry from './src/pages/ClothingShoesJewelry';
import FirstLoginPage from './src/pages/firstLoginPage';
import Slider from './src/pages/Slider/Slider';
import SplashScreen from './src/pages/splashScreen';
import MyCart from './src/pages/MyCart'
import Profile from './src/pages/profile';
import Home from './src/pages/Home';
import Categories from './src/pages/Categories';
import OneTimeVerification from './src/pages/OneTimeVerification/OneTimeVerification';
import WishLIst from './src/pages/WishList'
import MensFashion from './src/pages/MensFashion';
import WishListScreen from './src/pages/WishList';
import EditScreen from './src/pages/EditScreen';
import MyOrder from './src/pages/MyOders'
import ViewProducts from './src/pages/ViewProducts';
import OrderDetails from './src/pages/OrderDetails';
import MyAccount from './src/pages/MyAccount';
import EditProfile from './src/pages/EditProfile';
import AddressBook from './src/pages/AddressBook';
import PaymentScreen from './src/pages/PaymentScreen';
import OrderSuccess from './src/pages/OrderSuccess';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Slider" component={Slider} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Categories" component={Categories} />
          <Stack.Screen name="ClothingShoesJewelry" component={ClothingShoesJewelry} />
          <Stack.Screen name="FirstLogin" component={FirstLoginPage} />
          <Stack.Screen name="MensFashion" component={MensFashion}/>
          <Stack.Screen name="OneTimeVerification" component={OneTimeVerification} />
          <Stack.Screen name="WishList" component={WishListScreen}/>
          <Stack.Screen name="MyCart" component={MyCart}/>
          <Stack.Screen name ="EditScreen" component={EditScreen}/>
          <Stack.Screen name="MyOders" component={MyOrder}/>
          <Stack.Screen name="ViewProducts" component={ViewProducts}/>
          <Stack.Screen name ="OrderDetails" component={OrderDetails}/>
          <Stack.Screen name="MyAccount" component={MyAccount} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name = "AddressBook" component={AddressBook}/>
          <Stack.Screen name = "PaymentScreen" component={PaymentScreen} options={{ headerShown:false}}/>
          <Stack.Screen name = "OrderSuccess" component={OrderSuccess} options={{ headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
