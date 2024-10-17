import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import colors from '../../constants/colors';
import commonStyle from '../../constants/commonStyle';
import images from '../../constants/images';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

const Processing = ({navigation, route}: any) => {
  const stat = route.params.status;
  const [status, setStatus] = useState(stat);
  const userData = useSelector((state: any) => state.user.userData);
  console.log('data', userData.verificationStatus, stat);

  const renderContent = () => {
    switch (status) {
      case 'Processing':
        return (
          <View style={styles.centeredContent}>
            <Image source={images.process} style={styles.image} />
            <Text style={styles.text}>Your request is being processed</Text>
          </View>
        );
      case 'Done':
        return (
          <View style={styles.centeredContent}>
            <Image source={images.success} style={styles.image} />
            <Text style={styles.text}>
              You have completed your registration. Please check your email for
              next steps.
            </Text>
          </View>
        );
      case 'Denied':
        return (
          <View style={styles.centeredContent}>
            <Image source={images.close} style={styles.image} />
            <Text style={styles.text}>Your request has been denied</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderButton = () => {
    if (status === 'Done') {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      );
    }
    if (status === 'Denied') {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log('Denied button pressed')}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      );
    }
    if (status === 'Processing') {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {userData.verificationStatus === 'rejected' ? (
        <>
          <View style={styles.centeredContent}>
            <Image source={images.close} style={styles.image} />
            <Text style={styles.text}>Your request has been denied</Text>
          </View>
        </>
      ) : (
        <>{renderContent()}</>
      )}

      {userData.verificationStatus === 'rejected' ? (
        <View style={styles.button2}>
          <TouchableOpacity
            style={{
              height: 50,
              marginBottom: 20,
              backgroundColor: colors.parpal,
              width: width - 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              marginHorizontal: 16,
            }}
            onPress={() => {
              navigation.navigate('PhotoUploadScreen');
            }}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 50,
              marginBottom: 40,
              backgroundColor: colors.primary,
              width: width - 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              marginHorizontal: 16,
            }}
            onPress={() => navigation.navigate('Home')}>
            <Text style={[styles.buttonText, {color: 'black'}]}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>{renderButton()}</>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.semibold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  button2: {
    position: 'absolute',
    bottom: 20,
  },

  button: {
    position: 'absolute',
    bottom: 20,
    width: width - 32,
    backgroundColor: colors.parpal,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.white,
    textAlign: 'center',
  },
});

export default Processing;
