import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeviceDetectionPage from '../pages/deviceDetect';
import UserInfoPage from '../pages/userInfo';
import DataHistoryPage from '../pages/dataHistory';
import SettingsPage from '../pages/settings';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DeviceDetection" component={DeviceDetectionPage} options={{ title: '寻找设备' }} />
      <Tab.Screen name="UserInfo" component={UserInfoPage} options={{ title: '用户信息' }} />
      <Tab.Screen name="DataHistory" component={DataHistoryPage} options={{ title: '数据历史' }} />
      <Tab.Screen name="Settings" component={SettingsPage} options={{ title: '设置' }} />
    </Tab.Navigator>
  );
};

export default AppNavigation;
