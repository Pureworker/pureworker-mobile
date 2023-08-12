import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

export default React.forwardRef((props, ref) => {
  const handleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (keyValue === 'Backspace') {
      props.move('left', props.keyRef);
    } else {
    }
  };

  const [text, setText] = React.useState('');

  React.useEffect(() => {
    props.update(text, props.keyRef);
    if (text.length) {
      props.move('right', props.keyRef);
    }
  }, [text]);

  return (
    <View style={styles.innerView}>
      <TextInput
        selectionColor={'#DB5461'}
        cursorColor={'#DB5461'}
        ref={ref}
        value={text}
        onChangeText={txt => {
          setText(txt);
        }}
        onKeyPress={handleKeyPress}
        maxLength={1}
        placeholderTextColor="red"
        keyboardType="numeric"
        style={styles.inputView}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  innerView: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  inputView: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignSelf: 'center',
    elevation: 6,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.1,
    textAlign: 'center',
    width: 50,
  },
});
