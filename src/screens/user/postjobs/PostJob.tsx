import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import commonStyle from '../../../constants/commonStyle';
import colors from '../../../constants/colors';
import CustomButton from '../../../components/Button';

const PostJob = ({submitJobDetails}: any) => {
  const navigation = useNavigation();
  const [jobDetails, setJobDetails] = useState({
    jobDescription: '',
    service: '',
    expectedDeliveryDate: '',
    address: '',
    priceRange: {min: '', max: ''},
    image: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setJobDetails({...jobDetails, [field]: value});
  };

  const handlePriceChange = (type: string, value: string) => {
    setJobDetails({
      ...jobDetails,
      priceRange: {...jobDetails.priceRange, [type]: value},
    });
  };

  const handleImageUpload = (image:any) => {
    setJobDetails({...jobDetails, image});
  };

  const handleSubmit = () => {
    // submitJobDetails(jobDetails);
    navigation.navigate('MyJobs');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={30}
          color={colors.black}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.titleTwo}>Post a Job</Text>
      </View>

      <View style={styles.formItem}>
        <Text style={styles.formTitle}>Job Description</Text>
        <TextInput
          style={[styles.formTextInput, styles.textArea]}
          numberOfLines={5}
          value={jobDetails.jobDescription}
          onChangeText={value => handleInputChange('jobDescription', value)}
          placeholder="Enter brief description about the service to be rendered"
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formItem}>
        <Text style={styles.formTitle}>Service</Text>
        <RNPickerSelect
          onValueChange={value => handleInputChange('service', value)}
          items={[
            {label: 'Plumbing', value: 'Plumbing'},
            {
              label: 'Tile Installation and Repair',
              value: 'Tile Installation and Repair',
            },
            {label: 'Furniture', value: 'Furniture'},
            {label: 'Painting', value: 'Painting'},
            {label: 'Baking', value: 'Baking'},
            {label: 'Home Tutoring', value: 'Home Tutoring'},
            {label: 'Maintenance service', value: 'Maintenance service'},
          ]}
          style={{
            inputAndroid: {
              color: colors.darkGrey,
              backgroundColor: colors.greyBG,
              padding: 10,
              borderRadius: 5,
              fontSize: 16,
              fontFamily: commonStyle.fontFamily.regular,
            },
            placeholder: {
              color: colors.grey,
            },
          }}
          placeholder={{
            label: 'Select service',
            value: null,
            color: colors.greyLight,
          }}
        />
      </View>

      <View style={styles.formItem}>
        <Text style={styles.formTitle}>Expected Delivery Date</Text>
        <TextInput
          style={styles.formTextInput}
          value={jobDetails.expectedDeliveryDate}
          onChangeText={value =>
            handleInputChange('expectedDeliveryDate', value)
          }
          placeholder="Enter your expected date"
        />
      </View>

      <View style={styles.formItem}>
        <Text style={styles.formTitle}>Address</Text>
        <TextInput
          style={styles.formTextInput}
          value={jobDetails.address}
          onChangeText={value => handleInputChange('address', value)}
          placeholder="Specify your delivery address"
        />
      </View>

      <View style={styles.formItem}>
        <Text style={styles.formTitle}>Price Range (₦)</Text>
        <View style={styles.priceRangeContainer}>
          <TextInput
            style={[styles.formTextInput, styles.priceInput]}
            value={jobDetails.priceRange.min}
            onChangeText={value => handlePriceChange('min', value)}
            placeholder="₦"
            keyboardType="numeric"
          />
          <Text style={styles.toText}>to</Text>
          <TextInput
            style={[styles.formTextInput, styles.priceInput]}
            value={jobDetails.priceRange.max}
            onChangeText={value => handlePriceChange('max', value)}
            placeholder="₦"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.formItem}>
        <Text style={styles.formTitle}>Upload an Image (Optional)</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleImageUpload(null)}>
          <AntDesign name="upload" size={30} color={colors.grey} />
          <Text style={styles.uploadText}>Upload or drop</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          text={'Cancel'}
          onClick={handleSubmit}
          borderColor={colors.primary}
          textStyle={{
            color: colors.primary,
            fontSize: 18,
            fontFamily: commonStyle.fontFamily.semibold,
          }}
          style={styles.cancelButton}
        />

        <CustomButton
          text={'Submit'}
          onClick={handleSubmit}
          borderColor={colors.darkParpal}
          textStyle={{
            color: colors.darkParpal,
            fontSize: 18,
            fontFamily: commonStyle.fontFamily.semibold,
          }}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEBEB',
    padding: 20,
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },

  titleTwo: {
    fontSize: 20,
    fontFamily: commonStyle.fontFamily.bold,
    color: '#000',
    width: '95%',
    textAlign: 'center',
  },
  formItem: {
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.semibold,
    marginBottom: 5,
    color: '#333',
  },
  formTextInput: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    backgroundColor: colors.greyBG,
    color: colors.darkGrey,
  },
  textArea: {
    height: 120,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    fontFamily: commonStyle.fontFamily.semibold,
  },
  toText: {
    marginHorizontal: 5,
    fontSize: 16,
    color: '#000',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#8D8D8D',
    borderRadius: 5,
    padding: 20,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    color: '#999999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    width: '48%',
    backgroundColor: colors.darkParpal,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },

  submitButton: {
    width: '48%',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
});

export default PostJob;
