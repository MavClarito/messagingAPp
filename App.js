import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableHighlight, Alert, BackHandler, Keyboard } from 'react-native';
import { createTextMessage, createImageMessage, createLocationMessage } from './components/MessageUtils';
import MessageList from './components/MessageList';
import ToolBar from './components/ToolBar';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [messages, setMessages] = useState([
    createImageMessage(require('./assets/images/adaptive-icon.png')),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    }),
  ]);
  const [fullscreenImageId, setFullscreenImageId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');

  const handlePressMessage = (message) => {
    if (message.type === 'text') {
      Alert.alert(
        'Delete Message',
        'Are you sure you want to delete this message?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteMessage(message.id) },
        ]
      );
    } else if (message.type === 'image') {
      setFullscreenImageId(message.id);
      setIsFocused(false); // Set to false to dismiss the keyboard (if needed)
      Keyboard.dismiss();
    }
  };

  const deleteMessage = (id) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  const dismissFullscreenImage = () => {
    setFullscreenImageId(null);
  };

  const renderFullscreenImage = () => {
    if (fullscreenImageId === null) return null;

    const image = messages.find((msg) => msg.id === fullscreenImageId);
    if (!image || !image.uri) return null;

    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={dismissFullscreenImage}>
        <Image
          style={styles.fullscreenImage}
          source={typeof image.uri === 'number' ? image.uri : { uri: image.uri }}
        />
      </TouchableHighlight>
    );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (fullscreenImageId !== null) {
        dismissFullscreenImage();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [fullscreenImageId]);

  const handleCameraPress = () => {
    console.log('Camera button pressed');
  };

  const handleLocationPress = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setMessages((prevMessages) => [
        createLocationMessage({ latitude, longitude }),
        ...prevMessages,
      ]);
    } catch (error) {
      Alert.alert('Error', 'Unable to retrieve location.');
      console.error(error);
    }
  };

  const handleSubmit = (text) => {
    if (text.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        createTextMessage(text),
      ]);
      setInputText('');
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
      </View>
      <View style={styles.toolbar}>
        <ToolBar
          isFocused={isFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleFocus}
          onPressCamera={handleCameraPress}
          onPressLocation={handleLocationPress}
          inputText={inputText}
          setInputText={setInputText}
          onBlur={handleBlur}
          onPressSend={handleSubmit} // Send button
        />
      </View>
      {renderFullscreenImage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
