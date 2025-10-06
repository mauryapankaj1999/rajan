import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');



export default function Header() {
  return (
   <View style={styles.headercss}>
        
        <TouchableOpacity>
          <FontAwesome name="bars" color="#000000" size={20} />
        </TouchableOpacity>
        
        <View>
          <Text style={{fontSize:hp(3)}}>Amazan</Text>
        </View>
        
        <View style={{flexDirection:'row',justifyContent:'space-between', gap:10}}>
          
          <TouchableOpacity>
            <Feather name="search" color="#000000" size={20} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Feather name="shopping-cart" color="#000000" size={20} />
          </TouchableOpacity>
          
      </View>
   </View>
  );
};

const styles = StyleSheet.create({
headercss: {
  // width: width,
  backgroundColor: '#f8f8f8',
  paddingHorizontal: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#dededeff', 
  elevation: 3,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: hp(2),

},
});

