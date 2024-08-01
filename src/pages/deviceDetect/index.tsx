import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';
import { NativeEventEmitter, NativeModules } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

interface Peripheral {
  id: string;
  name: string;
}

const DeviceDetectionPage: React.FC = () => {
  const [devices, setDevices] = useState<Map<string, Peripheral>>(new Map());
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(null);
  const [listExpanded, setListExpanded] = useState(false);

  useEffect(() => {
    BleManager.start({ showAlert: false });
    requestPermissions();
    const subscription = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    return () => subscription.remove();
  }, []);

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    setDevices(prevDevices => {
      const newDevices = new Map(prevDevices);
      newDevices.set(peripheral.id, peripheral);
      return newDevices;
    });
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  };

  const startScan = () => {
    if (!isScanning) {
      setDevices(new Map()); // 清空之前的设备列表
      setIsScanning(true);
      setListExpanded(true); // 自动展开列表开始扫描
      BleManager.scan([], 5, true).then(() => {
        console.log("Scanning...");
        setTimeout(() => setIsScanning(false), 5000);
      }).catch(err => console.error(err));
    }
  };

  const connectToDevice = (peripheral: Peripheral) => {
    BleManager.connect(peripheral.id)
      .then(() => {
        console.log("Connected to " + peripheral.id);
        setConnectedDevice(peripheral);
        Alert.alert("Connection Successful", `Connected to ${peripheral.name || peripheral.id}`);
      })
      .catch(error => {
        console.error("Connection error", error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={startScan}>
        <Text style={styles.buttonText}>Scan for Devices</Text>
      </TouchableOpacity>
      {connectedDevice && (
        <Text style={styles.connectedInfo}>Connected to: {connectedDevice.name || connectedDevice.id}</Text>
      )}
      {isScanning && <Text>Scanning for devices...</Text>}
      {listExpanded && (
        <>
          <FlatList
            data={Array.from(devices.values())}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => connectToDevice(item)}>
                <Text style={styles.deviceName}>{item.name || item.id}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.toggleButton} onPress={() => setListExpanded(!listExpanded)}>
            <Text style={styles.toggleButtonText}>{listExpanded ? "Hide Devices" : "Show Devices"}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#1e90ff',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  deviceName: {
    padding: 10,
    fontSize: 18
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#007bff',
    marginTop: 10
  },
  toggleButtonText: {
    color: '#fff',
    textAlign: 'center'
  },
  connectedInfo: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5
  }
});

export default DeviceDetectionPage;




// const keyExtractor = (item: Peripheral, index: number) => {
//   // 使用 id 和 index 组合来确保 key 的唯一性
//   return `${item.id}-${index}`;
// };