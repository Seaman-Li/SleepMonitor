import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BluetoothService {
  peripherals = new Map<string, any>();
  onDiscoverPeripheral: (peripheral: any) => void;
  onScanStopped: () => void;  // 新增一个回调函数

  constructor(onDiscoverPeripheral: (peripheral: any) => void, onScanStopped: () => void) {
    this.onDiscoverPeripheral = onDiscoverPeripheral;
    this.onScanStopped = onScanStopped;
    this.initialize();
  }

  async initialize() {
    BleManager.start({ showAlert: false });

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }

  handleDiscoverPeripheral = (peripheral: any) => {
    if (!this.peripherals.has(peripheral.id)) {
      this.peripherals.set(peripheral.id, peripheral);
      this.onDiscoverPeripheral(peripheral);
    }
  }

  handleStopScan = () => {
    console.log('Scan is stopped. Devices discovered:', this.peripherals.size);
    this.onScanStopped();  // 调用回调以通知扫描已停止
  }

  startScan() {
    this.peripherals.clear();
    BleManager.scan([], 10, true).then(() => {  // 第二个参数现在是10秒
      console.log('Scanning...');
    }).catch(err => {
      console.error('Scan error:', err);
    });
  }

  stopScan() {
    BleManager.stopScan().then(() => {
      console.log('Scan stopped');
    });
  }

  connectToDevice = (deviceId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      BleManager.connect(deviceId)
        .then(() => {
          console.log("Connected to " + deviceId);
          resolve(deviceId);
        })
        .catch(error => {
          console.error('Connection error', error);
          reject(error);
        });
    });
  }


  disconnectFromDevice = (deviceId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      BleManager.disconnect(deviceId)
        .then(() => {
          console.log('Disconnected from ' + deviceId);
          resolve(); // 成功解决 Promise
        })
        .catch(error => {
          console.error('Disconnect error', error);
          reject(error); // 在错误情况下拒绝 Promise
        });
    });
  };

}

export default BluetoothService;