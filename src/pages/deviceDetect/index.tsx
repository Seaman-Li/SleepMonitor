import React, { useState, useEffect } from 'react';
import { View, FlatList, PermissionsAndroid, Platform, NativeEventEmitter, NativeModules, Text } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Button } from 'react-native-paper';

// 定义设备类型
interface IDevice {
  id: string;
  name: string | null;
}

const DeviceDetectionPage = () => {
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [noDevicesFound, setNoDevicesFound] = useState(false);

  useEffect(() => {
    BleManager.start({ showAlert: false });

    const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
    const subscription = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    BleManager.checkState();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral: { id: string; name: string | null }) => {
    console.log('Discovered new peripheral:', peripheral);
    if (!devices.some(device => device.id === peripheral.id)) {
      setDevices(prevDevices => [...prevDevices, { id: peripheral.id, name: peripheral.name }]);
    }
  };

  const startScan = async () => {
    if (isScanning) {
      console.log('Already scanning...');
      return;
    }

    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const scanPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: "Bluetooth Scan Permission",
          message: "The app needs access to Bluetooth scanning.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      const connectPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: "Bluetooth Connect Permission",
          message: "The app needs access to connect to Bluetooth devices.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (scanPermission !== PermissionsAndroid.RESULTS.GRANTED || connectPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Bluetooth permissions not granted');
        return;
      }
    }
    scanDevices();
  };

  const scanDevices = () => {
    setIsScanning(true);
    setDevices([]); // Clear the previous devices list
    setNoDevicesFound(false); // Reset the no devices found flag
    BleManager.scan([], 5, true)
      .then(() => {
        console.log("Scanning...");
        setTimeout(() => {
          setIsScanning(false);
          BleManager.stopScan();
          if (devices.length === 0) {
            console.log("No devices found");
            setNoDevicesFound(true); // Set the flag to show the message
          }
        }, 5000);
      })
      .catch(err => {
        console.error('Scan error:', err);
        setIsScanning(false);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Device Detection Page</Text>
      <Button mode="contained" onPress={startScan}>
        {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
      </Button>
      {noDevicesFound && <Text>No devices found. Please try again.</Text>}
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text>{item.name || 'Unnamed'} ({item.id})</Text>}
      />
    </View>
  );
};

export default DeviceDetectionPage;
