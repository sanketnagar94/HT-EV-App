import { Button } from 'react-native';
import device from './AWSIoTConnection';

const togglePlug = (status) => {
  const command = { action: status ? 'ON' : 'OFF' };
  device.publish('smartplug/control', JSON.stringify(command));
  Alert.alert(`Plug turned ${status ? 'ON' : 'OFF'}`);
};

export default function ControlPanel() {
  return (
    <View>
      <Button title="Turn On" onPress={() => togglePlug(true)} />
      <Button title="Turn Off" onPress={() => togglePlug(false)} />
    </View>
  );
}
