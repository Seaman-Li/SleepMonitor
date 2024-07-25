import React from 'react';
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import MyBottomNavi from '../bottomNavi'

// type LayoutComponentProps = {
//   // title: string;
//   children: React.ReactNode;  
// };

const LayoutComponent: React.FC = ({}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.Header}>
        <Appbar.Content title="Vena Vital" />
        <Image
        source={require('../../assets/Venavitals_logo_16x9.webp')} 
        style={styles.Logo}
        />
      </Appbar.Header>
      <MyBottomNavi />  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Header:{
    backgroundColor:"#FFB3CA"
  },
  Logo:{
    width:40,
    height:40
  }

});

export default LayoutComponent;
