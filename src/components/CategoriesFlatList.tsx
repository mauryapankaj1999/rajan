import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoriesFlatListProps {
  onCategoryPress?: (category: Category) => void;
}

const CategoriesFlatList: React.FC<CategoriesFlatListProps> = ({ onCategoryPress }) => {
  const categories: Category[] = [
    { id: '1', name: 'FOODS & GROCERY', icon: '🛒', color: '#3498db' },
    { id: '2', name: 'HEALTH CARE', icon: '💊', color: '#e74c3c' },
    { id: '3', name: 'PERSONAL CARE', icon: '🧴', color: '#f39c12' },
    { id: '4', name: 'HOUSEHOLD', icon: '🏠', color: '#27ae60' },
    { id: '5', name: "MEN'S", icon: '👔', color: '#9b59b6' },
    { id: '6', name: "WOMEN'S", icon: '👗', color: '#e91e63' },
    { id: '7', name: 'ELECTRONICS', icon: '📱', color: '#34495e' },
    { id: '8', name: 'SPORTS', icon: '⚽', color: '#16a085' },
  ];

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: item.color }]}
      onPress={() => onCategoryPress?.(item)}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <View style={[styles.categoryBorder, { backgroundColor: '#f39c12' }]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    width: 100,
    height: 120,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 12,
  },
  categoryBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  separator: {
    width: 10,
  },
});

export default CategoriesFlatList;

