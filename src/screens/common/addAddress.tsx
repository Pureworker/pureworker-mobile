import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
// import {COLORS, FONTS} from '../../constants/colors';

import colors from '../../constants/colors';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {perHeight, perWidth} from '../../utils/position/sizes';
import Text1 from '../../components/Textcomp';
import React, {useContext, useEffect, useState} from 'react';
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

const AddAddress = ({navigation}: any) => {
  // const homePlace = {
  //   description: 'Home',
  //   geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
  // };
  // const workPlace = {
  //   description: 'Work',
  //   geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
  // };
  const [description, setdescription] = useState('');
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

  const [regionParam, setregionParam] = useState({
    latitude: selectedLocation ? selectedLocation?.latitude : 0,
    longitude: selectedLocation ? selectedLocation?.longitude : 0,
    latitudeDelta: 0.02,
    longitudeDelta: 0.035,
  });

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
          {/* {bookrideState.location && (
            <Marker
              coordinate={{
                latitude: bookrideState.location.lat,
                longitude: bookrideState.location.lng,
              }}
              title="Destination"
              description={bookrideState.description}
              identifier="Origin"
            />
          )} */}
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
          {/* {bookrideState.location ? (
            location ? (
              location?.latitude ? (
                <MapViewDirections
                  apikey={'AIzaSyDp32iWaShk9E_wTNtJbAkNXqdishmZnE8'}
                  origin={{
                    latitude: 6.524674,
                    longitude: 3.3792,
                  }}
                  destination={{
                    latitude: bookrideState.location.lat,
                    longitude: bookrideState.location.lng,
                  }}
                  strokeWidth={3}
                  strokeColor={'#FF7A00'}
                  mode={'DRIVING'}
                />
              ) : null
            ) : null
          ) : null} */}

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
                text={'Add your  address'}
                size={20}
                lineHeight={20}
                color={'#172A3A'}
                // fontFamily="Roboto-Bold"
                style={[tw`  `, {fontWeight: '500'}]}
              />
            </View>

            <View style={tw` mt-3`}>
              <Text1
                text={'Kindly input your home address below'}
                size={14}
                color={colors.primary}
                lineHeight={16}
                fontFamily={'Roboto-Medium'}
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
        <View style={tw` mt-3 mx-[5%] flex flex-row`}>
          <Text1
            text={'Address:'}
            size={14}
            color={colors.primary}
            lineHeight={16}
            // fontFamily={'Roboto-Regular'}
            style={[tw` `]}
          />
          <View style={tw`w-[80%] `}>
            <Text1
              text={`${description}`}
              size={14}
              color={colors.primary}
              lineHeight={16}
              // fontFamily={'Roboto-Bold'}
              style={[tw`ml-2 `]}
            />
          </View>
        </View>

        <View style={[tw`mx-auto mt-4`, {width: perWidth(364)}]}>
          <TextInput
            style={[tw`bg-[#F2F2F2] px-4  mx-4 rounded-lg`, {height: perHeight(85)}]}
            placeholder="Enter Extra Info"
          />
        </View>
        {/* <View style={[tw`mx-auto mt-4`, {width: perWidth(364)}]}>
          <TextInput
            style={[tw`bg-[#F2F2F2] px-4 rounded-lg`, {height: perHeight(50)}]}
            placeholder="Address label (e.g chill spot) "
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
      </View>

      <SafeAreaView
        style={[
          tw`flex flex-row justify-between items-center `,
          {position: 'absolute', top: 0, right: 0, left: 15},
          styles.and,
        ]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          {/* <Mapbackicon /> */}
          <Image source={images.back} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        {/* <TouchableOpacity
            style={tw``}
            onPress={() => {
              setmenumodal(!menumodal);
            }}>
            <Image
              resizeMode="cover"
              source={require('../../assets/icons/mapmenu.png')}
              style={{
                width: 50,
                height: 50,
              }}
            />
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
