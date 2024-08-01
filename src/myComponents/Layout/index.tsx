import React from 'react';
import { SafeAreaView, View, StyleSheet, Image, Platform, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import MyBottomNavi from '../bottomNavi'

// type LayoutComponentProps = {
//   // title: string;
//   children: React.ReactNode;  
// };

const LayoutComponent: React.FC = ({}) => {
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.title}>Vena Vital</Text>
        <Image
          source={require('../../assets/Venavitals_logo_16x9.webp')} 
          style={styles.logo}
        />
      </View>
      <MyBottomNavi />  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FFB3CA",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10, // 根据需要调整内边距
    height: 60,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 40,
    height: 40,
  }

});

export default LayoutComponent;
