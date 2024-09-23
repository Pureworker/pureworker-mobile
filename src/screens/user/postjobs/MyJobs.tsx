import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../constants/colors';
import commonStyle from '../../../constants/commonStyle';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {deleteJob, getAlljobs} from '../../../utils/api/jobs';
import {setallJobPosts} from '../../../store/reducer/mainSlice';
import moment from 'moment';
import {formatAmount2} from '../../../utils/validations';
import {ToastLong} from '../../../utils/utils';
import Snackbar from 'react-native-snackbar';
import {perWidth} from '../../../utils/position/sizes';
import Textcomp from '../../../components/Textcomp';
import tw from 'twrnc';

const MyJobs = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  // const [jobs, setJobs] = useState([
  //   {
  //     id: 1,
  //     title: 'Fashion Designer',
  //     description:
  //       'I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art ',
  //     price: '50,000',
  //     date: '02, May, 2024',
  //     image: images.product,
  //   },
  //   {
  //     id: 2,
  //     title: 'Graphic Designer',
  //     description:
  //       'I create visual concepts to communicate ideasI am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art ',
  //     price: '75,000',
  //     date: '05, May, 2024',
  //     image: null, // No image for this job, figma is optional yunk yunk!!!!!
  //   },
  //   // Other jobs...
  // ]);

  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();

  const allJobPosts = useSelector((state: any) => state.user.allJobPosts);
  const initGetJoobs = async () => {
    setisLoading(true);
    const res: any = await getAlljobs('');
    console.log('jobs', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(setallJobPosts(res?.data?.data));
    }
    setisLoading(false);
  };
  useEffect(() => {
    initGetJoobs();
  }, []);

  // Function to group jobs by date
  const groupJobsByDate = (jobs: any[]) => {
    const groupedJobs: any[] = [];

    jobs.forEach(job => {
      const formattedDate = moment(job.createdAt).format('DD, MMM, YYYY'); // Using moment for formatting

      // Check if the date already exists in groupedJobs
      const dateSection = groupedJobs.find(
        section => section.title === formattedDate,
      );

      if (dateSection) {
        dateSection.data.push(job); // Add job to the existing date section
      } else {
        groupedJobs.push({
          title: formattedDate,
          data: [job], // Create a new section for this date
        });
      }
    });

    return groupedJobs;
  };

  const sections = groupJobsByDate(allJobPosts); // Group jobs by date

  const handleDeleteJob = jobId => {
    setJobToDelete(jobId); // Set the job to be deleted
    setModalVisible(true); // Show the modal
  };

  const confirmDeleteJob = () => {
    // setJobs(jobs.filter(job => job.id !== jobToDelete));
    _deleteJobs(jobToDelete);
  };

  const _deleteJobs = async (param: any) => {
    console.log(param);
    try {
      const res: any = await deleteJob(param);
      console.log('delete result:', res?.data);
      if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
        ToastLong('Job deleted successfully');
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    } finally {
      initGetJoobs();
      setModalVisible(false); // Hide the modal
      setJobToDelete(null); // Reset the job to delete
      setisLoading(false);
    }
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.jobCard}>
        <View style={styles.jobCardHeader}>
          <View style={{width: '85%'}}>
            <Text style={styles.jobTitle}>{item?.service?.name}</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleDeleteJob(item._id ?? item?.id)}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={3} style={styles.jobDescription}>
          {item.description.length > 50
            ? item.description.substring(0, 50) + '...'
            : item.description}
        </Text>
        <View style={styles.jobFooter}>
          <Text style={styles.jobPrice}>₦{formatAmount2(item?.minPrice)}</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewJob(item)} // Pass the entire job object
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({section: {title}}: any) => (
    <Text style={styles.dateHeader}>{title}</Text>
  );

  const handleViewJob = (job: any) => {
    navigation.navigate('ProductDisplay', {job});
  };
  const userType = useSelector((state: any) => state.user.isLoggedIn);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color={colors.black}
            onPress={() => navigation.navigate('Orders')}
          />
          <Text style={styles.title}>Jobs Posted</Text>
        </View>
        <Text style={styles.subTitle}>
          {userType.userType === 'CUSTOMER'
            ? 'Delete the job post once you hire a service provider'
            : 'Do not take on jobs you can’t do.'}
        </Text>

        {allJobPosts?.length < 1 && (
          <View
            style={[
              tw` h-7/10  items-center justify-center`,
              {marginLeft: perWidth(0)},
            ]}>
            <Textcomp
              text={'There are no Job Posts.'}
              size={18}
              lineHeight={18}
              color={'#88087B'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        )}
        <SectionList
          sections={sections}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={tw`h-20`} />}
          contentContainerStyle={{paddingBottom: 20}}
        />

        {/* Confirmation Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete this job?
              </Text>
              <View style={styles.modalButtons}>
                <CustomButton
                  text="Yes"
                  onClick={confirmDeleteJob}
                  textStyle={{
                    color: colors.primary,
                    fontSize: 18,
                    fontFamily: commonStyle.fontFamily.semibold,
                  }}
                  style={[styles.modalButton, styles.cancelButton]}
                />
                <CustomButton
                  text="No"
                  onClick={() => setModalVisible(false)}
                  textStyle={{
                    color: colors.darkParpal,
                    fontSize: 18,
                    fontFamily: commonStyle.fontFamily.semibold,
                  }}
                  style={[styles.modalButton, styles.deleteButton]}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: commonStyle.fontFamily.bold,
    color: '#000000',
    width: '90%',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.darkGrey,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateHeader: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.semibold,
    color: colors.darkGrey,
    marginVertical: 10,
  },
  jobCard: {
    backgroundColor: '#2D303C',
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  jobTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.white,
  },
  jobDescription: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.white,
    marginBottom: 10,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobPrice: {
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.primary,
  },
  viewButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  viewButtonText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: commonStyle.fontFamily.semibold,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    height: 'auto',
    padding: 30,
  },
  modalText: {
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.semibold,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    width: '40%',
    height: 40,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: colors.darkPurple,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: colors.darkParpal,
    backgroundColor: colors.white,
  },
});

export default MyJobs;
