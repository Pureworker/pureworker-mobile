import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { SIZES } from '../../utils/position/sizes';

const ViewLocation = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  //
  const latitude = 6.5244;
  const longitude = 3.3792;
  const fitToMarkers = () => {
    setloading(false);
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        {
          latitude: latitude,
          longitude: longitude,
        },
        {
          latitude: latitude + 0.00344,
          longitude: longitude + 0.0023455,
        },
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        },
      );
    }
  };
  const mapRef = React.createRef();
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight &&
                  StatusBar.currentHeight + getStatusBarHeight(true),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            paddingVertical:  10,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'View Location'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View style={tw`flex-1 bg-red-400 `}>
          <>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color={'white'} />
              </View>
            ) : (
              <>
                <MapView
                  // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={{height: SIZES.height * 0.9, width: SIZES.width}}
                  ref={mapRef}
                  mapType="standard"
                  region={{
                    latitude: latitude,
                    longitude: longitude,
                    // latitudeDelta: 0.005,
                    // longitudeDelta: 0.005,
                    latitudeDelta: 0.26,
                    longitudeDelta: 0.26,
                  }}
                  //added
                  userLocationFastestInterval={50}
                  showsCompass={true}
                  rotateEnabled={true}
                  onMapReady={fitToMarkers} // Fit the map when it's ready
                >
                  <Marker
                    coordinate={{
                      latitude: latitude,
                      longitude: longitude,
                    }}
                    title="Origin"
                    description="You"
                    identifier="Origin"
                    pinColor="red">
                    <Image
                      resizeMode="contain"
                      source={images.location}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                  </Marker>

                </MapView>
              </>
            )}
          </>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewLocation;
