import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {HEIGHT_WINDOW, WIDTH_WINDOW} from '../constants/generalStyles';

const OrdersDeclineReason = ({
  selectedReason,
  handleSelectedReasons,
  otherReason,
  setOtherReason,
  handleCancel,
  setModalSection,
}) => {
  const DeclineReasons = [
    'Change of plans',
    'Service Provider did not move',
    'Accidental Request',
    'Service Provider asked me to cancel',
    'Change of Job Requirement',
    'Personal Emergency',
    'Financial Constraints',
    'Others',
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.reasonModalMainWrapper}
        contentContainerStyle={{paddingBottom: 200}}>
        <Pressable onPress={() => setModalSection('All')}>
          <Text style={styles.closeButtonText}>x</Text>
        </Pressable>

        <Text
          style={{
            color: 'rgba(136, 8, 123, 1)',
            fontSize: 18,
            fontWeight: '500',
          }}>
          What went wrong?
        </Text>

        {DeclineReasons.map(reason => {
          const isSelected = reason === selectedReason;
          return (
            <Pressable
              style={styles.reasonItem}
              onPress={() => handleSelectedReasons(reason)}>
              <Text style={styles.reasonText}>{reason}</Text>

              <View
                style={
                  isSelected ? styles.selectedReason : styles.reasonSelection
                }
              />
            </Pressable>
          );
        })}

        {selectedReason.toLowerCase() === 'others' && (
          <View style={{marginTop: 10}}>
            <TextInput
              value={otherReason}
              onChangeText={e => setOtherReason(e)}
              numberOfLines={5}
              placeholder="Enter your reason"
              style={styles.otherReasonTextBox}
            />
          </View>
        )}

        <Pressable onPress={handleCancel} style={styles.done}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default OrdersDeclineReason;

const styles = StyleSheet.create({
  reasonSelection: {
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(136, 8, 123, 1)',
  },
  selectedReason: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(136, 8, 123, 1)',
  },
  reasonText: {
    color: 'rgba(0, 4, 19, 1)',
    fontSize: 14,
  },
  reasonWrapper: {
    width: '100%',
    paddingVertical: 10,
  },
  closeButtonText: {
    fontSize: 25,
    fontWeight: '600',
    color: 'rgba(0, 4, 19, 1)',
  },
  reasonModalMainWrapper: {
    marginTop: '20%',
    // height: '80%',

    backgroundColor: 'rgba(235, 235, 235, 1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    // alignSelf: 'baseline',
  },
  otherReasonTextBox: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(217, 217, 217, 1)',
    paddingHorizontal: 10,
  },
  container: {
    width: WIDTH_WINDOW,
    height: HEIGHT_WINDOW,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(235, 235, 235, 1)',
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 4, 19, 1)',
  },
  done: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: 'rgba(45, 48, 60, 1)',
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  doneText: {
    textAlign: 'center',
    color: 'rgba(255, 199, 39, 1)',
    fontWeight: '700',
    fontSize: 17,
  },
});
