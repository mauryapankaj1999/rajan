import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { LocationData, LocationInfo } from '../utils/locationService';
import LocationService, { LocationData, LocationError, LocationInfo } from '../utils/locationService';

export default function CurrentLocation() {
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    getCurrentLocation();
    startLocationTracking();
    
    return () => {
      LocationService.stopWatchingLocation();
    };
  }, []);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError('');
    
    try {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      console.log('Location received:', location);
      
      // Get detailed location info including pincode
      const locationInfo = await LocationService.getLocationInfoFromCoordinates(
        location.latitude,
        location.longitude
      );
      console.log('Location info received:', locationInfo);
      setLocationInfo(locationInfo);
    } catch (error) {
      const locationError = error as LocationError;
      console.log('Location error:', locationError);
      setLocationError(locationError.message);
      
      if (locationError.code === 1) {
        LocationService.showLocationPermissionAlert();
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const startLocationTracking = () => {
    LocationService.startWatchingLocation(
      (location) => {
        setCurrentLocation(location);
        // Update location info periodically (every 30 seconds)
        LocationService.getLocationInfoFromCoordinates(
          location.latitude,
          location.longitude
        ).then(setLocationInfo);
      },
      (error) => {
        setLocationError(error.message);
      }
    );
  };

  const handleLocationPress = () => {
    if (locationError) {
      getCurrentLocation();
    } else {
      const locationDetails = locationInfo 
        ? `Address: ${locationInfo.address}\nCity: ${locationInfo.city}\nState: ${locationInfo.state}\nPincode: ${locationInfo.pincode}\nCountry: ${locationInfo.country}\n\nCoordinates: ${currentLocation?.latitude.toFixed(4)}, ${currentLocation?.longitude.toFixed(4)}`
        : `Coordinates: ${currentLocation?.latitude.toFixed(4)}, ${currentLocation?.longitude.toFixed(4)}`;
      
      Alert.alert(
        'Delivery Location',
        locationDetails,
        [
          { text: 'OK' },
          { text: 'Refresh Location', onPress: getCurrentLocation },
          { text: 'Change Location', onPress: handleChangeLocation },
        ]
      );
    }
  };

  const handleChangeLocation = () => {
    Alert.alert(
      'Change Delivery Location',
      'Choose how you want to set your delivery location:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Current Location', onPress: getCurrentLocation },
        { text: 'Enter Pincode', onPress: handleEnterPincode },
      ]
    );
  };

  const handleEnterPincode = () => {
    Alert.prompt(
      'Enter Pincode',
      'Please enter your delivery pincode:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Set', 
          onPress: (pincode: string | undefined) => {
            if (pincode && pincode.trim()) {
              // Set the pincode manually
              setLocationInfo(prev => prev ? {
                ...prev,
                pincode: pincode.trim()
              } : {
                address: 'Manual Entry',
                pincode: pincode.trim(),
                city: 'Unknown',
                state: 'Unknown',
                country: 'Unknown',
              });
              Alert.alert('Pincode Set', `Delivery location set to pincode: ${pincode}`);
            }
          }
        },
      ],
      'plain-text',
      locationInfo?.pincode || ''
    );
  };

  return (
    <>
    
    <TouchableOpacity 
        style={styles.deliveryLocationBar} 
        onPress={handleLocationPress}
        activeOpacity={0.7}
      >
        <View style={styles.deliveryContent}>
          <View style={styles.deliveryLeftSection}>
            <Text style={styles.locationPinIcon}>📍</Text>
            <Text style={styles.deliverToText}>Deliver to</Text>
            {isLoadingLocation ? (
              <ActivityIndicator size="small" color="#666" style={styles.loadingIndicator} />
            ) : locationError ? (
              <Text style={styles.errorText}>Tap to retry</Text>
            ) : locationInfo && locationInfo.pincode && locationInfo.pincode !== 'N/A' ? (
              <Text style={styles.pincodeDisplay}>{locationInfo.pincode}</Text>
            ) : (
              <Text style={styles.pincodeDisplay}>Tap to get location</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleChangeLocation} style={styles.editButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity> 
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  featuredContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  featuredItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuredIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  featuredText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '23%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  deliveryLocationBar: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  deliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationPinIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  deliverToText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  pincodeDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    fontStyle: 'italic',
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
    color: '#666',
  },
});