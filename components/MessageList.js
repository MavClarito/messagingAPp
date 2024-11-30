import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // Corrected import statement
import { MessageShape } from './MessageUtils';

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  keyExtractor = (item) => item.id.toString();

  renderMessageItem = ({ item }) => {
    const { onPressMessage } = this.props;
    return (
      <View key={item.id} style={styles.messageRow}>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          {this.renderMessageBody(item)}
        </TouchableOpacity>
      </View>
    );
  };

  renderMessageBody = ({ type, text, uri, coordinate }) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{text}</Text>
          </View>
        );
      case 'image':
        return (
          <Image source={uri} style={styles.imageStyle} />
        );
      case 'location':
        return (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapStyle}
              initialRegion={{
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              // Set any additional props here as needed
            >
              <Marker
                coordinate={{
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                }}
                title={"Location"}
              />
            </MapView>
          </View>
        );
      default:
        return null;
    }
  };

  render() {
    const { messages } = this.props;

    return (
      <FlatList
        style={styles.container}
        inverted
        data={messages}
        renderItem={this.renderMessageItem}
        keyExtractor={this.keyExtractor}
        keyboardShouldPersistTaps="handled"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 60,
    marginVertical: 8,
  },
  messageBubble: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: '105%',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  mapContainer: {
    width: 200, // Adjust width as necessary
    height: 200, // Adjust height as necessary
    borderRadius: 10,
    overflow: 'hidden', // Ensure corners are rounded
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
});