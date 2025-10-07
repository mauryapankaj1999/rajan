import React, { useState } from "react";
import { View ,Text, StyleSheet, FlatList, Image, TouchableOpacity} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';



export default function CategoriesFlatList() {


const [categories, setCategories] = useState([
  {
    id: 1,
    name: 'Plumber',
    image: require("../assets/images/plumber.jpg"),
  },
  {   
    id: 2,
    name: 'Electrician',
    image: require("../assets/images/electrician.jpeg"),
  },
  
  {
    id: 3,
    name: 'Switch Board',
    image: require("../assets/images/Kromo.png"),
  },
  {
    id: 4,
    name: 'Painter',
    image: require("../assets/images/painter.jpg"),
  },
  {
    id: 5,
    name: 'Mistri',
    image: require("../assets/images/mistri.jpg"),
  },
 
]);

const renderItem = ({item}: {item: any}) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>

      <Text style={styles.nameText  }>{item.name}</Text>
    </View>
  );
};


  return (
    <View style={styles.container}>
      {/* <Text>CategoriesFlatList</Text> */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    // paddingVertical: 10,
  },
  item: {
    // paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: wp(4),
    // borderRadius: 10,
    // backgroundColor: '#fff',
    marginBottom: 10,
  },
  image: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5.5), // Half of height for perfect circle
    borderWidth: 2,
    borderColor: '#ae5195',
    elevation: 2,
    backgroundColor: '#fff',
  },
  // imageContainer: {
  //   width: hp(8),
  //   height: hp(8),
  //   backgroundColor: 'red',
  //   overflow: 'hidden',
  //   borderRadius: hp(4), // Half of height for perfect circle
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  nameText: {
    fontSize: hp(1.6),
    // fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Inter_18pt-Regular',
    marginTop: hp(1),
  },
});
