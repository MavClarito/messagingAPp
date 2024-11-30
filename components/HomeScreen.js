// HomeScreen.js
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomStatusBar from './components/Status';  // Assuming Status is the StatusBar component

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(true);  // Example state for connection status

  const handleConnectionChange = (connectionStatus) => {
    setIsConnected(connectionStatus);
    console.log(`Connection Status: ${connectionStatus ? 'Connected' : 'Disconnected'}`);
  };

  return (
    <View style={styles.container}>
      {/* Pass the handleConnectionChange function as a prop */}
      <CustomStatusBar onConnectionChange={handleConnectionChange} />
      {/* Other components */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
