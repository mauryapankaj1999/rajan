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
import { Header, CategoriesFlatList, Slider } from '../components';
import LocationService, { LocationData, LocationError, LocationInfo } from '../utils/locationService';
import CurrentLocation from '../components/CurrentLocation';

const HomeScreen: React.FC = () => {
  
  const handleMenuPress = () => {
    Alert.alert('Menu', 'Menu pressed');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'You have 3 new notifications');
  };

  const handleCartPress = () => {
    Alert.alert('Cart', 'Cart pressed');
  };

  const handleCategoryPress = (category: any) => {
    Alert.alert('Category', `Selected: ${category.name}`);
  };

  const handleSlidePress = (slide: any) => {
    Alert.alert('Slide', `Selected: ${slide.title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
      />

      <ScrollView showsVerticalScrollIndicator={false}>
      <CurrentLocation />
        <Slider  />
        <CategoriesFlatList onCategoryPress={handleCategoryPress} />
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default HomeScreen;
