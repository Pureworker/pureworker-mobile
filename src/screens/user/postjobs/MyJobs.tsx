import React, {useState} from 'react';
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
import images from '../../../constants/images';

const MyJobs = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Fashion Designer',
      description:
        'I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art ',
      price: '50,000',
      date: '02, May, 2024',
      image: images.product,
    },
    {
      id: 2,
      title: 'Graphic Designer',
      description:
        'I create visual concepts to communicate ideasI am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art I am a fashion designer with a creative visionary who transforms ideas into wearable art ',
      price: '75,000',
      date: '05, May, 2024',
      image: null, // No image for this job, figma is optional yunk yunk!!!!!
    },
    // Other jobs...
  ]);

  // Sort jobs by date in ascending order
  const sortedJobs = jobs.sort((a, b) => new Date(a.date) - new Date(b.date));

  const groupedJobs = sortedJobs.reduce((groups, job) => {
    const date = job.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(job);
    return groups;
  }, {});

  const sections = Object.keys(groupedJobs).map(date => ({
    title: date,
    data: groupedJobs[date],
  }));

  const handleDeleteJob = jobId => {
    setJobToDelete(jobId); // Set the job to be deleted
    setModalVisible(true); // Show the modal
  };

  const confirmDeleteJob = () => {
    setJobs(jobs.filter(job => job.id !== jobToDelete));
    setModalVisible(false); // Hide the modal
    setJobToDelete(null); // Reset the job to delete
  };

  const renderItem = ({item}: any) => (
    <View style={styles.jobCard}>
      <View style={styles.jobCardHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteJob(item.id)}>
          <MaterialCommunityIcons name="close" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.jobDescription}>
        {item.description.length > 50
          ? item.description.substring(0, 50) + '...'
          : item.description}
      </Text>
      <View style={styles.jobFooter}>
        <Text style={styles.jobPrice}>₦{item.price}</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewJob(item)} // Pass the entire job object
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionHeader = ({section: {title}}: any) => (
    <Text style={styles.dateHeader}>{title}</Text>
  );

  const handleViewJob = (job: any) => {
    navigation.navigate('ProductDisplay', {job});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color={colors.black}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Jobs Posted</Text>
        </View>
        <Text style={styles.subTitle}>
          Delete the job post once you hire a service provider
        </Text>
        <SectionList
          sections={sections}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
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
    color: '#000',
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
    backgroundColor: colors.darkGrey,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.semibold,
    color: colors.white,
  },
  jobDescription: {
    fontSize: 14,
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
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: colors.darkGrey,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: colors.darkParpal,
    backgroundColor: colors.white,
  },
});

export default MyJobs;
