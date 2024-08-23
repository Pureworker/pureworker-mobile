import React, {useState} from 'react';
import {View, Image, TextInput, TouchableOpacity, Platform} from 'react-native';
import images from '../constants/images';
import tw from 'twrnc';
import {perHeight, perWidth} from '../utils/position/sizes';

type TextInputsProps = {
  labelText: string;
  icon?: any;
  style: any;
  state: any;
  setState: (text: any) => void;
  keyBoardType?: any;
  secure?: boolean | undefined;
  image?: any;
  multiline?: boolean;
  nbLines?: number;
  disable?: boolean;
  maxLength?: number;
  styleInput?: any;
  placeHolderColor?: any;
};

const TextInputs = ({
  labelText,
  icon,
  style,
  state,
  setState,
  keyBoardType,
  secure,
  image,
  multiline,
  nbLines,
  disable,
  maxLength,
  styleInput,
  placeHolderColor,
}: TextInputsProps) => {
  const [focuse, setFocuse] = useState(false);
  const [secureText, setSecureTextEntry] = useState(true);

  const onFocusChange = () => {
    setFocuse(true);
  };
  const onBlur = () => {
    setFocuse(false);
  };
  return (
    <View
      style={[
        tw`items-center justify-center`,
        {
          backgroundColor: '#D9D9D9',
          borderRadius: perWidth(265) / 2,
          height: multiline ? 100 : perHeight(31),
          width: perWidth(265),
          paddingHorizontal: 10,
        },
        style,
      ]}>
      <View />
      <View
        style={[
          tw`items-center justify-center`,
          {
            flexDirection: 'row',
            //   justifyContent: 'space-between',
            //   alignItems: 'center',
          },
        ]}>
        {icon && (
          <TouchableOpacity
            style={{}}
            onPress={() => setSecureTextEntry(!secureText)}>
            {icon}
          </TouchableOpacity>
        )}
        <TextInput
          onFocus={onFocusChange}
          onBlur={onBlur}
          keyboardType={keyBoardType}
          selectionColor="#048bf8"
          secureTextEntry={secure ? secureText : undefined}
          value={state}
          onChangeText={(text: string) => setState(text)}
          multiline={multiline}
          numberOfLines={nbLines}
          editable={disable}
          placeholder={labelText}
          maxLength={maxLength}
          placeholderTextColor={ placeHolderColor ? placeHolderColor : '#000000'}
          style={[
            {
              flex: 1,
              //   marginTop:10,
              //   marginLeft: 15,
              color: '#000',
              fontSize: 14,
              fontWeight: 'normal',
              fontFamily: 'Inter-Medium',
              paddingHorizontal: 5,
              //   lineHeight: multiline ? 24 : 16,
              //   marginBottom: multiline ? 10 : 0,
              height: Platform.OS === 'ios' ? 40 : 40,
            },
            styleInput,
          ]}
        />

        {image && (
          <TouchableOpacity
            onPress={() => {}}
            style={{
              position: 'absolute',
              right: 5,
              zIndex: 1,
              bottom: 15,
            }}>
            <Image
              resizeMode="contain"
              source={image}
              style={{width: 20, height: 20, marginRight: 12}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextInputs;
