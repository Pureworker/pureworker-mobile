// import React from 'react';
// import DeviceInfo from 'react-native-device-info';
// export const UniqueId = DeviceInfo.getUniqueIdSync();
// export const Model = DeviceInfo.getModel();
// export const Brand = DeviceInfo.getBrand();
// export const DeviceId = DeviceInfo.getDeviceId();
// export const DeviceMac = DeviceInfo.getMacAddress();

// DeviceInfoUtil.js

import DeviceInfo from 'react-native-device-info';

export const getUniqueId = async () => {
  try {
    return await DeviceInfo.getUniqueId();
  } catch (error) {
    console.error('Error fetching unique ID:', error);
    return null;
  }
};
export const getModel = async () => {
  try {
    return await DeviceInfo.getModel();
  } catch (error) {
    console.error('Error fetching model:', error);
    return null;
  }
};

export const getBrand = async () => {
  try {
    return await DeviceInfo.getBrand();
  } catch (error) {
    console.error('Error fetching brand:', error);
    return null;
  }
};

export const getDeviceId = async () => {
  try {
    return await DeviceInfo.getDeviceId();
  } catch (error) {
    console.error('Error fetching device ID:', error);
    return null;
  }
};

export const getDeviceMac = async () => {
  try {
    return await DeviceInfo.getMacAddress();
  } catch (error) {
    console.error('Error fetching device MAC address:', error);
    return null;
  }
};
