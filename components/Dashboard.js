import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import device from './AWSIoTConnection';

const Dashboard = () => {
  const [energyData, setEnergyData] = useState({ power: 0, voltage: 0, current: 0 });

  useEffect(() => {
    device.on('message', (topic, payload) => {
      if (topic === 'smartplug/data') {
        const data = JSON.parse(payload.toString());
        setEnergyData(data);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Power: {energyData.power} W</Text>
      <Text style={styles.label}>Voltage: {energyData.voltage} V</Text>
      <Text style={styles.label}>Current: {energyData.current} A</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 22, margin: 10 },
});

export default Dashboard;
