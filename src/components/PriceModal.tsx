import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  StatusBar,
  Modal,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native';
// import RadioButton from 'react-native-simple-radio-button';

import images from '../constants/images';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import TextInputs from './TextInputs';
import commonStyle from '../constants/commonStyle';
var radio_props = [
  { label: 'Pay as you go', value: 0 },
  { label: 'Premier', value: 1 }
];
const PriceModal = forwardRef((props, ref) => {
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);


  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
    getAlert() {
      setDeleteModalShow(true);
    },
    jobDelete() {
      setDeleteModalShow(false);
    },
    // passData(user_id, request_id){
    //   setUserId(user_id)
    //   setRequestId(request_id)
    // }
  }));

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDeleteModalShow(false)}
        visible={deleteModalShow}>
        <StatusBar
          backgroundColor="rgba(4, 45, 84, 0.8)"
          barStyle="dark-content"
        />
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundColor: 'rgba(4, 45, 84, 0.8)',
          }}
          onPress={() => setDeleteModalShow(false)}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2,
            justifyContent: 'center',
          }}>
          <View
            style={{
              marginHorizontal: 16,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
              marginBottom: 19,
              backgroundColor: '#fff',
              borderRadius: 45,
              width: 45,
              height: 45
            }}>
            <TouchableOpacity onPress={() => setDeleteModalShow(false)}>
              <Image source={images.cross} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 16,
              zIndex: 3,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
              }}>
              <View
                style={{
                  marginVertical: 16,
                  marginHorizontal: 25,
                }}>
                <Text style={{ fontSize: 24, marginTop: 30, alignSelf: 'center', color: '#000', fontFamily: commonStyle.fontFamily.medium }}>Pricing Options</Text>
                <Text style={{position: 'absolute', top: 140, width: '80%', fontSize: 14, left: 60, alignSelf: 'center', color: '#000', fontFamily: commonStyle.fontFamily.regular }}>Once off payment per product that you list for 5% of product selling price</Text>
                <View style={{  }}>
                  {/* <RadioButton
                    style={{ marginVertical: 30, }}
                  
                    formHorizontal={false}
                    buttonColor='grey'
                    selectedButtonColor='#000'
                    buttonOuterSize={30}
                    buttonSize={20}
                    labelStyle={{ fontSize: 16, marginLeft: 20, marginTop: -75, color: '#000', padding: 80, fontFamily: commonStyle.fontFamily.medium, }}
                    radio_props={radio_props}
                    initial={0}
                    onPress={(value) => {
                      if (value == 0) {
                        setFirst(true)
                        setSecond(false)
                      } else if (value == 1) {
                        setFirst(false)
                        setSecond(true)
                      }

                    }}
                  /> */}
                </View>
                <Text style={{ fontSize: 14, marginLeft: 56, marginTop: -105, width: '80%', alignSelf: 'center', color: '#000', fontFamily: commonStyle.fontFamily.regular }}>Be part of our <Text style={{ fontSize: 14, color: '#000', fontFamily: commonStyle.fontFamily.semibold }}>premier vendor service</Text> where you can list an unlimited amount of products &  services <Text style={{ fontSize: 14, color: '#000', fontFamily: commonStyle.fontFamily.semibold }}>for only R300 p/m</Text></Text>

              </View>

              <View
                style={{
                  marginBottom: 24,
                  marginHorizontal: 16,
                  marginTop: 30
                }}>

                <Button
                  text="Proceed"
                  style={{
                  }}
                  onClick={() => {
                    //api call to delete the modal
                    // dispatch(hideJob(userId, requestId))
                    setDeleteModalShow(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
});

export default PriceModal;
