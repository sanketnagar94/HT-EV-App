import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";

const BluetoothScreen = () => {
    const [bleManager] = useState(new BleManager());
    const [devices, setDevices] = useState([]); // Stores discovered devices
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        requestPermissions();
        return () => {
            bleManager.destroy(); // Cleanup BLE Manager when component unmounts
        };
    }, []);

    // Request Bluetooth Permissions (For Android)
    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ]);
        }
    };

    // Scan for ESP32 devices
    const startScan = () => {
        setDevices([]); // Clear previous devices
        setIsScanning(true);

        bleManager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
            if (error) {
                console.log("Scan error:", error);
                setIsScanning(false);
                return;
            }

            // Filter ESP32 devices (Adjust filtering as needed)
            if (device.name && device.name.includes("ESP32")) {
                setDevices((prevDevices) => {
                    const exists = prevDevices.some((d) => d.id === device.id);
                    return exists ? prevDevices : [...prevDevices, device];
                });
            }
        });

        // Stop scanning after 10 seconds
        setTimeout(() => {
            bleManager.stopDeviceScan();
            setIsScanning(false);
        }, 10000);
    };

    // Connect to selected ESP32 device
    const connectToDevice = async (device) => {
        try {
            const connectedDevice = await bleManager.connectToDevice(device.id);
            await connectedDevice.discoverAllServicesAndCharacteristics();
            setConnectedDevice(connectedDevice);
            console.log("Connected to:", connectedDevice.name);
        } catch (error) {
            console.log("Connection error:", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                {connectedDevice ? `Connected to: ${connectedDevice.name}` : "Select an ESP32 Device"}
            </Text>

            {/* Scan Button */}
            <Button title={isScanning ? "Scanning..." : "Scan for ESP32"} onPress={startScan} disabled={isScanning} />

            {/* List of Discovered Devices */}
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            marginVertical: 5,
                            backgroundColor: "#ddd",
                            borderRadius: 5,
                        }}
                        onPress={() => connectToDevice(item)}
                    >
                        <Text style={{ fontSize: 16 }}>{item.name || "Unnamed Device"}</Text>
                        <Text style={{ fontSize: 12, color: "gray" }}>ID: {item.id}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default BluetoothScreen;
