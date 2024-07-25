import React from "react";
import { BottomNavigation } from "react-native-paper";
import DeviceDetectionPage from "../../pages/deviceDetect";
import UserInfoPage from "../../pages/userInfo";
import DataHistoryPage from "../../pages/dataHistory";
import SettingsPage from "../../pages/settings";

const myBottomNavi = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'deviceDetection', title: 'Connect', icon: 'cellphone-link' },
      { key: 'userInfo', title: 'User', icon: 'account-circle-outline' },
      { key: 'dataHistory', title: 'History', icon: 'history' },
      { key: 'settings', title: 'Settings', icon: 'settings-outline' },
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
  
  export default myBottomNavi;