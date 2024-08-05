import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BluetoothService from '../../utils/BluetoothService';

interface Peripheral {
  id: string;
  name?: string;
}

const DeviceDetectionPage: React.FC = () => {
  const [devices, setDevices] = useState<Map<string, Peripheral>>(new Map());
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(null);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);

  const bluetoothServiceRef = useRef<BluetoothService>();

  useEffect(() => {
    if (!bluetoothServiceRef.current) {
      bluetoothServiceRef.current = new BluetoothService(
        (peripheral: Peripheral) => {
          setDevices(prevDevices => {
            const newDevices = new Map(prevDevices);
            newDevices.set(peripheral.id, peripheral);
            return newDevices;
          });
        },
        () => {
          setIsScanning(false);
          setScanCompleted(true); // 扫描结束时设置标志
        }
      );
    }

    return () => {
      bluetoothServiceRef.current?.stopScan();
    };
  }, []);

   // 新增 useEffect 来处理扫描完成后的逻辑
   useEffect(() => {
    if (scanCompleted) {
      if (devices.size === 0) {
        Alert.alert("Scan Complete", "No devices found");
      } else {
        Alert.alert("Scan Complete", "Devices found: " + devices.size);
      }
      setScanCompleted(false); // 重置扫描完成标志
    }
  }, [scanCompleted, devices.size]); // 依赖 scanCompleted 和 devices.size
  

  const startScan = () => {
    if (!isScanning) {
      setDevices(new Map());
      setIsScanning(true);
      setScanCompleted(false); // 开始扫描前重置扫描完成标志
      listExpanded || setListExpanded(true);
      bluetoothServiceRef.current?.startScan();
    }
  };

  const connectToDevice = (peripheralId: string) => {
    bluetoothServiceRef.current?.connectToDevice(peripheralId)
      .then(() => {
        console.log("Connected to " + peripheralId);
        setConnectedDevice(devices.get(peripheralId) || null);
        Alert.alert("Connection Successful", `Connected to ${peripheralId}`);
      })
      .catch(error => {
        console.error("Connection error", error);
      });
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bluetoothServiceRef.current?.disconnectFromDevice(connectedDevice.id)
        .then(() => {
          console.log('Disconnected from ' + connectedDevice.id);
          setConnectedDevice(null);
          Alert.alert("Disconnect Successful", `Disconnected from ${connectedDevice.name || connectedDevice.id}`);
        })
        .catch(error => {
          console.error("Disconnect error", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={startScan}>
        <Text style={styles.buttonText}>Scan for Devices</Text>
      </TouchableOpacity>
      {isScanning && <Text>Scanning for devices...</Text>}
      {connectedDevice && (
        <>
          <Text style={styles.connectedInfo}>Connected to: {connectedDevice.name || connectedDevice.id}</Text>
          <TouchableOpacity style={styles.button} onPress={disconnectFromDevice}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </>
      )}
      {listExpanded && (
        <FlatList
          data={Array.from(devices.values())}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => connectToDevice(item.id)}>
              <Text style={styles.deviceName}>{item.name || item.id}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {listExpanded && (
        <TouchableOpacity style={styles.toggleButton} onPress={() => setListExpanded(!listExpanded)}>
          <Text style={styles.toggleButtonText}>{listExpanded ? "Hide Devices" : "Show Devices"}</Text>
        </TouchableOpacity>
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
