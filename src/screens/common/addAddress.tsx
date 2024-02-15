import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
// import {COLORS, FONTS} from '../../constants/colors';

import colors from '../../constants/colors';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {perHeight, perWidth} from '../../utils/position/sizes';
import Text1 from '../../components/Textcomp';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import requestPermissions from 'react-native-maps';
import tw from 'twrnc';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, request} from 'react-native-permissions';
// import MapViewDirections from 'react-native-maps-directions';
// import {CurrentstateContext} from '../../helpers/clocation_context';
// import Buttonreactive from '../../components/common/Buttonreactive';
import axios from 'axios';
import images from '../../constants/images';
import {updateUserData} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import Button from '../../components/Button';
import {ToastLong, ToastShort} from '../../utils/utils';

const AddAddress = ({navigation}: any) => {
  const [description, setdescription] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const markers = [
    {id: 1, latitude: 37.78825, longitude: -122.4324, title: 'Marker 1'},
    {id: 2, latitude: 37.75825, longitude: -122.4624, title: 'Marker 2'},
  ];
  // Calculate latitude and longitude deltas
  const latitudes = markers.map(marker => marker.latitude);
  const longitudes = markers.map(marker => marker.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLong = Math.min(...longitudes);
  const maxLong = Math.max(...longitudes);
  const latitudeDelta = maxLat - minLat;
  const longitudeDelta = maxLong - minLong;
  // Set the initial region
  const initialRegion = {
    latitude: (maxLat + minLat) / 2,
    longitude: (maxLong + minLong) / 2,
    latitudeDelta,
    longitudeDelta,
  };

  //
  const [menumodal, setmenumodal] = useState(false);
  useEffect(() => {
    new requestPermissions();
  }, []);
  // const {clocationState, setclocationState} = useContext(CurrentstateContext);
  const [location, setlocation] = useState({});
  console.log('here__', location);
  const [selectedLocation, setSelectedLocation] = useState(null);
  useEffect(() => {
    const requestLocationPermission = async () => {
      const permissionStatus = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      console.log('loc_status', permissionStatus);

      if (permissionStatus === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            setSelectedLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            console.log(position);
            fetchAddress(position.coords.latitude, position.coords.longitude);
          },
          error => console.log('Error getting location:', error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.warn('Location permission denied');
      }
    };
    requestLocationPermission();
  }, []);
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDp32iWaShk9E_wTNtJbAkNXqdishmZnE8`,
      );
      if (response.data.results.length > 0) {
        setdescription(response.data.results[0].formatted_address);
      }
    } catch (error) {
      console.log('Error fetching address:', error);
    }
  };
  const handleMapPress = event => {
    console.log(event.nativeEvent);
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
    fetchAddress(
      event.nativeEvent.coordinate.latitude,
      event.nativeEvent.coordinate.longitude,
    );

    const region = calculateMinMaxCoordinates([
      {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      },
    ]);

    console.log('region', region);
  };

  function calculateMinMaxCoordinates(coordinates: string | any[]) {
    if (coordinates.length === 0) {
      return null;
    }
    let minLatitude = coordinates[0].latitude;
    let maxLatitude = coordinates[0].latitude;
    let minLongitude = coordinates[0].longitude;
    let maxLongitude = coordinates[0].longitude;

    for (const coord of coordinates) {
      minLatitude = Math.min(minLatitude, coord.latitude);
      maxLatitude = Math.max(maxLatitude, coord.latitude);
      minLongitude = Math.min(minLongitude, coord.longitude);
      maxLongitude = Math.max(maxLongitude, coord.longitude);
    }

    const midLat = (minLatitude + maxLatitude) / 2;
    const midLng = (minLongitude + maxLongitude) / 2;
    const deltaLat = maxLatitude - minLatitude;
    const deltaLng = maxLongitude - minLongitude;

    setregionParam({
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat,
      longitudeDelta: deltaLng,
    });
    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat,
      longitudeDelta: deltaLng,
    };
  }

  const upload = async (param: string) => {
    if (!selectedLocation) {
      ToastLong('Please pick an address!.');
      return;
    }
    const res: any = await updateUserData({
      geoLocation: {
        type: 'Point',
        coordinates: [selectedLocation?.longitude, selectedLocation?.latitude],
      },
      address: description,
    });
    console.log('result', res?.data);
    if (res?.status === 200 || res?.status === 201) {
      navigation.goBack();
    } else {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };
  const uploadCurremt = async (lat: any, lng: any) => {
    if (!lat || !lng) {
      ToastLong('Please pick an address!.');
      return;
    }
    const res: any = await updateUserData({
      geoLocation: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      address: description,
    });
    console.log('result', res?.data);
    if (res?.status === 200 || res?.status === 201) {
      navigation.goBack();
    } else {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };

  const [regionParam, setregionParam] = useState({
    latitude: selectedLocation ? selectedLocation?.latitude : 0,
    longitude: selectedLocation ? selectedLocation?.longitude : 0,
    latitudeDelta: 0.02,
    longitudeDelta: 0.035,
  });

  const chooseCurrent = async () => {
    const permissionStatus = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );
    console.log('loc_status', permissionStatus);
    ToastShort(`Location permission : ${permissionStatus}`);
    if (permissionStatus === 'granted') {
      Geolocation.getCurrentPosition(
        async position => {
          setSelectedLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log(position);
          await fetchAddress(
            position.coords.latitude,
            position.coords.longitude,
          );
          await uploadCurremt(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        error => console.log('Error getting location:', error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      console.warn('Location permission denied');
      ToastShort('Location permission denied');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={[tw`h-[40%]`]}>
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          showsUserLocation={true}
          mapType="standard"
          onPress={handleMapPress}
          region={{
            latitude: selectedLocation ? selectedLocation?.latitude : 0,
            longitude: selectedLocation ? selectedLocation?.longitude : 0,
            latitudeDelta: 0.02,
            longitudeDelta: 0.035,
          }}>
          {selectedLocation && <Marker coordinate={selectedLocation} />}
          {location && location.latitude && (
            <Marker
              coordinate={{
                // latitude: location?.latitude,
                // longitude: location?.longitude,
                latitude: 6.524674,
                longitude: 3.3792,
              }}
              title="Origin"
              description={'Me'}
              identifier="Origin"
            />
          )}
          <Marker
            coordinate={{
              latitude: 1.3456,
              longitude: 6.364674,
            }}
            title="Origin"
            description={'Me'}
            identifier="Origin"
          />
        </MapView>
      </View>
      <View style={tw`bg-white  flex-1  py-4 `}>
        <View style={[tw``, {marginTop: perHeight(0)}]}>
          <View style={[tw`px-[5%]`, {}]}>
            <View style={{}}>
              <Text1
                text={'Add your address'}
                size={20}
                lineHeight={20}
                color={'#172A3A'}
                style={[tw`  `, {fontWeight: '500'}]}
              />
            </View>

            <View style={tw` mt-3`}>
              <Text1
                text={'Kindly input your home address below'}
                size={14}
                color={colors.primary}
                lineHeight={16}
                fontFamily={'Inter-Medium'}
                style={[tw` `]}
              />
            </View>
          </View>
        </View>
        <View style={[tw` mt-3 px-[5.5%]`, {}]}>
          <GooglePlacesAutocomplete
            placeholder="Pick Address"
            textInputProps={{
              placeholderTextColor: 'black',
              returnKeyType: 'search',
            }}
            styles={{
              container: {
                flex: 0,
                color: 'black',
              },
              textInput: {
                fontSize: 14,
                borderRadius: 10,
                backgroundColor: '#F2F2F2',
                color: 'black',
              },
              textInputContainer: {
                paddingHorizontal: 5,
              },
              description: {color: 'black'},
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
            query={{
              // key: 'AIzaSyBh4G4L8MGiDDxJcSDRPj9jI-BzdiaQo2U',
              key: 'AIzaSyBGv53NEoMm3uPyA9U45ibSl3pOlqkHWN8',
              language: 'en',
              components: 'country:NG',
              // components: 'country:ng',
              // strictbounds: false,
            }}
            fetchDetails={true}
            // renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              // console.log(data, details);
              // setbookrideState({
              //   location: details?.geometry.location,
              //   description: data.description,
              // });
              // console.log('hgfd',details?.geometry);
              setSelectedLocation({
                latitude: details?.geometry.location.lat,
                longitude: details?.geometry.location.lng,
              });
              setdescription(data.description);
              //   initbookride(data.description);
            }}
            debounce={400}
            nearbyPlacesAPI="GooglePlacesSearch"
            enablePoweredByContainer={false}
          />
        </View>
        {false && (
          <View style={tw` mt-3 mx-[5%] flex flex-col`}>
            <Text1
              text={'Location:'}
              size={14}
              color={colors.black}
              lineHeight={16}
              style={[tw`font-700 `]}
            />
            <View style={tw`w-[95%] `}>
              <Text1
                text={`${description}`}
                size={14}
                color={colors.primary}
                lineHeight={16}
                style={[tw`font-600 `]}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={async () => {
            const permissionStatus = await request(
              Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            );

            if (permissionStatus === 'granted') {
              Geolocation.getCurrentPosition(
                async position => {
                  setSelectedLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });
                  await fetchAddress(
                    position.coords.latitude,
                    position.coords.longitude,
                  );
                  await uploadCurremt(
                    position.coords.latitude,
                    position.coords.longitude,
                  );
                },
                error => {
                  console.log('Error getting location:', error);
                  ToastLong(
                    'Failed to get current location. Please try again.',
                  );
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
              );
            } else {
              console.warn('Location permission denied');
              ToastShort('Location permission denied');
            }
          }}
          // onPress={() => {
          //   // upload('');
          //   chooseCurrent();
          // }}
          style={tw`w-[90%] bg-[#A1A1A11A] p-2 px-3 rounded-lg mt-4 mx-auto `}>
          <View style={tw`flex flex-row items-center `}>
            <Image source={images.location} style={{width: 25, height: 25}} />
            <Text1
              text={'Current Location'}
              size={14}
              color={colors.parpal}
              lineHeight={16}
              style={[tw`font-600 ml-2`]}
            />
          </View>
          <Text1
            text={'Tap to select current Location'}
            size={12}
            color={'#000000'}
            lineHeight={16}
            style={[tw`font-600 `]}
          />
        </TouchableOpacity>
        {/* <View style={[tw`mx-auto mt-4`, {width: perWidth(364)}]}>
          <TextInput
            style={[
              tw`bg-[#F2F2F2] text-black px-4  mx-4 rounded-lg`,
              {height: perHeight(85)},
            ]}
            placeholder="Enter Extra Info"
          />
        </View> */}
        <View style={tw`bg-white mt-4`}>
          {/* <Buttonreactive
            condition={true}
            text={'Save'}
            func={() => {}}
            margin={0.03}
          /> */}
        </View>

        {!isLoading ? (
          <View style={{marginHorizontal: 25, marginTop: 45}}>
            <Button
              onClick={() => {
                upload('');
              }}
              style={{
                marginBottom: 20,
                marginTop: 20,
                marginHorizontal: 40,
                backgroundColor: colors.lightBlack,
              }}
              textStyle={{color: colors.primary}}
              text={'Save'}
            />
          </View>
        ) : (
          <ActivityIndicator
            style={{marginTop: 95, marginBottom: 40}}
            size={'large'}
            color={colors.parpal}
          />
        )}
      </View>
      <SafeAreaView
        style={[
          tw`flex flex-row justify-between items-center `,
          {position: 'absolute', top: 0, right: 0, left: 15},
          styles.and,
        ]}>
        {/* <Mapbackicon /> */}
        {/* <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.back} style={{width: 20, height: 20}} />
        </TouchableOpacity> */}
        <View
          style={[
            tw`w-1/2 ${
              menumodal ? 'absolute' : 'hidden'
            } rounded-xl py-3 px-[10%] items-center  z-3 right-6 bg-white `,
            {top: 90},
          ]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ridehistory')}
            style={tw` py-4  justify-center border-b border-[#F2f2f2] w-full`}>
            <Text1
              text={'Ride history'}
              size={16}
              color={colors.black}
              style={[{fontWeight: '400'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // setdetelemodal(true), setdeleteItem(item);
            }}
            style={tw`py-4  justify-center w-full`}>
            <Text1
              text={'Enter promo code'}
              size={16}
              color={colors.black}
              style={[{fontWeight: '400'}]}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default AddAddress;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  and: {
    marginTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 20
        : StatusBar.currentHeight,
  },
});
