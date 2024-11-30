import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

// A simple button component used for toolbar actions
const ToolbarButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

// Main Toolbar component
export default class Toolbar extends React.Component {
  static propTypes = {
    isFocused: PropTypes.bool.isRequired, // Controls the input focus state
    onChangeFocus: PropTypes.func, // Callback for when the input gains focus
    onSubmit: PropTypes.func, // Callback for text submission
    onPressCamera: PropTypes.func, // Callback for pressing the camera button
    onPressLocation: PropTypes.func, // Callback for pressing the location button
    inputText: PropTypes.string.isRequired, // Current value of the text input
    setInputText: PropTypes.func.isRequired, // Function to update the text input value
  };

  static defaultProps = {
    onChangeFocus: () => {},
    onSubmit: () => {},
    onPressCamera: () => {},
    onPressLocation: () => {},
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef(); // Reference to the TextInput for focus/blur control
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      if (this.props.isFocused) {
        this.inputRef.current.focus(); // Focus the input when isFocused is true
      } else {
        this.inputRef.current.blur(); // Blur the input when isFocused is false
      }
    }
  }

  handleChangeText = (text) => {
    this.props.setInputText(text); // Update the parent state with new text
  };

  handleSubmitEditing = () => {
    const { onSubmit, inputText } = this.props;
    if (!inputText) return;
    onSubmit(inputText); // Call the parent's submit handler with the text
    this.props.setInputText(""); // Clear the input field
  };

  render() {
    const { onPressCamera, onPressLocation, inputText } = this.props;

    return (
      <View style={styles.toolbar}>
        {/* Camera Button */}
        <ToolbarButton title={"📸"} onPress={onPressCamera} />
        {/* Location Button */}
        <ToolbarButton title={"📍"} onPress={onPressLocation} />
        {/* Text Input Field */}
        <TextInput
          ref={this.inputRef}
          style={styles.input}
          placeholder="Type something!"
          value={inputText}
          onFocus={this.props.onChangeFocus} // Notify parent when input gains focus
          onChangeText={this.handleChangeText} // Update text state on change
          onSubmitEditing={this.handleSubmitEditing} // Handle submit event
        />
      </View>
    );
  }
}

// Styles for the Toolbar component
const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingLeft: 16,
    backgroundColor: "white",
  },
  button: {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: "grey",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 12,
  },
});