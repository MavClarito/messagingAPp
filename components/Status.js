import Constants from 'expo-constants';
import { StatusBar as RNStatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Platform, Animated } from "react-native";
import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';

export default class Status extends React.Component {
  state = {
    connectionStatus: 'none',
    animation: new Animated.Value(1),
    fadeAnim: new Animated.Value(0),
  };

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      this.setState({ connectionStatus: isConnected ? "connected" : "none" }, () => {
        this.triggerFadeAnimation();
        this.props.onConnectionChange(isConnected); // Update parent connection status
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  handleRefresh = () => {
    Animated.sequence([
      Animated.timing(this.state.animation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      NetInfo.fetch().then(state => {
        this.setState({ connectionStatus: state.isConnected ? "connected" : "none" }, () => {
          this.triggerFadeAnimation();
          this.props.onConnectionChange(state.isConnected); // Update parent connection status
        });
      });
    });
  };

  triggerFadeAnimation = () => {
    const { fadeAnim, connectionStatus } = this.state;
    Animated.timing(fadeAnim, {
      toValue: connectionStatus === "none" ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { connectionStatus, animation, fadeAnim } = this.state;
    const isConnected = connectionStatus !== "none";
    const backgroundColor = isConnected ? "green" : "red";

    const statusBar = (
      <RNStatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? "dark-content" : "light-content"}
        animated={true}
      />
    );

    const messageContainer = (
      <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]} pointerEvents={"none"}>
        {statusBar}
        {!isConnected && (
          <View style={styles.bubble}>
            <Image
              source={require('../assets/images/disconnect.png')}
              style={styles.image}
            />
            <Text style={styles.title}>Whoops!!</Text>
            <Text style={styles.text}>No Internet connection was found. Check your connection or try again.</Text>
            <Animated.View style={{ transform: [{ scale: animation }] }}>
              <TouchableOpacity style={styles.button} onPress={this.handleRefresh}>
                <Text style={styles.buttonText}>Try again</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
        {isConnected && (
          <View style={styles.connectedContainer}>
            <Text style={styles.connectedText}>You are connected</Text>
            <Image 
              source={require('../assets/images/connected.png')}  // Ensure this path is correct
              style={styles.connectedImage}
            />
          </View>
        )}
      </Animated.View>
    );

    if (Platform.OS === "ios") {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {messageContainer}
        </View>
      );
    }

    return messageContainer;
  }
}

Status.propTypes = {
  onConnectionChange: PropTypes.func.isRequired, // Prop validation
};

const statusHeight = Platform.OS === "ios" ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 100,
    position: "absolute",
    top: statusHeight,
    right: 0,
    left: 0,
    height: 'auto',
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 200,
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  text: {
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#FF664C", // Simplified button background color
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  connectedContainer: {
    padding: 20,
    backgroundColor: 'lightgreen',
    borderRadius: 10,
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  connectedImage: {
    width: 50,
    height: 50, // Adjust size as needed
  },
});
