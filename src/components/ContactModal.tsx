import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StatusBar, Modal, Text, Image, TouchableOpacity, View } from 'react-native';

import colors from '../constants/colors';
import images from '../constants/images';

const ContactModal = forwardRef((props, ref) => {

  const [modalShow, setModalShow] = useState(false);
  const [contacts, setContacts] = useState([]);
  useImperativeHandle(ref, () => ({
    showModal(contactList) {
      setModalShow(true);
      setContacts(contactList);
    },
  }));

  return (
    <Modal animationType="slide" transparent={true} visible={modalShow}>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="rgba(39, 44, 63, 0.5)"
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            width: '100%',
            height: '100%',
            zIndex: 5,
            backgroundColor: '#272C3F',
            opacity: 0.5,
          }}
          onPress={() => setModalShow(false)}>
          <View style={{}}></View>
        </TouchableOpacity>

        <View
          style={{
            left: 25,
            right: 25,
            justifyContent: 'center',
            height: 373,
            borderRadius: 10,
            position: 'absolute',
            zIndex: 10,
          }}>
          <View>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                fontType={'semiBold'}
                style={{
                  fontSize: 20,
                  marginBottom: 17,
                  marginTop: 23,
                  textAlign: 'center'
                }}>
                {contacts.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 18,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: '#fff',
            }}>
            {contacts.numbers?.map((item, index) => {
              return (
                <View
                  key={index}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Montserrat-Regular', }}>{item.number}</Text>
                    <TouchableOpacity onPress={() => {}}>
                      <Image source={images.call} style={{ width: 30, height: 30, }} />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
            <View
              style={{
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                marginTop: 12,
                marginBottom: 18,
              }}
            />
            <TouchableOpacity onPress={() => setModalShow(false)}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 17,
                }}>
                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14 }}>
                  CLOSE
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default ContactModal;
