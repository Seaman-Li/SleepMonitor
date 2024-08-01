

import React from 'react';
import {StyleSheet,useColorScheme,} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import LayoutComponent from './src/myComponents/Layout';
import { PaperProvider } from 'react-native-paper';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <PaperProvider>
      {/* <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>  */}
          <NavigationContainer>
            <LayoutComponent >
            </LayoutComponent>
          </NavigationContainer>
        {/* </SafeAreaView>
      </SafeAreaProvider> */}
    </PaperProvider>
    

  );
}

const styles = StyleSheet.create({

});

export default App;
