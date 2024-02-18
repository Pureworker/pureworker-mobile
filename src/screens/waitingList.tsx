import {View, Text, Image, SafeAreaView, Platform} from 'react-native';
import React, {useState} from 'react';
import {SIZES, perHeight} from '../utils/position/sizes';
import images from '../constants/images';
import Button from '../components/Button';
import colors from '../constants/colors';
import WaitImage from '../assets/svg/wait';
import commonStyle from '../constants/commonStyle';
import TextInputs from '../components/TextInputs';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {addToWait, completeProfile} from '../utils/api/func';
import {ToastLong} from '../utils/utils';

export default function WaitingList({navigation}: any) {
  const [name, setName] = useState('');
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Email/Phone is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        'Must be a valid email or phone number',
      )
      .test(
        'is-email-or-phone',
        'Must be a valid email or phone number',
        value => {
          // Check if the input is a valid email address
          if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            return true;
          }
          // Check if the input is a valid phone number
          if (/^\d{10}$/.test(value)) {
            return true;
          }
          return false;
        },
      ),
  });

  const handleWait = async (value: {name: any}) => {
    console.log('heyy');
    try {
      const res: any = await addToWait({
        email: value.name,
      });

      if (res?.status === 200 || res?.status === 201) {
        ToastLong('Congrats, You have been Added');
        navigation.navigate('CustomerSignup');
      }
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={{name: ''}}
      validationSchema={validationSchema}
      onSubmit={async values => {
        console.log('heyy2');
        // Handle form submission here
        await handleWait(values);
        // actions.setSubmitting(false);
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
          <View style={{width: SIZES.width, height: SIZES.height}}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={images.pureWorkerLogo}
                style={{
                  height: 50,
                  width: 200,
                  marginTop: Platform.OS === 'ios' ? 20 : 40,
                }}
                resizeMode="contain"
              />
              <WaitImage style={{marginTop: perHeight(40)}} />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: perHeight(20),
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                Join Our waiting list
              </Text>

              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: commonStyle.fontFamily.medium,
                    color: '#fff',
                    marginTop: 20,
                  }}>
                  Your Email or Phone Number
                </Text>
                <TextInputs
                  style={{marginTop: 15}}
                  labelText={'Enter Name'}
                  setState={handleChange('name')}
                  blur={handleBlur('name')}
                  state={values.name}
                />
                {errors.name && (
                  <Text style={{color: 'red', marginTop: 5}}>
                    {errors.name}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={{
                alignItems: 'center',
                gap: 30,
                marginHorizontal: 20,
                marginTop: perHeight(100),
              }}>
              <Button
                text={'SUBSCRIBE'}
                onClick={() => {
                  handleWait(values);
                }}
                textStyle={{color: '#fff', fontSize: 20}}
                style={{
                  width: SIZES.width * 0.85,
                  borderRadius: 10,
                  height: 45,
                  backgroundColor: colors.parpal,
                }}
              />
              <View>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    width: '80%',
                    textAlign: 'center',
                    marginTop: 0,
                  }}>
                  You will be notified as soon we launch 🎉
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
}
