import React from "react";
import { BottomNavigation } from "react-native-paper";
import DeviceDetectionPage from "../../pages/deviceDetect";
import UserInfoPage from "../../pages/userInfo";
import DataHistoryPage from "../../pages/dataHistory";
import SettingsPage from "../../pages/settings";
import { StyleSheet } from "react-native";

const myBottomNavi = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'deviceDetection', title: 'Connect', focusedIcon: 'bluetooth-audio'},
      { key: 'userInfo', title: 'User', focusedIcon: "account-circle-outline" },
      { key: 'dataHistory', title: 'History', focusedIcon:"history"   },
      { key: 'settings', title: 'Settings', focusedIcon:"cog"  },  
    ]);
  
    const renderScene = BottomNavigation.SceneMap({
      deviceDetection: DeviceDetectionPage,
      userInfo: UserInfoPage,
      dataHistory: DataHistoryPage,
      settings: SettingsPage,
    });
  
    return (
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    );
  };
  
  const styles = StyleSheet.create({
    
  });
  export default myBottomNavi;