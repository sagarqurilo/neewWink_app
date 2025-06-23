// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid, Platform, Text } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';

// const MapScreen = ({ route }) => {
//     const [userLocation, setUserLocation] = useState(null);
//     const [deliveryLocation, setDeliveryLocation] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [distance, setDistance] = useState(0);
//     const [duration, setDuration] = useState(0);

//     const deliveryBoyId = route.params?.deliveryBoyId;
    
//     // Replace with your Google Maps API key
//     const GOOGLE_MAPS_API_KEY = 'AIzaSyAhaadbz8YSCMTUthhoWw_SCldMKGZEv5E';

//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//         return true;
//     };

//     const getUserCurrentLocation = async () => {
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             Alert.alert('Permission Denied', 'Location permission is required');
//             setLoading(false);
//             return;
//         }

//         Geolocation.getCurrentPosition(
//             position => {
//                 const { latitude, longitude } = position.coords;
//                 if (isValidCoordinate(latitude, longitude)) {
//                     setUserLocation({ latitude, longitude });
//                     console.log('User location:', { latitude, longitude });
//                 } else {
//                     console.error('Invalid user coordinates:', { latitude, longitude });
//                     Alert.alert('Error', 'Invalid location coordinates received');
//                 }
//                 setLoading(false);
//             },
//             error => {
//                 console.error('Location error', error);
//                 Alert.alert('Error', 'Failed to get your location');
//                 setLoading(false);
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//     };

//     const fetchDeliveryLocation = async () => {
//         try {
//             const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`);
//             const data = await res.json();
//             if (data.success && data.lat && data.long) {
//                 const lat = parseFloat(data.lat);
//                 const lng = parseFloat(data.long);
                
//                 // Validate coordinates
//                 if (isValidCoordinate(lat, lng)) {
//                     setDeliveryLocation({
//                         latitude: lat,
//                         longitude: lng
//                     });
//                     console.log('Delivery location:', { latitude: lat, longitude: lng });
//                 } else {
//                     console.error('Invalid delivery coordinates:', { lat: data.lat, lng: data.long });
//                 }
//             }
//         } catch (err) {
//             console.error('Fetch delivery location failed:', err);
//         }
//     };

//     const isValidCoordinate = (lat, lng) => {
//         return (
//             !isNaN(lat) && !isNaN(lng) &&
//             lat >= -90 && lat <= 90 &&
//             lng >= -180 && lng <= 180 &&
//             lat !== 0 && lng !== 0
//         );
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371; // Radius of the Earth in kilometers
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a = 
//             Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//         return R * c; // Distance in kilometers
//     };

//     useEffect(() => {
//         getUserCurrentLocation();
//         fetchDeliveryLocation();
//         const interval = setInterval(fetchDeliveryLocation, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     if (loading || !userLocation || !deliveryLocation) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#406FF3" />
//                 <Text>Loading map and locations...</Text>
//             </View>
//         );
//     }

//     // Calculate distance between points to check if they're too close
//     const distanceBetweenPoints = calculateDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         deliveryLocation.latitude,
//         deliveryLocation.longitude
//     );

//     // If points are too close (less than 50 meters), don't show directions
//     const shouldShowDirections = distanceBetweenPoints > 0.05; // 50 meters

//     const midpoint = {
//         latitude: (userLocation.latitude + deliveryLocation.latitude) / 2,
//         longitude: (userLocation.longitude + deliveryLocation.longitude) / 2,
//     };

//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.map}
//                 initialRegion={{
//                     ...midpoint,
//                     latitudeDelta: 0.05,
//                     longitudeDelta: 0.05,
//                 }}
//             >
//                 <Marker
//                     coordinate={userLocation}
//                     title="Your Location"
//                     description={distance > 0 ? `Distance: ${distance.toFixed(2)} km, ETA: ${Math.round(duration)} min` : ''}
//                     pinColor="blue"
//                 />
//                 <Marker
//                     coordinate={deliveryLocation}
//                     title="Delivery Boy"
//                     pinColor="red"
//                 />
                
//                 {shouldShowDirections ? (
//                     <MapViewDirections
//                         origin={userLocation}
//                         destination={deliveryLocation}
//                         apikey={GOOGLE_MAPS_API_KEY}
//                         strokeWidth={4}
//                         strokeColor="#406FF3"
//                         optimizeWaypoints={true}
//                         mode="DRIVING"
//                         precision="high"
//                         onStart={(params) => {
//                             console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
//                         }}
//                         onReady={result => {
//                             console.log(`Distance: ${result.distance} km`);
//                             console.log(`Duration: ${result.duration} min.`);
//                             setDistance(result.distance);
//                             setDuration(result.duration);
//                         }}
//                         onError={(errorMessage) => {
//                             console.error('MapViewDirections Error:', errorMessage);
//                             console.log('Fallback: User Location:', userLocation);
//                             console.log('Fallback: Delivery Location:', deliveryLocation);
//                             // Set basic distance calculation as fallback
//                             setDistance(distanceBetweenPoints);
//                             setDuration(distanceBetweenPoints * 2); // Rough estimate: 2 min per km
//                         }}
//                     />
//                 ) : (
//                     // Show simple polyline for very close distances
//                     <Polyline
//                         coordinates={[userLocation, deliveryLocation]}
//                         strokeColor="#406FF3"
//                         strokeWidth={3}
//                     />
//                 )}
//             </MapView>
            
//             {(distance > 0 || distanceBetweenPoints > 0) && (
//                 <View style={styles.infoContainer}>
//                     <Text style={styles.infoText}>
//                         Distance: {distance > 0 ? `${distance.toFixed(2)} km` : `${distanceBetweenPoints.toFixed(2)} km`}
//                     </Text>
//                     <Text style={styles.infoText}>
//                         ETA: {duration > 0 ? `${Math.round(duration)} minutes` : `${Math.round(distanceBetweenPoints * 2)} minutes`}
//                     </Text>
//                     {!shouldShowDirections && (
//                         <Text style={styles.warningText}>
//                             Locations are very close - showing direct line
//                         </Text>
//                     )}
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     map: { flex: 1 },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     infoContainer: {
//         position: 'absolute',
//         top: 50,
//         left: 20,
//         right: 20,
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     infoText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 5,
//     },
//     warningText: {
//         fontSize: 12,
//         fontStyle: 'italic',
//         color: '#666',
//         marginTop: 5,
//     },
// });

// export default MapScreen;


// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native';
// import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';

// const MapScreen = ({ route }) => {
//     const [userLocation, setUserLocation] = useState(null);
//     const [deliveryLocation, setDeliveryLocation] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [distance, setDistance] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [trackingPath, setTrackingPath] = useState([]); // Store delivery person's path history
//     const [isTracking, setIsTracking] = useState(true);

//     const deliveryBoyId = route.params?.deliveryBoyId;
    
//     // Replace with your Google Maps API key
//     const GOOGLE_MAPS_API_KEY = 'AIzaSyAhaadbz8YSCMTUthhoWw_SCldMKGZEv5E';

//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//         return true;
//     };

//     const getUserCurrentLocation = async () => {
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             Alert.alert('Permission Denied', 'Location permission is required');
//             setLoading(false);
//             return;
//         }

//         Geolocation.getCurrentPosition(
//             position => {
//                 const { latitude, longitude } = position.coords;
//                 if (isValidCoordinate(latitude, longitude)) {
//                     setUserLocation({ latitude, longitude });
//                     console.log('User location:', { latitude, longitude });
//                 } else {
//                     console.error('Invalid user coordinates:', { latitude, longitude });
//                     Alert.alert('Error', 'Invalid location coordinates received');
//                 }
//                 setLoading(false);
//             },
//             error => {
//                 console.error('Location error', error);
//                 Alert.alert('Error', 'Failed to get your location');
//                 setLoading(false);
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//     };


// const getCurrentLocation = async () => {
//     console.log("Getting current location...");
//     setLoadingNearbyStores(true);
//     setLocationError(null);

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//         Alert.alert("Permission Denied", "Enable location permission in settings");
//         setLoadingNearbyStores(false);
//         return;
//     }

//     Geolocation.getCurrentPosition(
//         (position) => {
//             const { latitude, longitude } = position.coords;
//             console.log('Location obtained:', { latitude, longitude });
//             setCurrentLocation({ latitude, longitude });
//             fetchNearbyStores(latitude, longitude);
//         },
//         (error) => {
//             console.error('Geolocation error:', error);
//             let errorMessage = 'Could not retrieve your current location.';
//             if (error.code === 1) {
//                 errorMessage = 'Location permission denied. Enable it from app settings.';
//             } else if (error.code === 2) {
//                 errorMessage = 'Location unavailable.';
//             } else if (error.code === 3) {
//                 errorMessage = 'Location request timed out.';
//             }
//             setLocationError(errorMessage);
//             setLoadingNearbyStores(false);
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 15000,
//             maximumAge: 10000
//         }
//     );
// };




//     const fetchDeliveryLocation = async () => {
//         try {
//             const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`);
//             const data = await res.json();


//         console.log('🔍 Raw API Response:', data);
//         console.log('🔍 Raw lat:', data.lat, 'type:', typeof data.lat);
//         console.log('🔍 Raw long:', data.long, 'type:', typeof data.long);
//             if (data.success && data.lat && data.long) {
//                 const lat = parseFloat(data.lat);
//                 const lng = parseFloat(data.long);



//             console.log('🔍 Parsed lat:', lat);
//             console.log('🔍 Parsed lng:', lng);
//             console.log('🔍 Delhi should be around: lat=28.6, lng=77.2');
                
//                 // Validate coordinates
//                 if (isValidCoordinate(lat, lng)) {
//                     const newLocation = {
//                         latitude: lat,
//                         longitude: lng,
//                         timestamp: Date.now()
//                     };
                    
//                     setDeliveryLocation(newLocation);
                    
//                     // Add to tracking path if location has changed significantly
//                     setTrackingPath(prevPath => {
//                         const lastPoint = prevPath[prevPath.length - 1];
//                         if (!lastPoint || calculateDistance(lastPoint.latitude, lastPoint.longitude, lat, lng) > 0.01) {
//                             // Only add if moved more than 10 meters
//                             return [...prevPath, newLocation];
//                         }
//                         return prevPath;
//                     });
                    
//                     console.log('Delivery location:', { latitude: lat, longitude: lng });
//                 } else {
//                     console.error('Invalid delivery coordinates:', { lat: data.lat, lng: data.long });
//                 }
//             }
//         } catch (err) {
//             console.error('Fetch delivery location failed:', err);
//         }
//     };

//     const isValidCoordinate = (lat, lng) => {
//         return (
//             !isNaN(lat) && !isNaN(lng) &&
//             lat >= -90 && lat <= 90 &&
//             lng >= -180 && lng <= 180 &&
//             lat !== 0 && lng !== 0
//         );
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371; // Radius of the Earth in kilometers
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a = 
//             Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//         return R * c; // Distance in kilometers
//     };

//     useEffect(() => {
//         getUserCurrentLocation();
//         fetchDeliveryLocation();
        
//         // Update delivery location every 10 seconds for better tracking
//         const interval = setInterval(fetchDeliveryLocation, 100000);
        
//         // Update user location every 30 seconds
//         const userLocationInterval = setInterval(() => {
//             if (isTracking) {
//                 getUserCurrentLocation();
//             }
//         }, 300000);
        
//         return () => {
//             clearInterval(interval);
//             clearInterval(userLocationInterval);
//         };
//     }, []);

//     if (loading || !userLocation || !deliveryLocation) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#406FF3" />
//                 <Text>Loading map and locations...</Text>
//             </View>
//         );
//     }

//     // Calculate distance between points to check if they're too close
//     const distanceBetweenPoints = calculateDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         deliveryLocation.latitude,
//         deliveryLocation.longitude
//     );

//     // If points are too close (less than 50 meters), don't show directions
//     const shouldShowDirections = distanceBetweenPoints > 0.05; // 50 meters

//     const midpoint = {
//         latitude: (userLocation.latitude + deliveryLocation.latitude) / 2,
//         longitude: (userLocation.longitude + deliveryLocation.longitude) / 2,
//     };

//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.map}
//                 initialRegion={{
//                     ...midpoint,
//                     latitudeDelta: 0.05,
//                     longitudeDelta: 0.05,
//                 }}
//                 showsUserLocation={true}
//                 showsMyLocationButton={true}
//                 followsUserLocation={false}
//                 showsCompass={true}
//                 showsScale={true}
//             >
//                 {/* User Location Marker with Circle */}
//                 <Marker
//                     coordinate={userLocation}
//                     title="Your Location"
//                     description={distance > 0 ? `Distance: ${distance.toFixed(2)} km, ETA: ${Math.round(duration)} min` : ''}
//                     pinColor="blue"
//                 />
                
//                 {/* User Location Accuracy Circle */}
//                 <Circle
//                     center={userLocation}
//                     radius={50} // 50 meter radius
//                     strokeColor="rgba(0, 122, 255, 0.5)"
//                     fillColor="rgba(0, 122, 255, 0.1)"
//                     strokeWidth={2}
//                 />

//                 {/* Delivery Person Current Location */}
//                 <Marker
//                     coordinate={deliveryLocation}
//                     title="Delivery Person"
//                     description="Current Location"
//                     pinColor="red"
//                 />

//                 {/* Tracking Path - Shows where delivery person has been */}
//                 {trackingPath.length > 1 && (
//                     <Polyline
//                         coordinates={trackingPath}
//                         strokeColor="#FF6B6B"
//                         strokeWidth={3}
//                         lineDashPattern={[5, 5]}
//                     />
//                 )}

//                 {/* Current Route Directions */}
//                 {shouldShowDirections ? (
//                     <MapViewDirections
//                         origin={userLocation}
//                         destination={deliveryLocation}
//                         apikey={GOOGLE_MAPS_API_KEY}
//                         strokeWidth={4}
//                         strokeColor="#406FF3"
//                         optimizeWaypoints={true}
//                         mode="DRIVING"
//                         precision="high"
//                         onStart={(params) => {
//                             console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
//                         }}
//                         onReady={result => {
//                             console.log(`Distance: ${result.distance} km`);
//                             console.log(`Duration: ${result.duration} min.`);
//                             setDistance(result.distance);
//                             setDuration(result.duration);
//                         }}
//                         onError={(errorMessage) => {
//                             console.error('MapViewDirections Error:', errorMessage);
//                             console.log('Fallback: User Location:', userLocation);
//                             console.log('Fallback: Delivery Location:', deliveryLocation);
//                             // Set basic distance calculation as fallback
//                             setDistance(distanceBetweenPoints);
//                             setDuration(distanceBetweenPoints * 2); // Rough estimate: 2 min per km
//                         }}
//                     />
//                 ) : (
//                     // Show simple polyline for very close distances
//                     <Polyline
//                         coordinates={[userLocation, deliveryLocation]}
//                         strokeColor="#406FF3"
//                         strokeWidth={3}
//                     />
//                 )}
//             </MapView>
            
//             {(distance > 0 || distanceBetweenPoints > 0) && (
//                 <View style={styles.infoContainer}>
//                     <Text style={styles.infoText}>
//                         Distance: {distance > 0 ? `${distance.toFixed(2)} km` : `${distanceBetweenPoints.toFixed(2)} km`}
//                     </Text>
//                     <Text style={styles.infoText}>
//                         ETA: {duration > 0 ? `${Math.round(duration)} minutes` : `${Math.round(distanceBetweenPoints * 2)} minutes`}
//                     </Text>
//                     <Text style={styles.trackingText}>
//                         Tracking Points: {trackingPath.length}
//                     </Text>
//                     {!shouldShowDirections && (
//                         <Text style={styles.warningText}>
//                             Locations are very close - showing direct line
//                         </Text>
//                     )}
//                 </View>
//             )}
            
//             {/* Control Buttons */}
//             <View style={styles.controlContainer}>
//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: isTracking ? '#FF6B6B' : '#4CAF50' }]}
//                     onPress={() => setIsTracking(!isTracking)}
//                 >
//                     <Text style={styles.controlButtonText}>
//                         {isTracking ? 'Stop Tracking' : 'Start Tracking'}
//                     </Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: '#FF9800' }]}
//                     onPress={() => setTrackingPath([])}
//                 >
//                     <Text style={styles.controlButtonText}>Clear Path</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     map: { flex: 1 },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     infoContainer: {
//         position: 'absolute',
//         top: 50,
//         left: 20,
//         right: 20,
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     infoText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 5,
//     },
//     warningText: {
//         fontSize: 12,
//         fontStyle: 'italic',
//         color: '#666',
//         marginTop: 5,
//     },
//     trackingText: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#FF6B6B',
//         marginBottom: 5,
//     },
//     controlContainer: {
//         position: 'absolute',
//         bottom: 30,
//         left: 20,
//         right: 20,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     controlButton: {
//         flex: 1,
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 25,
//         marginHorizontal: 5,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     controlButtonText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600',
//     },
// });

// export default MapScreen;


// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native';
// import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';

// const MapScreen = ({ route }) => {
//     const [userLocation, setUserLocation] = useState(null);
//     const [deliveryLocation, setDeliveryLocation] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [distance, setDistance] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [trackingPath, setTrackingPath] = useState([]);
//     const [isTracking, setIsTracking] = useState(true);
//     const [mapReady, setMapReady] = useState(false);

//     const deliveryBoyId = route.params?.deliveryBoyId;
    
//     // Replace with your Google Maps API key
//     const GOOGLE_MAPS_API_KEY = 'AIzaSyAhaadbz8YSCMTUthhoWw_SCldMKGZEv5E';

//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//         return true;
//     };

//     const getUserCurrentLocation = async () => {
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             Alert.alert('Permission Denied', 'Location permission is required');
//             setLoading(false);
//             return;
//         }

//         Geolocation.getCurrentPosition(
//             position => {
//                 const { latitude, longitude } = position.coords;
//                 console.log('Getting user location:', { latitude, longitude });
                
//                 if (isValidCoordinate(latitude, longitude)) {
//                     const userLoc = { latitude, longitude };
//                     setUserLocation(userLoc);
//                     console.log('✅ User location set:', userLoc);
//                 } else {
//                     console.error('❌ Invalid user coordinates:', { latitude, longitude });
//                     Alert.alert('Error', 'Invalid location coordinates received');
//                 }
//                 setLoading(false);
//             },
//             error => {
//                 console.error('❌ Location error:', error);
//                 Alert.alert('Error', 'Failed to get your location');
//                 setLoading(false);
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//     };

//     const fetchDeliveryLocation = async () => {
//         if (!deliveryBoyId) {
//             console.warn('⚠️ No delivery boy ID provided');
//             return;
//         }

//         try {
//             console.log('🚚 Fetching delivery location for ID:', deliveryBoyId);
//             const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`);
//             const data = await res.json();

//             console.log('🔍 Raw API Response:', data);
            
//             if (data.success && data.lat && data.long) {
//                 const lat = parseFloat(data.lat);
//                 const lng = parseFloat(data.long);

//                 console.log('🔍 Parsed coordinates:', { lat, lng });
                
//                 if (isValidCoordinate(lat, lng)) {
//                     const newLocation = {
//                         latitude: lat,
//                         longitude: lng,
//                         timestamp: Date.now()
//                     };
                    
//                     setDeliveryLocation(newLocation);
//                     console.log('✅ Delivery location set:', newLocation);
                    
//                     // Add to tracking path if location has changed significantly
//                     setTrackingPath(prevPath => {
//                         const lastPoint = prevPath[prevPath.length - 1];
//                         if (!lastPoint || calculateDistance(lastPoint.latitude, lastPoint.longitude, lat, lng) > 0.01) {
//                             const newPath = [...prevPath, newLocation];
//                             console.log('📍 Added tracking point, total points:', newPath.length);
//                             return newPath;
//                         }
//                         return prevPath;
//                     });
//                 } else {
//                     console.error('❌ Invalid delivery coordinates:', { lat, lng });
//                 }
//             } else {
//                 console.warn('⚠️ API response missing location data:', data);
//             }
//         } catch (err) {
//             console.error('❌ Fetch delivery location failed:', err);
//         }
//     };

//     const isValidCoordinate = (lat, lng) => {
//         const isValid = (
//             !isNaN(lat) && !isNaN(lng) &&
//             lat >= -90 && lat <= 90 &&
//             lng >= -180 && lng <= 180 &&
//             lat !== 0 && lng !== 0
//         );
//         console.log('🔍 Coordinate validation:', { lat, lng, isValid });
//         return isValid;
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371; // Radius of the Earth in kilometers
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a = 
//             Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//         return R * c;
//     };

//     const onMapReady = () => {
//         console.log('🗺️ Map is ready');
//         setMapReady(true);
//     };

//     useEffect(() => {
//         console.log('🚀 Component mounted, getting locations...');
//         getUserCurrentLocation();
//         fetchDeliveryLocation();
        
//         // Update delivery location every 10 seconds
//         const interval = setInterval(() => {
//             if (isTracking) {
//                 fetchDeliveryLocation();
//             }
//         }, 10000);
        
//         // Update user location every 30 seconds
//         const userLocationInterval = setInterval(() => {
//             if (isTracking) {
//                 getUserCurrentLocation();
//             }
//         }, 30000);
        
//         return () => {
//             clearInterval(interval);
//             clearInterval(userLocationInterval);
//         };
//     }, [deliveryBoyId, isTracking]);

//     // Debug logging
//     useEffect(() => {
//         console.log('🔍 State update - userLocation:', userLocation);
//         console.log('🔍 State update - deliveryLocation:', deliveryLocation);
//         console.log('🔍 State update - loading:', loading);
//         console.log('🔍 State update - mapReady:', mapReady);
//     }, [userLocation, deliveryLocation, loading, mapReady]);

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#406FF3" />
//                 <Text>Loading map and locations...</Text>
//             </View>
//         );
//     }

//     if (!userLocation) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <Text>Unable to get your location</Text>
//                 <TouchableOpacity 
//                     style={styles.retryButton}
//                     onPress={getUserCurrentLocation}
//                 >
//                     <Text style={styles.retryButtonText}>Retry</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     // Calculate region to show both points
//     let mapRegion;
//     if (userLocation && deliveryLocation) {
//         const minLat = Math.min(userLocation.latitude, deliveryLocation.latitude);
//         const maxLat = Math.max(userLocation.latitude, deliveryLocation.latitude);
//         const minLng = Math.min(userLocation.longitude, deliveryLocation.longitude);
//         const maxLng = Math.max(userLocation.longitude, deliveryLocation.longitude);
        
//         const latDelta = Math.max((maxLat - minLat) * 1.5, 0.01);
//         const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.01);
        
//         mapRegion = {
//             latitude: (minLat + maxLat) / 2,
//             longitude: (minLng + maxLng) / 2,
//             latitudeDelta: latDelta,
//             longitudeDelta: lngDelta,
//         };
//     } else {
//         mapRegion = {
//             ...userLocation,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         };
//     }

//     console.log('🗺️ Map region:', mapRegion);

//     // Calculate distance between points
//     const distanceBetweenPoints = deliveryLocation ? calculateDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         deliveryLocation.latitude,
//         deliveryLocation.longitude
//     ) : 0;

//     const shouldShowDirections = deliveryLocation && distanceBetweenPoints > 0.05;

//     console.log('🔍 Should show directions:', shouldShowDirections, 'Distance:', distanceBetweenPoints);

//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.map}
//                 initialRegion={mapRegion}
//                 region={mapRegion}
//                 onMapReady={onMapReady}
//                 showsUserLocation={false} // We'll use custom marker
//                 showsMyLocationButton={true}
//                 followsUserLocation={false}
//                 showsCompass={true}
//                 showsScale={true}
//                 mapType="standard"
//                 loadingEnabled={true}
//             >
//                 {/* User Location Marker */}
//                 {userLocation && mapReady && (
//                     <>
//                         <Marker
//                             coordinate={userLocation}
//                             title="Your Location"
//                             description={`Lat: ${userLocation.latitude.toFixed(6)}, Lng: ${userLocation.longitude.toFixed(6)}`}
//                             pinColor="blue"
//                             identifier="user-location"
//                         />
                        
//                         <Circle
//                             center={userLocation}
//                             radius={50}
//                             strokeColor="rgba(0, 122, 255, 0.5)"
//                             fillColor="rgba(0, 122, 255, 0.1)"
//                             strokeWidth={2}
//                         />
//                     </>
//                 )}

//                 {/* Delivery Person Location Marker */}
//                 {deliveryLocation && mapReady && (
//                     <Marker
//                         coordinate={deliveryLocation}
//                         title="Delivery Person"
//                         description={`Lat: ${deliveryLocation.latitude.toFixed(6)}, Lng: ${deliveryLocation.longitude.toFixed(6)}`}
//                         pinColor="red"
//                         identifier="delivery-location"
//                     />
//                 )}

//                 {/* Tracking Path */}
//                 {trackingPath.length > 1 && mapReady && (
//                     <Polyline
//                         coordinates={trackingPath}
//                         strokeColor="#FF6B6B"
//                         strokeWidth={3}
//                         lineDashPattern={[5, 5]}
//                     />
//                 )}

//                 {/* Route Directions */}
//                 {shouldShowDirections && mapReady && (
//                     <MapViewDirections
//                         origin={userLocation}
//                         destination={deliveryLocation}
//                         apikey={GOOGLE_MAPS_API_KEY}
//                         strokeWidth={4}
//                         strokeColor="#406FF3"
//                         optimizeWaypoints={true}
//                         mode="DRIVING"
//                         precision="high"
//                         onStart={(params) => {
//                             console.log('🛣️ Started routing between locations');
//                         }}
//                         onReady={result => {
//                             console.log('✅ Route ready - Distance:', result.distance, 'Duration:', result.duration);
//                             setDistance(result.distance);
//                             setDuration(result.duration);
//                         }}
//                         onError={(errorMessage) => {
//                             console.error('❌ MapViewDirections Error:', errorMessage);
//                             setDistance(distanceBetweenPoints);
//                             setDuration(distanceBetweenPoints * 2);
//                         }}
//                     />
//                 )}

//                 {/* Simple line for close distances */}
//                 {deliveryLocation && !shouldShowDirections && mapReady && (
//                     <Polyline
//                         coordinates={[userLocation, deliveryLocation]}
//                         strokeColor="#406FF3"
//                         strokeWidth={3}
//                     />
//                 )}
//             </MapView>
            
//             {/* Info Container */}
//             <View style={styles.infoContainer}>
//                 <Text style={styles.infoText}>
//                     User: {userLocation ? '✅ Located' : '❌ Not found'}
//                 </Text>
//                 <Text style={styles.infoText}>
//                     Delivery: {deliveryLocation ? '✅ Located' : '❌ Not found'}
//                 </Text>
//                 {(distance > 0 || distanceBetweenPoints > 0) && (
//                     <>
//                         <Text style={styles.infoText}>
//                             Distance: {distance > 0 ? `${distance.toFixed(2)} km` : `${distanceBetweenPoints.toFixed(2)} km`}
//                         </Text>
//                         <Text style={styles.infoText}>
//                             ETA: {duration > 0 ? `${Math.round(duration)} min` : `${Math.round(distanceBetweenPoints * 2)} min`}
//                         </Text>
//                     </>
//                 )}
//                 <Text style={styles.trackingText}>
//                     Tracking Points: {trackingPath.length}
//                 </Text>
//                 {deliveryLocation && !shouldShowDirections && (
//                     <Text style={styles.warningText}>
//                         Locations are very close - showing direct line
//                     </Text>
//                 )}
//             </View>
            
//             {/* Control Buttons */}
//             <View style={styles.controlContainer}>
//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: isTracking ? '#FF6B6B' : '#4CAF50' }]}
//                     onPress={() => setIsTracking(!isTracking)}
//                 >
//                     <Text style={styles.controlButtonText}>
//                         {isTracking ? 'Stop Tracking' : 'Start Tracking'}
//                     </Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: '#FF9800' }]}
//                     onPress={() => setTrackingPath([])}
//                 >
//                     <Text style={styles.controlButtonText}>Clear Path</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: '#2196F3' }]}
//                     onPress={() => {
//                         getUserCurrentLocation();
//                         fetchDeliveryLocation();
//                     }}
//                 >
//                     <Text style={styles.controlButtonText}>Refresh</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { 
//         flex: 1,
//         backgroundColor: '#f5f5f5'
//     },
//     map: { 
//         flex: 1,
//         minHeight: 400
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5'
//     },
//     retryButton: {
//         marginTop: 20,
//         backgroundColor: '#406FF3',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 5,
//     },
//     retryButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     infoContainer: {
//         position: 'absolute',
//         top: 50,
//         left: 20,
//         right: 20,
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     infoText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 5,
//     },
//     warningText: {
//         fontSize: 12,
//         fontStyle: 'italic',
//         color: '#666',
//         marginTop: 5,
//     },
//     trackingText: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#FF6B6B',
//         marginBottom: 5,
//     },
//     controlContainer: {
//         position: 'absolute',
//         bottom: 30,
//         left: 20,
//         right: 20,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     controlButton: {
//         flex: 1,
//         paddingVertical: 12,
//         paddingHorizontal: 15,
//         borderRadius: 25,
//         marginHorizontal: 3,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     controlButtonText: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: '600',
//     },
// });

// export default MapScreen;



// import React, { useEffect, useState, useRef } from 'react';
// import { View, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native';
// import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';

// const MapScreen = ({ route }) => {
//     const [userLocation, setUserLocation] = useState(null);
//     const [deliveryLocation, setDeliveryLocation] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [distance, setDistance] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [trackingPath, setTrackingPath] = useState([]);
//     const [isTracking, setIsTracking] = useState(true);
//     const [mapReady, setMapReady] = useState(false);
//     const [mapError, setMapError] = useState(null);
    
//     const mapRef = useRef(null);
//     const deliveryBoyId = route.params?.deliveryBoyId;
    
//     // Replace with your Google Maps API key
//     const GOOGLE_MAPS_API_KEY = 'AIzaSyAhaadbz8YSCMTUthhoWw_SCldMKGZEv5E';

//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             try {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                     {
//                         title: 'Location Permission',
//                         message: 'This app needs access to location to show your position on the map.',
//                         buttonNeutral: 'Ask Me Later',
//                         buttonNegative: 'Cancel',
//                         buttonPositive: 'OK',
//                     }
//                 );
//                 return granted === PermissionsAndroid.RESULTS.GRANTED;
//             } catch (err) {
//                 console.warn(err);
//                 return false;
//             }
//         }
//         return true;
//     };

//     const getUserCurrentLocation = async () => {
//         console.log('🔍 Getting user location...');
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             Alert.alert('Permission Denied', 'Location permission is required');
//             setLoading(false);
//             return;
//         }

//         Geolocation.getCurrentPosition(
//             position => {
//                 const { latitude, longitude } = position.coords;
//                 console.log('📍 User location obtained:', { latitude, longitude });
                
//                 if (isValidCoordinate(latitude, longitude)) {
//                     const userLoc = { latitude, longitude };
//                     setUserLocation(userLoc);
//                     console.log('✅ User location set successfully');
                    
//                     // If this is the first location, fit map to show it
//                     if (mapRef.current && !deliveryLocation) {
//                         setTimeout(() => {
//                             mapRef.current.animateToRegion({
//                                 ...userLoc,
//                                 latitudeDelta: 0.01,
//                                 longitudeDelta: 0.01,
//                             }, 1000);
//                         }, 500);
//                     }
//                 } else {
//                     console.error('❌ Invalid user coordinates:', { latitude, longitude });
//                     Alert.alert('Error', 'Invalid location coordinates received');
//                 }
//                 setLoading(false);
//             },
//             error => {
//                 console.error('❌ Location error:', error);
//                 let errorMessage = 'Failed to get your location. ';
//                 switch(error.code) {
//                     case 1:
//                         errorMessage += 'Permission denied.';
//                         break;
//                     case 2:
//                         errorMessage += 'Position unavailable.';
//                         break;
//                     case 3:
//                         errorMessage += 'Timeout.';
//                         break;
//                     default:
//                         errorMessage += 'Unknown error.';
//                 }
//                 Alert.alert('Location Error', errorMessage);
//                 setLoading(false);
//             },
//             { 
//                 enableHighAccuracy: true, 
//                 timeout: 20000, 
//                 maximumAge: 60000,
//                 showLocationDialog: true,
//                 forceRequestLocation: true
//             }
//         );
//     };

//     const fetchDeliveryLocation = async () => {
//         if (!deliveryBoyId) {
//             console.warn('⚠️ No delivery boy ID provided');
//             // For testing, add dummy delivery location
//             const dummyDeliveryLocation = {
//                 latitude: 28.6139, // Delhi coordinates
//                 longitude: 77.2090,
//                 timestamp: Date.now()
//             };
//             setDeliveryLocation(dummyDeliveryLocation);
//             console.log('🧪 Using dummy delivery location for testing');
//             return;
//         }

//         try {
//             console.log('🚚 Fetching delivery location for ID:', deliveryBoyId);
//             const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 timeout: 10000,
//             });
            
//             if (!res.ok) {
//                 throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//             }
            
//             const data = await res.json();
//             console.log('🔍 API Response:', data);
            
//             if (data.success && data.lat && data.long) {
//                 const lat = parseFloat(data.lat);
//                 const lng = parseFloat(data.long);

//                 console.log('🔍 Parsed coordinates:', { lat, lng });
                
//                 if (isValidCoordinate(lat, lng)) {
//                     const newLocation = {
//                         latitude: lat,
//                         longitude: lng,
//                         timestamp: Date.now()
//                     };
                    
//                     setDeliveryLocation(newLocation);
//                     console.log('✅ Delivery location set successfully');
                    
//                     // Add to tracking path
//                     setTrackingPath(prevPath => {
//                         const lastPoint = prevPath[prevPath.length - 1];
//                         if (!lastPoint || calculateDistance(lastPoint.latitude, lastPoint.longitude, lat, lng) > 0.01) {
//                             const newPath = [...prevPath, newLocation];
//                             console.log('📍 Added tracking point, total:', newPath.length);
//                             return newPath;
//                         }
//                         return prevPath;
//                     });
                    
//                     // Fit map to show both locations
//                     if (mapRef.current && userLocation) {
//                         fitMapToLocations();
//                     }
//                 } else {
//                     console.error('❌ Invalid delivery coordinates:', { lat, lng });
//                 }
//             } else {
//                 console.warn('⚠️ API response missing location data:', data);
//             }
//         } catch (err) {
//             console.error('❌ Fetch delivery location failed:', err);
//             // For testing, add dummy delivery location on error
//             const dummyDeliveryLocation = {
//                 latitude: 28.6139,
//                 longitude: 77.2090,
//                 timestamp: Date.now()
//             };
//             setDeliveryLocation(dummyDeliveryLocation);
//             console.log('🧪 Using dummy delivery location due to API error');
//         }
//     };

//     const fitMapToLocations = () => {
//         if (mapRef.current && userLocation && deliveryLocation) {
//             const coordinates = [userLocation, deliveryLocation];
//             mapRef.current.fitToCoordinates(coordinates, {
//                 edgePadding: { top: 100, right: 100, bottom: 200, left: 100 },
//                 animated: true,
//             });
//         }
//     };

//     const isValidCoordinate = (lat, lng) => {
//         const isValid = (
//             typeof lat === 'number' && typeof lng === 'number' &&
//             !isNaN(lat) && !isNaN(lng) &&
//             lat >= -90 && lat <= 90 &&
//             lng >= -180 && lng <= 180 &&
//             lat !== 0 && lng !== 0
//         );
//         return isValid;
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371;
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a = 
//             Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//         return R * c;
//     };

//     const onMapReady = () => {
//         console.log('🗺️ Map is ready');
//         setMapReady(true);
//         setMapError(null);
        
//         // Fit to locations after map is ready
//         setTimeout(() => {
//             if (userLocation && deliveryLocation) {
//                 fitMapToLocations();
//             }
//         }, 1000);
//     };

//     const onMapError = (error) => {
//         console.error('🗺️ Map Error:', error);
//         setMapError(error);
//     };

//     useEffect(() => {
//         console.log('🚀 Component mounted');
//         getUserCurrentLocation();
//         fetchDeliveryLocation();
        
//         const intervals = [];
        
//         if (isTracking) {
//             // Update delivery location every 10 seconds
//             const deliveryInterval = setInterval(fetchDeliveryLocation, 10000);
//             intervals.push(deliveryInterval);
            
//             // Update user location every 30 seconds
//             const userInterval = setInterval(getUserCurrentLocation, 30000);
//             intervals.push(userInterval);
//         }
        
//         return () => {
//             intervals.forEach(interval => clearInterval(interval));
//         };
//     }, [isTracking]);

//     const distanceBetweenPoints = (userLocation && deliveryLocation) ? calculateDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         deliveryLocation.latitude,
//         deliveryLocation.longitude
//     ) : 0;

//     const shouldShowDirections = deliveryLocation && distanceBetweenPoints > 0.05;

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#406FF3" />
//                 <Text style={styles.loadingText}>Getting your location...</Text>
//             </View>
//         );
//     }

//     if (!userLocation) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <Text style={styles.errorText}>Unable to get your location</Text>
//                 <TouchableOpacity 
//                     style={styles.retryButton}
//                     onPress={() => {
//                         setLoading(true);
//                         getUserCurrentLocation();
//                     }}
//                 >
//                     <Text style={styles.retryButtonText}>Try Again</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     // Calculate initial region
//     const getInitialRegion = () => {
//         if (userLocation && deliveryLocation) {
//             const minLat = Math.min(userLocation.latitude, deliveryLocation.latitude);
//             const maxLat = Math.max(userLocation.latitude, deliveryLocation.latitude);
//             const minLng = Math.min(userLocation.longitude, deliveryLocation.longitude);
//             const maxLng = Math.max(userLocation.longitude, deliveryLocation.longitude);
            
//             const latDelta = Math.max((maxLat - minLat) * 1.5, 0.01);
//             const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.01);
            
//             return {
//                 latitude: (minLat + maxLat) / 2,
//                 longitude: (minLng + maxLng) / 2,
//                 latitudeDelta: latDelta,
//                 longitudeDelta: lngDelta,
//             };
//         }
        
//         return {
//             latitude: userLocation.latitude,
//             longitude: userLocation.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         };
//     };

//     return (
//         <View style={styles.container}>
//             {mapError && (
//                 <View style={styles.errorBanner}>
//                     <Text style={styles.errorBannerText}>Map Error: {mapError.message || 'Unknown error'}</Text>
//                 </View>
//             )}
            
//             <MapView
//                 ref={mapRef}
//                 provider={PROVIDER_GOOGLE} // Force Google Maps
//                 style={styles.map}
//                 initialRegion={getInitialRegion()}
//                 onMapReady={onMapReady}
//                 onError={onMapError}
//                 showsUserLocation={false}
//                 showsMyLocationButton={true}
//                 showsCompass={true}
//                 showsScale={true}
//                 showsBuildings={true}
//                 showsTraffic={false}
//                 showsIndoors={true}
//                 mapType="standard"
//                 loadingEnabled={true}
//                 loadingBackgroundColor="#f5f5f5"
//                 loadingIndicatorColor="#406FF3"
//                 moveOnMarkerPress={false}
//                 pitchEnabled={true}
//                 rotateEnabled={true}
//                 scrollEnabled={true}
//                 zoomEnabled={true}
//             >
//                 {/* User Location Marker */}
//                 {userLocation && (
//                     <>
//                         <Marker
//                             coordinate={userLocation}
//                             title="Your Location"
//                             description={`Distance: ${distanceBetweenPoints.toFixed(2)} km`}
//                             pinColor="blue"
//                             identifier="user-marker"
//                             anchor={{ x: 0.5, y: 0.5 }}
//                         >
//                             <View style={styles.userMarker}>
//                                 <View style={styles.userMarkerInner} />
//                             </View>
//                         </Marker>
                        
//                         <Circle
//                             center={userLocation}
//                             radius={100}
//                             strokeColor="rgba(0, 122, 255, 0.8)"
//                             fillColor="rgba(0, 122, 255, 0.2)"
//                             strokeWidth={2}
//                         />
//                     </>
//                 )}

//                 {/* Delivery Person Marker */}
//                 {deliveryLocation && (
//                     <Marker
//                         coordinate={deliveryLocation}
//                         title="Delivery Person"
//                         description="Current Location"
//                         pinColor="red"
//                         identifier="delivery-marker"
//                         anchor={{ x: 0.5, y: 0.5 }}
//                     >
//                         <View style={styles.deliveryMarker}>
//                             <Text style={styles.deliveryMarkerText}>🚚</Text>
//                         </View>
//                     </Marker>
//                 )}

//                 {/* Tracking Path */}
//                 {trackingPath.length > 1 && (
//                     <Polyline
//                         coordinates={trackingPath}
//                         strokeColor="#FF6B6B"
//                         strokeWidth={3}
//                         lineDashPattern={[10, 5]}
//                         lineJoin="round"
//                         lineCap="round"
//                     />
//                 )}

//                 {/* Route Directions */}
//                 {shouldShowDirections && GOOGLE_MAPS_API_KEY && (
//                     <MapViewDirections
//                         origin={userLocation}
//                         destination={deliveryLocation}
//                         apikey={GOOGLE_MAPS_API_KEY}
//                         strokeWidth={5}
//                         strokeColor="#406FF3"
//                         optimizeWaypoints={true}
//                         mode="DRIVING"
//                         precision="high"
//                         timePrecision="now"
//                         language="en"
//                         onStart={() => {
//                             console.log('🛣️ Starting route calculation...');
//                         }}
//                         onReady={result => {
//                             console.log('✅ Route ready:', result);
//                             setDistance(result.distance);
//                             setDuration(result.duration);
//                         }}
//                         onError={(errorMessage) => {
//                             console.error('❌ Route Error:', errorMessage);
//                             setDistance(distanceBetweenPoints);
//                             setDuration(distanceBetweenPoints * 2);
//                         }}
//                     />
//                 )}

//                 {/* Simple line for close distances or API issues */}
//                 {deliveryLocation && (!shouldShowDirections || !GOOGLE_MAPS_API_KEY) && (
//                     <Polyline
//                         coordinates={[userLocation, deliveryLocation]}
//                         strokeColor="#406FF3"
//                         strokeWidth={4}
//                         lineDashPattern={[5, 10]}
//                         lineJoin="round"
//                         lineCap="round"
//                     />
//                 )}
//             </MapView>
            
//             {/* Info Panel */}
//             <View style={styles.infoContainer}>
//                 <View style={styles.statusRow}>
//                     <Text style={styles.statusText}>
//                         User: {userLocation ? '✅' : '❌'}
//                     </Text>
//                     <Text style={styles.statusText}>
//                         Delivery: {deliveryLocation ? '✅' : '❌'}
//                     </Text>
//                     <Text style={styles.statusText}>
//                         Map: {mapReady ? '✅' : '⏳'}
//                     </Text>
//                 </View>
                
//                 {distanceBetweenPoints > 0 && (
//                     <>
//                         <Text style={styles.infoText}>
//                             Distance: {distance > 0 ? `${distance.toFixed(2)} km` : `${distanceBetweenPoints.toFixed(2)} km`}
//                         </Text>
//                         <Text style={styles.infoText}>
//                             ETA: {duration > 0 ? `${Math.round(duration)} min` : `${Math.round(distanceBetweenPoints * 2)} min`}
//                         </Text>
//                     </>
//                 )}
                
//                 <Text style={styles.trackingText}>
//                     Tracking Points: {trackingPath.length}
//                 </Text>
//             </View>
            
//             {/* Control Buttons */}
//             <View style={styles.controlContainer}>
//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: isTracking ? '#FF6B6B' : '#4CAF50' }]}
//                     onPress={() => setIsTracking(!isTracking)}
//                 >
//                     <Text style={styles.controlButtonText}>
//                         {isTracking ? 'Stop' : 'Start'}
//                     </Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: '#FF9800' }]}
//                     onPress={() => setTrackingPath([])}
//                 >
//                     <Text style={styles.controlButtonText}>Clear</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                     style={[styles.controlButton, { backgroundColor: '#2196F3' }]}
//                     onPress={() => {
//                         getUserCurrentLocation();
//                         fetchDeliveryLocation();
//                         setTimeout(fitMapToLocations, 1000);
//                     }}
//                 >
//                     <Text style={styles.controlButtonText}>Refresh</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { 
//         flex: 1,
//         backgroundColor: '#000'
//     },
//     map: { 
//         flex: 1,
//         minHeight: 300,
//         width: '100%'
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5',
//         padding: 20,
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#666',
//     },
//     errorText: {
//         fontSize: 18,
//         color: '#d32f2f',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     errorBanner: {
//         backgroundColor: '#ffebee',
//         padding: 10,
//         borderLeftWidth: 4,
//         borderLeftColor: '#f44336',
//     },
//     errorBannerText: {
//         color: '#d32f2f',
//         fontSize: 14,
//     },
//     retryButton: {
//         backgroundColor: '#406FF3',
//         paddingHorizontal: 30,
//         paddingVertical: 15,
//         borderRadius: 25,
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//     },
//     retryButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     infoContainer: {
//         position: 'absolute',
//         top: 50,
//         left: 15,
//         right: 15,
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         padding: 15,
//         borderRadius: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     statusRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     statusText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#333',
//     },
//     infoText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 5,
//     },
//     trackingText: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#FF6B6B',
//     },
//     controlContainer: {
//         position: 'absolute',
//         bottom: 30,
//         left: 15,
//         right: 15,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     controlButton: {
//         flex: 1,
//         paddingVertical: 12,
//         paddingHorizontal: 10,
//         borderRadius: 20,
//         marginHorizontal: 5,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     controlButtonText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     userMarker: {
//         width: 20,
//         height: 20,
//         backgroundColor: '#4285F4',
//         borderRadius: 10,
//         borderWidth: 3,
//         borderColor: 'white',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 3,
//         elevation: 5,
//     },
//     userMarkerInner: {
//         width: 8,
//         height: 8,
//         backgroundColor: 'white',
//         borderRadius: 4,
//         alignSelf: 'center',
//         marginTop: 3,
//     },
//     deliveryMarker: {
//         width: 40,
//         height: 40,
//         backgroundColor: '#FF4444',
//         borderRadius: 20,
//         borderWidth: 3,
//         borderColor: 'white',
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 3,
//         elevation: 5,
//     },
//     deliveryMarkerText: {
//         fontSize: 20,
//     },
// });

// export default MapScreen;


import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = ({ route }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trackingPath, setTrackingPath] = useState([]);
    const [isTracking, setIsTracking] = useState(true);
    const [mapReady, setMapReady] = useState(false);
    const [mapError, setMapError] = useState(null);
    
    const mapRef = useRef(null);
    const intervalsRef = useRef([]);
    const deliveryBoyId = route?.params?.deliveryBoyId;
    
    // Replace with your Google Maps API key
    const GOOGLE_MAPS_API_KEY = 'AIzaSyAhaadbz8YSCMTUthhoWw_SCldMKGZEv5E';

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to location to show your position on the map.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const getUserCurrentLocation = async () => {
        try {
            console.log('🔍 Getting user location...');
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Location permission is required');
                setLoading(false);
                return;
            }

            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    console.log('📍 User location obtained:', { latitude, longitude });
                    
                    if (isValidCoordinate(latitude, longitude)) {
                        const userLoc = { latitude, longitude };
                        setUserLocation(userLoc);
                        console.log('✅ User location set successfully');
                        
                        // If this is the first location, fit map to show it
                        if (mapRef.current && !deliveryLocation) {
                            setTimeout(() => {
                                try {
                                    mapRef.current?.animateToRegion({
                                        ...userLoc,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }, 1000);
                                } catch (error) {
                                    console.error('Error animating to region:', error);
                                }
                            }, 500);
                        }
                    } else {
                        console.error('❌ Invalid user coordinates:', { latitude, longitude });
                        Alert.alert('Error', 'Invalid location coordinates received');
                    }
                    setLoading(false);
                },
                error => {
                    console.error('❌ Location error:', error);
                    let errorMessage = 'Failed to get your location. ';
                    switch(error.code) {
                        case 1:
                            errorMessage += 'Permission denied.';
                            break;
                        case 2:
                            errorMessage += 'Position unavailable.';
                            break;
                        case 3:
                            errorMessage += 'Timeout.';
                            break;
                        default:
                            errorMessage += 'Unknown error.';
                    }
                    Alert.alert('Location Error', errorMessage);
                    setLoading(false);
                },
                { 
                    enableHighAccuracy: true, 
                    timeout: 20000, 
                    maximumAge: 60000,
                    showLocationDialog: true,
                    forceRequestLocation: true
                }
            );
        } catch (error) {
            console.error('Error in getUserCurrentLocation:', error);
            setLoading(false);
        }
    };

    const fetchDeliveryLocation = async () => {
        try {
            if (!deliveryBoyId) {
                console.warn('⚠️ No delivery boy ID provided');
                // For testing, add dummy delivery location
                const dummyDeliveryLocation = {
                    latitude: 28.6139, // Delhi coordinates
                    longitude: 77.2090,
                    timestamp: Date.now()
                };
                setDeliveryLocation(dummyDeliveryLocation);
                console.log('🧪 Using dummy delivery location for testing');
                return;
            }

            console.log('🚚 Fetching delivery location for ID:', deliveryBoyId);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            
            const data = await res.json();
            console.log('🔍 API Response:', data);
            
            if (data.success && data.lat && data.long) {
                const lat = parseFloat(data.lat);
                const lng = parseFloat(data.long);

                console.log('🔍 Parsed coordinates:', { lat, lng });
                
                if (isValidCoordinate(lat, lng)) {
                    const newLocation = {
                        latitude: lat,
                        longitude: lng,
                        timestamp: Date.now()
                    };
                    
                    setDeliveryLocation(newLocation);
                    console.log('✅ Delivery location set successfully');
                    
                    // Add to tracking path
                    setTrackingPath(prevPath => {
                        const lastPoint = prevPath[prevPath.length - 1];
                        if (!lastPoint || calculateDistance(lastPoint.latitude, lastPoint.longitude, lat, lng) > 0.01) {
                            const newPath = [...prevPath, newLocation];
                            console.log('📍 Added tracking point, total:', newPath.length);
                            return newPath;
                        }
                        return prevPath;
                    });
                    
                    // Fit map to show both locations
                    if (mapRef.current && userLocation) {
                        setTimeout(fitMapToLocations, 1000);
                    }
                } else {
                    console.error('❌ Invalid delivery coordinates:', { lat, lng });
                }
            } else {
                console.warn('⚠️ API response missing location data:', data);
            }
        } catch (err) {
            console.error('❌ Fetch delivery location failed:', err);
            // For testing, add dummy delivery location on error
            const dummyDeliveryLocation = {
                latitude: 28.6139,
                longitude: 77.2090,
                timestamp: Date.now()
            };
            setDeliveryLocation(dummyDeliveryLocation);
            console.log('🧪 Using dummy delivery location due to API error');
        }
    };

    const fitMapToLocations = () => {
        try {
            if (mapRef.current && userLocation && deliveryLocation) {
                const coordinates = [userLocation, deliveryLocation];
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 100, right: 100, bottom: 200, left: 100 },
                    animated: true,
                });
            }
        } catch (error) {
            console.error('Error fitting map to locations:', error);
        }
    };

    const isValidCoordinate = (lat, lng) => {
        const isValid = (
            typeof lat === 'number' && typeof lng === 'number' &&
            !isNaN(lat) && !isNaN(lng) &&
            lat >= -90 && lat <= 90 &&
            lng >= -180 && lng <= 180 &&
            lat !== 0 && lng !== 0
        );
        return isValid;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const onMapReady = () => {
        console.log('🗺️ Map is ready');
        setMapReady(true);
        setMapError(null);
        
        // Fit to locations after map is ready
        setTimeout(() => {
            if (userLocation && deliveryLocation) {
                fitMapToLocations();
            }
        }, 1000);
    };

    const onMapError = (error) => {
        console.error('🗺️ Map Error:', error);
        setMapError(error);
    };

    // Cleanup intervals
    const clearIntervals = () => {
        intervalsRef.current.forEach(interval => clearInterval(interval));
        intervalsRef.current = [];
    };

    useEffect(() => {
        console.log('🚀 Component mounted');
        getUserCurrentLocation();
        fetchDeliveryLocation();
        
        if (isTracking) {
            // Update delivery location every 10 seconds
            const deliveryInterval = setInterval(() => {
                fetchDeliveryLocation();
            }, 10000);
            intervalsRef.current.push(deliveryInterval);
            
            // Update user location every 30 seconds
            const userInterval = setInterval(() => {
                getUserCurrentLocation();
            }, 30000);
            intervalsRef.current.push(userInterval);
        }
        
        return () => {
            clearIntervals();
        };
    }, [isTracking]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearIntervals();
        };
    }, []);

    const distanceBetweenPoints = (userLocation && deliveryLocation) ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        deliveryLocation.latitude,
        deliveryLocation.longitude
    ) : 0;

    const shouldShowDirections = deliveryLocation && distanceBetweenPoints > 0.05;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#406FF3" />
                <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
        );
    }

    if (!userLocation) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Unable to get your location</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                        setLoading(true);
                        getUserCurrentLocation();
                    }}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Calculate initial region with safety checks
    const getInitialRegion = () => {
        if (userLocation && deliveryLocation) {
            const minLat = Math.min(userLocation.latitude, deliveryLocation.latitude);
            const maxLat = Math.max(userLocation.latitude, deliveryLocation.latitude);
            const minLng = Math.min(userLocation.longitude, deliveryLocation.longitude);
            const maxLng = Math.max(userLocation.longitude, deliveryLocation.longitude);
            
            const latDelta = Math.max((maxLat - minLat) * 1.5, 0.01);
            const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.01);
            
            return {
                latitude: (minLat + maxLat) / 2,
                longitude: (minLng + maxLng) / 2,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta,
            };
        }
        
        return {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    };

    return (
        <View style={styles.container}>
            {mapError && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>Map Error: {mapError.message || 'Unknown error'}</Text>
                </View>
            )}
            
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={getInitialRegion()}
                onMapReady={onMapReady}
                onError={onMapError}
                showsUserLocation={false}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                showsBuildings={true}
                showsTraffic={false}
                showsIndoors={true}
                mapType="standard"
                loadingEnabled={true}
                loadingBackgroundColor="#f5f5f5"
                loadingIndicatorColor="#406FF3"
                moveOnMarkerPress={false}
                pitchEnabled={true}
                rotateEnabled={true}
                scrollEnabled={true}
                zoomEnabled={true}
            >
                {/* User Location Marker */}
                {userLocation && (
                    <>
                        <Marker
                            coordinate={userLocation}
                            title="Your Location"
                            description={`Distance: ${distanceBetweenPoints.toFixed(2)} km`}
                            pinColor="blue"
                            identifier="user-marker"
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={styles.userMarker}>
                                <View style={styles.userMarkerInner} />
                            </View>
                        </Marker>
                        
                        <Circle
                            center={userLocation}
                            radius={100}
                            strokeColor="rgba(0, 122, 255, 0.8)"
                            fillColor="rgba(0, 122, 255, 0.2)"
                            strokeWidth={2}
                        />
                    </>
                )}

                {/* Delivery Person Marker */}
                {deliveryLocation && (
                    <Marker
                        coordinate={deliveryLocation}
                        title="Delivery Person"
                        description="Current Location"
                        pinColor="red"
                        identifier="delivery-marker"
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={styles.deliveryMarker}>
                            <Text style={styles.deliveryMarkerText}>🚚</Text>
                        </View>
                    </Marker>
                )}

                {/* Tracking Path */}
                {trackingPath.length > 1 && (
                    <Polyline
                        coordinates={trackingPath}
                        strokeColor="#FF6B6B"
                        strokeWidth={3}
                        lineDashPattern={[10, 5]}
                        lineJoin="round"
                        lineCap="round"
                    />
                )}

                {/* Route Directions */}
                {shouldShowDirections && GOOGLE_MAPS_API_KEY && (
                    <MapViewDirections
                        origin={userLocation}
                        destination={deliveryLocation}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeWidth={5}
                        strokeColor="#406FF3"
                        optimizeWaypoints={true}
                        mode="DRIVING"
                        precision="high"
                        timePrecision="now"
                        language="en"
                        onStart={() => {
                            console.log('🛣️ Starting route calculation...');
                        }}
                        onReady={result => {
                            console.log('✅ Route ready:', result);
                            setDistance(result.distance);
                            setDuration(result.duration);
                        }}
                        onError={(errorMessage) => {
                            console.error('❌ Route Error:', errorMessage);
                            setDistance(distanceBetweenPoints);
                            setDuration(distanceBetweenPoints * 2);
                        }}
                    />
                )}

                {/* Simple line for close distances or API issues */}
                {deliveryLocation && (!shouldShowDirections || !GOOGLE_MAPS_API_KEY) && (
                    <Polyline
                        coordinates={[userLocation, deliveryLocation]}
                        strokeColor="#406FF3"
                        strokeWidth={4}
                        lineDashPattern={[5, 10]}
                        lineJoin="round"
                        lineCap="round"
                    />
                )}
            </MapView>
            
            {/* Info Panel */}
            <View style={styles.infoContainer}>
                <View style={styles.statusRow}>
                    <Text style={styles.statusText}>
                        User: {userLocation ? '✅' : '❌'}
                    </Text>
                    <Text style={styles.statusText}>
                        Delivery: {deliveryLocation ? '✅' : '❌'}
                    </Text>
                    <Text style={styles.statusText}>
                        Map: {mapReady ? '✅' : '⏳'}
                    </Text>
                </View>
                
                {distanceBetweenPoints > 0 && (
                    <>
                        <Text style={styles.infoText}>
                            Distance: {distance > 0 ? `${distance.toFixed(2)} km` : `${distanceBetweenPoints.toFixed(2)} km`}
                        </Text>
                        <Text style={styles.infoText}>
                            ETA: {duration > 0 ? `${Math.round(duration)} min` : `${Math.round(distanceBetweenPoints * 2)} min`}
                        </Text>
                    </>
                )}
                
                <Text style={styles.trackingText}>
                    Tracking Points: {trackingPath.length}
                </Text>
            </View>
            
            {/* Control Buttons */}
            <View style={styles.controlContainer}>
                <TouchableOpacity 
                    style={[styles.controlButton, { backgroundColor: isTracking ? '#FF6B6B' : '#4CAF50' }]}
                    onPress={() => {
                        setIsTracking(!isTracking);
                        if (!isTracking) {
                            clearIntervals();
                        }
                    }}
                >
                    <Text style={styles.controlButtonText}>
                        {isTracking ? 'Stop' : 'Start'}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.controlButton, { backgroundColor: '#FF9800' }]}
                    onPress={() => setTrackingPath([])}
                >
                    <Text style={styles.controlButtonText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.controlButton, { backgroundColor: '#2196F3' }]}
                    onPress={() => {
                        getUserCurrentLocation();
                        fetchDeliveryLocation();
                        setTimeout(fitMapToLocations, 1000);
                    }}
                >
                    <Text style={styles.controlButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#000'
    },
    map: { 
        flex: 1,
        minHeight: 300,
        width: '100%'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 18,
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 20,
    },
    errorBanner: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorBannerText: {
        color: '#d32f2f',
        fontSize: 14,
    },
    retryButton: {
        backgroundColor: '#406FF3',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    infoContainer: {
        position: 'absolute',
        top: 50,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    infoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    trackingText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FF6B6B',
    },
    controlContainer: {
        position: 'absolute',
        bottom: 30,
        left: 15,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controlButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    controlButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    userMarker: {
        width: 20,
        height: 20,
        backgroundColor: '#4285F4',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    userMarkerInner: {
        width: 8,
        height: 8,
        backgroundColor: 'white',
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 3,
    },
    deliveryMarker: {
        width: 40,
        height: 40,
        backgroundColor: '#FF4444',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    deliveryMarkerText: {
        fontSize: 20,
    },
});

export default MapScreen;