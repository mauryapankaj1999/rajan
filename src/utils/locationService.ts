import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationInfo {
  address: string;
  pincode: string | null;
  city: string;
  state: string;
  country: string;
}

export interface LocationError {
  code: number;
  message: string;
}

class LocationService {
  private watchId: number | null = null;

  /**
   * Request location permissions for Android
   */
  private async requestAndroidPermissions(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }

  /**
   * Check if location services are enabled
   */
  private async checkLocationServices(): Promise<boolean> {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { enableHighAccuracy: false, timeout: 1000, maximumAge: 10000 }
      );
    });
  }

  /**
   * Get current location once
   */
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise(async (resolve, reject) => {
      // Check permissions for Android
      if (Platform.OS === 'android') {
        const hasPermission = await this.requestAndroidPermissions();
        if (!hasPermission) {
          reject({
            code: 1,
            message: 'Location permission denied',
          });
          return;
        }
      }

      // Check if location services are enabled
      const isLocationEnabled = await this.checkLocationServices();
      if (!isLocationEnabled) {
        reject({
          code: 2,
          message: 'Location services are disabled',
        });
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject({
            code: error.code,
            message: error.message,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  /**
   * Start watching location changes
   */
  async startWatchingLocation(
    onLocationUpdate: (location: LocationData) => void,
    onError: (error: LocationError) => void
  ): Promise<void> {
    // Check permissions for Android
    if (Platform.OS === 'android') {
      const hasPermission = await this.requestAndroidPermissions();
      if (!hasPermission) {
        onError({
          code: 1,
          message: 'Location permission denied',
        });
        return;
      }
    }

    // Check if location services are enabled
    const isLocationEnabled = await this.checkLocationServices();
    if (!isLocationEnabled) {
      onError({
        code: 2,
        message: 'Location services are disabled',
      });
      return;
    }

    this.watchId = Geolocation.watchPosition(
      (position) => {
        onLocationUpdate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        onError({
          code: error.code,
          message: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 5000, // Update every 5 seconds
        fastestInterval: 2000, // Fastest update every 2 seconds
      }
    );
  }

  /**
   * Stop watching location changes
   */
  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get detailed location information from coordinates including pincode
   */
  async getLocationInfoFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<LocationInfo> {
    try {
      console.log('Fetching location info for:', latitude, longitude);
      
      // Try multiple reverse geocoding services
      let data: any = null;
      
      // First try: OpenStreetMap Nominatim (better for international)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );
        data = await response.json();
        console.log('Nominatim API Response:', data);
      } catch (error) {
        console.log('Nominatim failed, trying BigDataCloud...');
      }
      
      // Fallback: BigDataCloud
      if (!data || !data.address) {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        data = await response.json();
        console.log('BigDataCloud API Response:', data);
      }
      
      // Extract pincode from different possible sources
      let pincode = null;
      
      if (data.address) {
        // Try different field names for pincode
        pincode = data.address.postcode || 
                 data.address.postal_code ||
                 data.address.pincode ||
                 data.postcode ||
                 data.postalCode ||
                 data.postal_code ||
                 data.localityInfo?.postalCode;
      }
      
      const result = {
        address: data.address?.city || data.address?.town || data.address?.village || data.city || 'Unknown',
        pincode: pincode,
        city: data.address?.city || data.address?.town || data.address?.village || data.city || 'Unknown',
        state: data.address?.state || data.address?.province || data.principalSubdivision || 'Unknown',
        country: data.address?.country || data.countryName || 'Unknown',
      };
      
      console.log('Processed location info:', result);
      return result;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        pincode: null, // No fallback pincode
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
      };
    }
  }

  /**
   * Get formatted address from coordinates (requires reverse geocoding service)
   */
  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data.city && data.principalSubdivision) {
        return `${data.city}, ${data.principalSubdivision}`;
      } else if (data.locality) {
        return data.locality;
      } else {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }

  /**
   * Show location permission alert
   */
  showLocationPermissionAlert(): void {
    Alert.alert(
      'Location Permission Required',
      'This app needs access to your location to show your current location. Please enable location permissions in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => {
          // You can add deep linking to settings here if needed
        }},
      ]
    );
  }
}

export default new LocationService();
