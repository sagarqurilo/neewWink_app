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
//     const intervalsRef = useRef([]);
//     const deliveryBoyId = route?.params?.deliveryBoyId;
    
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
//         try {
//             console.log('🔍 Getting user location...');
//             const hasPermission = await requestLocationPermission();
//             if (!hasPermission) {
//                 Alert.alert('Permission Denied', 'Location permission is required');
//                 setLoading(false);
//                 return;
//             }

//             Geolocation.getCurrentPosition(
//                 position => {
//                     const { latitude, longitude } = position.coords;
//                     console.log('📍 User location obtained:', { latitude, longitude });
                    
//                     if (isValidCoordinate(latitude, longitude)) {
//                         const userLoc = { latitude, longitude };
//                         setUserLocation(userLoc);
//                         console.log('✅ User location set successfully');
                        
//                         // If this is the first location, fit map to show it
//                         if (mapRef.current && !deliveryLocation) {
//                             setTimeout(() => {
//                                 try {
//                                     mapRef.current?.animateToRegion({
//                                         ...userLoc,
//                                         latitudeDelta: 0.01,
//                                         longitudeDelta: 0.01,
//                                     }, 1000);
//                                 } catch (error) {
//                                     console.error('Error animating to region:', error);
//                                 }
//                             }, 500);
//                         }
//                     } else {
//                         console.error('❌ Invalid user coordinates:', { latitude, longitude });
//                         Alert.alert('Error', 'Invalid location coordinates received');
//                     }
//                     setLoading(false);
//                 },
//                 error => {
//                     console.error('❌ Location error:', error);
//                     let errorMessage = 'Failed to get your location. ';
//                     switch(error.code) {
//                         case 1:
//                             errorMessage += 'Permission denied.';
//                             break;
//                         case 2:
//                             errorMessage += 'Position unavailable.';
//                             break;
//                         case 3:
//                             errorMessage += 'Timeout.';
//                             break;
//                         default:
//                             errorMessage += 'Unknown error.';
//                     }
//                     Alert.alert('Location Error', errorMessage);
//                     setLoading(false);
//                 },
//                 { 
//                     enableHighAccuracy: true, 
//                     timeout: 20000, 
//                     maximumAge: 60000,
//                     showLocationDialog: true,
//                     forceRequestLocation: true
//                 }
//             );
//         } catch (error) {
//             console.error('Error in getUserCurrentLocation:', error);
//             setLoading(false);
//         }
//     };

//     const fetchDeliveryLocation = async () => {
//         try {
//             if (!deliveryBoyId) {
//                 console.warn('⚠️ No delivery boy ID provided');
//                 // For testing, add dummy delivery location
//                 const dummyDeliveryLocation = {
//                     latitude: 28.6139, // Delhi coordinates
//                     longitude: 77.2090,
//                     timestamp: Date.now()
//                 };
//                 setDeliveryLocation(dummyDeliveryLocation);
//                 console.log('🧪 Using dummy delivery location for testing');
//                 return;
//             }

//             console.log('🚚 Fetching delivery location for ID:', deliveryBoyId);
            
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 10000);
            
//             const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 signal: controller.signal,
//             });
            
//             clearTimeout(timeoutId);
            
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
//                         setTimeout(fitMapToLocations, 1000);
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
//         try {
//             if (mapRef.current && userLocation && deliveryLocation) {
//                 const coordinates = [userLocation, deliveryLocation];
//                 mapRef.current.fitToCoordinates(coordinates, {
//                     edgePadding: { top: 100, right: 100, bottom: 200, left: 100 },
//                     animated: true,
//                 });
//             }
//         } catch (error) {
//             console.error('Error fitting map to locations:', error);
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

//     // Cleanup intervals
//     const clearIntervals = () => {
//         intervalsRef.current.forEach(interval => clearInterval(interval));
//         intervalsRef.current = [];
//     };

//     useEffect(() => {
//         console.log('🚀 Component mounted');
//         getUserCurrentLocation();
//         fetchDeliveryLocation();
        
//         if (isTracking) {
//             // Update delivery location every 10 seconds
//             const deliveryInterval = setInterval(() => {
//                 fetchDeliveryLocation();
//             }, 10000);
//             intervalsRef.current.push(deliveryInterval);
            
//             // Update user location every 30 seconds
//             const userInterval = setInterval(() => {
//                 getUserCurrentLocation();
//             }, 30000);
//             intervalsRef.current.push(userInterval);
//         }
        
//         return () => {
//             clearIntervals();
//         };
//     }, [isTracking]);

//     // Cleanup on unmount
//     useEffect(() => {
//         return () => {
//             clearIntervals();
//         };
//     }, []);

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

//     // Calculate initial region with safety checks
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
//                 provider={PROVIDER_GOOGLE}
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
//                     onPress={() => {
//                         setIsTracking(!isTracking);
//                         if (!isTracking) {
//                             clearIntervals();
//                         }
//                     }}
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




// import React, { useEffect, useState, useRef, useCallback } from 'react';
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
//     const intervalsRef = useRef([]);
//     const isMountedRef = useRef(true);
//     const deliveryBoyId = route?.params?.deliveryBoyId;
    
//     // Replace with your Google Maps API key
//     const GOOGLE_MAPS_API_KEY = 'AIzaSyAhaadbz8YSCMTUthhoWw_SCldMKGZEv5E';

//     // Cleanup function
//     const cleanup = useCallback(() => {
//         isMountedRef.current = false;
//         intervalsRef.current.forEach(interval => {
//             if (interval) clearInterval(interval);
//         });
//         intervalsRef.current = [];
//     }, []);

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

//     const getUserCurrentLocation = useCallback(async () => {
//         if (!isMountedRef.current) return;
        
//         try {
//             console.log('🔍 Getting user location...');
//             const hasPermission = await requestLocationPermission();
//             if (!hasPermission) {
//                 Alert.alert('Permission Denied', 'Location permission is required');
//                 if (isMountedRef.current) setLoading(false);
//                 return;
//             }

//             Geolocation.getCurrentPosition(
//                 position => {
//                     if (!isMountedRef.current) return;
                    
//                     const { latitude, longitude } = position.coords;
//                     console.log('📍 User location obtained:', { latitude, longitude });
                    
//                     if (isValidCoordinate(latitude, longitude)) {
//                         const userLoc = { latitude, longitude };
//                         setUserLocation(userLoc);
//                         console.log('✅ User location set successfully');
                        
//                         // If this is the first location, fit map to show it
//                         if (mapRef.current && !deliveryLocation && mapReady) {
//                             setTimeout(() => {
//                                 if (!isMountedRef.current || !mapRef.current) return;
//                                 try {
//                                     mapRef.current.animateToRegion({
//                                         ...userLoc,
//                                         latitudeDelta: 0.01,
//                                         longitudeDelta: 0.01,
//                                     }, 1000);
//                                 } catch (error) {
//                                     console.error('Error animating to region:', error);
//                                 }
//                             }, 500);
//                         }
//                     } else {
//                         console.error('❌ Invalid user coordinates:', { latitude, longitude });
//                         Alert.alert('Error', 'Invalid location coordinates received');
//                     }
//                     if (isMountedRef.current) setLoading(false);
//                 },
//                 error => {
//                     if (!isMountedRef.current) return;
                    
//                     console.error('❌ Location error:', error);
//                     let errorMessage = 'Failed to get your location. ';
//                     switch(error.code) {
//                         case 1:
//                             errorMessage += 'Permission denied.';
//                             break;
//                         case 2:
//                             errorMessage += 'Position unavailable.';
//                             break;
//                         case 3:
//                             errorMessage += 'Timeout.';
//                             break;
//                         default:
//                             errorMessage += 'Unknown error.';
//                     }
//                     Alert.alert('Location Error', errorMessage);
//                     setLoading(false);
//                 },
//                 { 
//                     enableHighAccuracy: true, 
//                     timeout: 15000, // Reduced timeout
//                     maximumAge: 60000,
//                     showLocationDialog: true,
//                     forceRequestLocation: true
//                 }
//             );
//         } catch (error) {
//             console.error('Error in getUserCurrentLocation:', error);
//             if (isMountedRef.current) setLoading(false);
//         }
//     }, [deliveryLocation, mapReady]);

//     const fetchDeliveryLocation = useCallback(async () => {
//         if (!isMountedRef.current) return;
        
//         try {
//             if (!deliveryBoyId) {
//                 console.warn('⚠️ No delivery boy ID provided');
//                 // For testing, add dummy delivery location
//                 const dummyDeliveryLocation = {
//                     latitude: 28.6139, // Delhi coordinates
//                     longitude: 77.2090,
//                     timestamp: Date.now()
//                 };
//                 if (isMountedRef.current) {
//                     setDeliveryLocation(dummyDeliveryLocation);
//                 }
//                 console.log('🧪 Using dummy delivery location for testing');
//                 return;
//             }

//             console.log('🚚 Fetching delivery location for ID:', deliveryBoyId);
            
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout
            
//             const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 signal: controller.signal,
//             });
            
//             clearTimeout(timeoutId);
            
//             if (!isMountedRef.current) return;
            
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
                    
//                     if (isMountedRef.current) {
//                         setDeliveryLocation(newLocation);
//                         console.log('✅ Delivery location set successfully');
                        
//                         // Add to tracking path
//                         setTrackingPath(prevPath => {
//                             const lastPoint = prevPath[prevPath.length - 1];
//                             if (!lastPoint || calculateDistance(lastPoint.latitude, lastPoint.longitude, lat, lng) > 0.01) {
//                                 const newPath = [...prevPath, newLocation];
//                                 console.log('📍 Added tracking point, total:', newPath.length);
//                                 return newPath;
//                             }
//                             return prevPath;
//                         });
//                     }
//                 } else {
//                     console.error('❌ Invalid delivery coordinates:', { lat, lng });
//                 }
//             } else {
//                 console.warn('⚠️ API response missing location data:', data);
//             }
//         } catch (err) {
//             if (!isMountedRef.current) return;
            
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
//     }, [deliveryBoyId]);

//     const fitMapToLocations = useCallback(() => {
//         if (!isMountedRef.current) return;
        
//         try {
//             if (mapRef.current && userLocation && deliveryLocation && mapReady) {
//                 const coordinates = [userLocation, deliveryLocation];
//                 mapRef.current.fitToCoordinates(coordinates, {
//                     edgePadding: { top: 100, right: 100, bottom: 200, left: 100 },
//                     animated: true,
//                 });
//             }
//         } catch (error) {
//             console.error('Error fitting map to locations:', error);
//         }
//     }, [userLocation, deliveryLocation, mapReady]);

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

//     const onMapReady = useCallback(() => {
//         if (!isMountedRef.current) return;
        
//         console.log('🗺️ Map is ready');
//         setMapReady(true);
//         setMapError(null);
        
//         // Fit to locations after map is ready
//         setTimeout(() => {
//             if (isMountedRef.current && userLocation && deliveryLocation) {
//                 fitMapToLocations();
//             }
//         }, 1000);
//     }, [userLocation, deliveryLocation, fitMapToLocations]);

//     const onMapError = useCallback((error) => {
//         if (!isMountedRef.current) return;
        
//         console.error('🗺️ Map Error:', error);
//         setMapError(error);
//     }, []);

//     // Main effect for initialization and tracking
//     useEffect(() => {
//         isMountedRef.current = true;
//         console.log('🚀 Component mounted');
        
//         getUserCurrentLocation();
//         fetchDeliveryLocation();
        
//         return cleanup;
//     }, []);

//     // Separate effect for tracking intervals
//     useEffect(() => {
//         if (!isTracking || !isMountedRef.current) {
//             cleanup();
//             return;
//         }

//         // Update delivery location every 10 seconds
//         const deliveryInterval = setInterval(() => {
//             if (isMountedRef.current) {
//                 fetchDeliveryLocation();
//             }
//         }, 10000);
//         intervalsRef.current.push(deliveryInterval);
        
//         // Update user location every 30 seconds
//         const userInterval = setInterval(() => {
//             if (isMountedRef.current) {
//                 getUserCurrentLocation();
//             }
//         }, 30000);
//         intervalsRef.current.push(userInterval);
        
//         return () => {
//             cleanup();
//         };
//     }, [isTracking, fetchDeliveryLocation, getUserCurrentLocation]);

//     const distanceBetweenPoints = (userLocation && deliveryLocation) ? calculateDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         deliveryLocation.latitude,
//         deliveryLocation.longitude
//     ) : 0;

//     const shouldShowDirections = deliveryLocation && distanceBetweenPoints > 0.05;

//     // Calculate initial region with safety checks
//     const getInitialRegion = useCallback(() => {
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
        
//         if (userLocation) {
//             return {
//                 latitude: userLocation.latitude,
//                 longitude: userLocation.longitude,
//                 latitudeDelta: 0.01,
//                 longitudeDelta: 0.01,
//             };
//         }

//         // Default fallback region
//         return {
//             latitude: 28.6139,
//             longitude: 77.2090,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//         };
//     }, [userLocation, deliveryLocation]);

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

//     return (
//         <View style={styles.container}>
//             {mapError && (
//                 <View style={styles.errorBanner}>
//                     <Text style={styles.errorBannerText}>Map Error: {mapError.message || 'Unknown error'}</Text>
//                 </View>
//             )}
            
//             <MapView
//                 ref={mapRef}
//                 provider={PROVIDER_GOOGLE}
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
//                 {shouldShowDirections && GOOGLE_MAPS_API_KEY && mapReady && (
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
//                             if (!isMountedRef.current) return;
//                             console.log('✅ Route ready:', result);
//                             setDistance(result.distance);
//                             setDuration(result.duration);
//                         }}
//                         onError={(errorMessage) => {
//                             if (!isMountedRef.current) return;
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
//                     onPress={() => {
//                         setIsTracking(!isTracking);
//                     }}
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
//                         setTimeout(() => {
//                             if (isMountedRef.current) {
//                                 fitMapToLocations();
//                             }
//                         }, 1000);
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




























// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Text, Alert } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';

// const MapScreen = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [pickupLocation, setPickupLocation] = useState(null);
//   const [dropoffLocation, setDropoffLocation] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   const getCurrentLocation = () => {
//     console.log('Getting current location...');
    
//     Geolocation.getCurrentPosition(
//       (position) => {
//         console.log('Location received:', position);
//         const { latitude, longitude } = position.coords;
//         const location = { latitude, longitude };
//         setCurrentLocation(location);
//         setPickupLocation(location); // Set as default pickup
//         setLoading(false);
//       },
//       (error) => {
//         console.log('Location error:', error);
//         Alert.alert('Location Error', error.message);
//         setLoading(false);
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 15000,
//         maximumAge: 10000,
//       }
//     );
//   };

//   const handleMapPress = (event) => {
//     console.log('Map pressed:', event.nativeEvent.coordinate);
//     const coordinate = event.nativeEvent.coordinate;
    
//     if (!dropoffLocation) {
//       setDropoffLocation(coordinate);
//       console.log('Dropoff location set:', coordinate);
//     } else {
//       // Reset and set new dropoff
//       setDropoffLocation(coordinate);
//       console.log('Dropoff location updated:', coordinate);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Step 4: Getting location...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text>Step 4: Tap map to set dropoff location</Text>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: currentLocation?.latitude || 37.78825,
//           longitude: currentLocation?.longitude || -122.4324,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         onPress={handleMapPress}
//       >
//         {/* Current Location Marker */}
//         {currentLocation && (
//           <Marker
//             coordinate={currentLocation}
//             title="Your Location"
//             description="Current position"
//             pinColor="blue"
//           />
//         )}
        
//         {/* Pickup Location Marker */}
//         {pickupLocation && (
//           <Marker
//             coordinate={pickupLocation}
//             title="Pickup Location"
//             description="Ride starts here"
//             pinColor="green"
//           />
//         )}
        
//         {/* Dropoff Location Marker */}
//         {dropoffLocation && (
//           <Marker
//             coordinate={dropoffLocation}
//             title="Dropoff Location"
//             description="Ride ends here"
//             pinColor="red"
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default MapScreen;




















































import React, { useEffect, useState, useRef, useCallback } from 'react';
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
    const [locationError, setLocationError] = useState(null);
    
    const mapRef = useRef(null);
    const intervalsRef = useRef([]);
    const isMountedRef = useRef(true);
    const watchIdRef = useRef(null);
    const deliveryBoyId = route?.params?.deliveryBoyId;
    
    // Replace with your Google Maps API key
    const GOOGLE_MAPS_API_KEY = 'AIzaSyAhaadbz8YSCMTUthhoWw_SCldMKGZEv5E';

    // Cleanup function
    const cleanup = useCallback(() => {
        isMountedRef.current = false;
        intervalsRef.current.forEach(interval => {
            if (interval) clearInterval(interval);
        });
        intervalsRef.current = [];
        
        // Clear location watch
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    // Enhanced permission request for Android
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                // Request both FINE and COARSE location permissions
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ];

                const granted = await PermissionsAndroid.requestMultiple(permissions);
                
                const fineLocationGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
                const coarseLocationGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
                
                console.log('Permission results:', { fineLocationGranted, coarseLocationGranted });
                
                return fineLocationGranted || coarseLocationGranted;
            } catch (err) {
                console.warn('Permission request error:', err);
                return false;
            }
        }
        return true;
    };

    // Alternative location method using watchPosition
    const startLocationWatch = useCallback(async () => {
        if (!isMountedRef.current) return;
        
        try {
            console.log('🔍 Starting location watch...');
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                setLocationError('Location permission denied');
                Alert.alert('Permission Denied', 'Location permission is required to show your position');
                if (isMountedRef.current) setLoading(false);
                return;
            }

            // Clear any existing watch
            if (watchIdRef.current !== null) {
                Geolocation.clearWatch(watchIdRef.current);
            }

            watchIdRef.current = Geolocation.watchPosition(
                position => {
                    if (!isMountedRef.current) return;
                    
                    const { latitude, longitude, accuracy } = position.coords;
                    console.log('📍 Location update:', { latitude, longitude, accuracy });
                    
                    if (isValidCoordinate(latitude, longitude)) {
                        const userLoc = { latitude, longitude };
                        setUserLocation(userLoc);
                        setLocationError(null);
                        console.log('✅ User location updated successfully');
                        
                        // Only set loading to false on first successful location
                        if (loading) {
                            setLoading(false);
                        }
                        
                        // Fit map to show location on first update
                        if (mapRef.current && mapReady && loading) {
                            setTimeout(() => {
                                if (!isMountedRef.current || !mapRef.current) return;
                                try {
                                    mapRef.current.animateToRegion({
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
                        console.error('❌ Invalid coordinates:', { latitude, longitude });
                    }
                },
                error => {
                    if (!isMountedRef.current) return;
                    
                    console.error('❌ Location watch error:', error);
                    let errorMessage = 'Location error: ';
                    switch(error.code) {
                        case 1:
                            errorMessage += 'Permission denied. Please enable location permissions.';
                            break;
                        case 2:
                            errorMessage += 'Position unavailable. Please check GPS settings.';
                            break;
                        case 3:
                            errorMessage += 'Location timeout. Trying again...';
                            break;
                        default:
                            errorMessage += 'Unknown error occurred.';
                    }
                    
                    setLocationError(errorMessage);
                    
                    // Only show alert for permission errors, not timeouts
                    if (error.code === 1) {
                        Alert.alert('Location Error', errorMessage);
                    }
                    
                    // Try fallback method for timeouts
                    if (error.code === 3) {
                        setTimeout(() => {
                            if (isMountedRef.current) {
                                getUserCurrentLocationFallback();
                            }
                        }, 2000);
                    }
                    
                    if (loading) {
                        setLoading(false);
                    }
                },
                { 
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 10000,
                    distanceFilter: 10, // Only update if moved 10 meters
                    showLocationDialog: true,
                    forceRequestLocation: true
                }
            );
            
            console.log('📱 Location watch started with ID:', watchIdRef.current);
            
        } catch (error) {
            console.error('Error starting location watch:', error);
            setLocationError(`Failed to start location tracking: ${error.message}`);
            if (isMountedRef.current) setLoading(false);
        }
    }, [loading, mapReady]);

    // Fallback method using getCurrentPosition with different settings
    const getUserCurrentLocationFallback = useCallback(async () => {
        if (!isMountedRef.current) return;
        
        try {
            console.log('🔄 Trying fallback location method...');
            
            Geolocation.getCurrentPosition(
                position => {
                    if (!isMountedRef.current) return;
                    
                    const { latitude, longitude } = position.coords;
                    console.log('📍 Fallback location obtained:', { latitude, longitude });
                    
                    if (isValidCoordinate(latitude, longitude)) {
                        const userLoc = { latitude, longitude };
                        setUserLocation(userLoc);
                        setLocationError(null);
                        console.log('✅ Fallback location set successfully');
                        
                        if (loading) {
                            setLoading(false);
                        }
                    }
                },
                error => {
                    console.error('❌ Fallback location error:', error);
                    setLocationError('Unable to get location. Please check GPS settings.');
                    if (loading) {
                        setLoading(false);
                    }
                },
                { 
                    enableHighAccuracy: false, // Use network location
                    timeout: 30000,
                    maximumAge: 300000, // Accept 5-minute old location
                }
            );
        } catch (error) {
            console.error('Fallback location method failed:', error);
            if (isMountedRef.current && loading) {
                setLoading(false);
            }
        }
    }, [loading]);

    const fetchDeliveryLocation = useCallback(async () => {
        if (!isMountedRef.current) return;
        
        try {
            if (!deliveryBoyId) {
                console.warn('⚠️ No delivery boy ID provided');
                // For testing, add dummy delivery location
                const dummyDeliveryLocation = {
                    latitude: 28.6139, // Delhi coordinates
                    longitude: 77.2090,
                    timestamp: Date.now()
                };
                if (isMountedRef.current) {
                    setDeliveryLocation(dummyDeliveryLocation);
                }
                console.log('🧪 Using dummy delivery location for testing');
                return;
            }

            console.log('🚚 Fetching delivery location for ID:', deliveryBoyId);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const res = await fetch(`https://qdp1vbhp-2000.inc1.devtunnels.ms/api/delivery/current_location/${deliveryBoyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (!isMountedRef.current) return;
            
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
                    
                    if (isMountedRef.current) {
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
                    }
                } else {
                    console.error('❌ Invalid delivery coordinates:', { lat, lng });
                }
            } else {
                console.warn('⚠️ API response missing location data:', data);
            }
        } catch (err) {
            if (!isMountedRef.current) return;
            
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
    }, [deliveryBoyId]);

    const fitMapToLocations = useCallback(() => {
        if (!isMountedRef.current) return;
        
        try {
            if (mapRef.current && userLocation && deliveryLocation && mapReady) {
                const coordinates = [userLocation, deliveryLocation];
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 100, right: 100, bottom: 200, left: 100 },
                    animated: true,
                });
            }
        } catch (error) {
            console.error('Error fitting map to locations:', error);
        }
    }, [userLocation, deliveryLocation, mapReady]);

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

    const onMapReady = useCallback(() => {
        if (!isMountedRef.current) return;
        
        console.log('🗺️ Map is ready');
        setMapReady(true);
        setMapError(null);
        
        // Fit to locations after map is ready
        setTimeout(() => {
            if (isMountedRef.current && userLocation && deliveryLocation) {
                fitMapToLocations();
            }
        }, 1000);
    }, [userLocation, deliveryLocation, fitMapToLocations]);

    const onMapError = useCallback((error) => {
        if (!isMountedRef.current) return;
        
        console.error('🗺️ Map Error:', error);
        setMapError(error);
    }, []);

    // Force location refresh
    const forceLocationRefresh = useCallback(() => {
        setLoading(true);
        setLocationError(null);
        
        // Clear existing watch
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        
        // Start fresh location tracking
        startLocationWatch();
    }, [startLocationWatch]);

    // Main effect for initialization
    useEffect(() => {
        isMountedRef.current = true;
        console.log('🚀 Component mounted');
        
        // Start location tracking
        startLocationWatch();
        fetchDeliveryLocation();
        
        return cleanup;
    }, []);

    // Separate effect for tracking intervals
    useEffect(() => {
        if (!isTracking || !isMountedRef.current) {
            return;
        }

        // Update delivery location every 10 seconds
        const deliveryInterval = setInterval(() => {
            if (isMountedRef.current) {
                fetchDeliveryLocation();
            }
        }, 10000);
        intervalsRef.current.push(deliveryInterval);
        
        return () => {
            intervalsRef.current.forEach(interval => {
                if (interval) clearInterval(interval);
            });
            intervalsRef.current = [];
        };
    }, [isTracking, fetchDeliveryLocation]);

    const distanceBetweenPoints = (userLocation && deliveryLocation) ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        deliveryLocation.latitude,
        deliveryLocation.longitude
    ) : 0;

    const shouldShowDirections = deliveryLocation && distanceBetweenPoints > 0.05;

    // Calculate initial region with safety checks
    const getInitialRegion = useCallback(() => {
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
        
        if (userLocation) {
            return {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }

        // Default fallback region
        return {
            latitude: 28.6139,
            longitude: 77.2090,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }, [userLocation, deliveryLocation]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#406FF3" />
                <Text style={styles.loadingText}>Getting your location...</Text>
                {locationError && (
                    <Text style={styles.errorText}>{locationError}</Text>
                )}
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={forceLocationRefresh}
                >
                    <Text style={styles.retryButtonText}>Try Different Method</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!userLocation) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Unable to get your location</Text>
                {locationError && (
                    <Text style={styles.errorDetailText}>{locationError}</Text>
                )}
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={forceLocationRefresh}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.retryButton, { backgroundColor: '#FF9800', marginTop: 10 }]}
                    onPress={getUserCurrentLocationFallback}
                >
                    <Text style={styles.retryButtonText}>Use Network Location</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                {shouldShowDirections && GOOGLE_MAPS_API_KEY && mapReady && (
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
                            if (!isMountedRef.current) return;
                            console.log('✅ Route ready:', result);
                            setDistance(result.distance);
                            setDuration(result.duration);
                        }}
                        onError={(errorMessage) => {
                            if (!isMountedRef.current) return;
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
                    onPress={forceLocationRefresh}
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
        textAlign: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 15,
    },
    errorDetailText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
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