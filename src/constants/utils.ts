import * as ImagePicker from 'react-native-image-picker';

export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


// async function storagePermission() {
//   const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
//   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       // if get here, the user has accepted the permissions
//       launchImageLibrary()
//   } else {
//       // if get here, the user did NOT accepted the permissions
//   }
// }

export const launchImageLibrary = async () => {
  const options = {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
  };
  try {
    const response = await ImagePicker.launchImageLibrary(options)
    if (response.didCancel) {
      console.log('User cancelled photo picker');
    } else if (response?.error) {
      console.log('ImagePicker Error: ', response?.error);
    } else {
      if (response.assets && response.assets.length) {
        return response.assets[0]
      }
    }
  } catch (error) {
    console.log('er', error);
  }
};

export const launchCamera = () => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  let imageObject = null
  ImagePicker.launchCamera(options, (response: any) => {

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      console.log('response.assets[0]', response.assets[0]);

      imageObject = response.assets[0]
    }
  });
  if (imageObject) {
    return imageObject
  }

}

export const allCountry =  [
  { label: 'Lagos', value: 'Lagos' },
  { label: 'Kano', value: 'Kano' },
  { label: 'Ibadan', value: 'Ibadan' },
  { label: 'Port Harcourt', value: 'Port Harcourt' },
  { label: 'Benin', value: 'Benin' },
  { label: 'Kaduna', value: 'Kaduna' },
  { label: 'Abuja', value: 'Abuja' },
  { label: 'Maiduguri', value: 'Maiduguri' },
  { label: 'Zaria', value: 'Zaria' },
  { label: 'Aba', value: 'Aba' },
  { label: 'Jos', value: 'Jos' },
  { label: 'Ilorin', value: 'Ilorin' },
  { label: 'Oyo', value: 'Oyo' },
  { label: 'Enugu', value: 'Enugu' },
  { label: 'Abeokuta', value: 'Abeokuta' },
  { label: 'Sokoto', value: 'Sokoto' },
  { label: 'Onitsha', value: 'Onitsha' },
  { label: 'Warri', value: 'Warri' },
  { label: 'Ebute', value: 'Ebute' },
  { label: 'Okene', value: 'Okene' },
  { label: 'Calabar', value: 'Calabar' },
  { label: 'Uyo', value: 'Uyo' },
  { label: 'Katsina', value: 'Katsina' },
  { label: 'Ado-Ekiti', value: 'Ado-Ekiti' },
  { label: 'Akure', value: 'Akure' },
  { label: 'Lekki', value: 'Lekki' },
  { label: 'Bauchi', value: 'Bauchi' },
  { label: 'Ikeja', value: 'Ikeja' },
  { label: 'Makurdi', value: 'Makurdi' },
  { label: 'Minna', value: 'Minna' },
  { label: 'Efon-Alaaye', value: 'Efon-Alaaye' },
  { label: 'Ilesa', value: 'Ilesa' },
  { label: 'Owo', value: 'Owo' },
  { label: 'Umuahia', value: 'Umuahia' },
  { label: 'Ondo', value: 'Ondo' },
  { label: 'Ikot Ekpene', value: 'Ikot Ekpene' },
  { label: 'Iwo', value: 'Iwo' },
  { label: 'Gombe', value: 'Gombe' },
  { label: 'Jimeta', value: 'Jimeta' },
  { label: 'Atani', value: 'Atani' },
  { label: 'Gusau', value: 'Gusau' },
  { label: 'Mubi', value: 'Mubi' },
  { label: 'Ikire', value: 'Ikire' },
  { label: 'Owerri', value: 'Owerri' },
  { label: 'Shagamu', value: 'Shagamu' },
  { label: 'Ijebu-Ode', value: 'Ijebu-Ode' },
  { label: 'Ugep', value: 'Ugep' },
  { label: 'Chakwama', value: 'Chakwama' },
  { label: 'Nnewi', value: 'Nnewi' },
  { label: 'Ise-Ekiti', value: 'Ise-Ekiti' },
]