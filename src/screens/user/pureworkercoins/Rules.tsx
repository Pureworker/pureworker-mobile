import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import commonStyle from '../../../constants/commonStyle';
import {useNavigation} from '@react-navigation/native';

const Rules = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color={colors.black} />
        <Text style={styles.headerText}>Rules of Pure Coins</Text>
      </TouchableOpacity>

      <View style={styles.ruleSections}>
        <View style={styles.ruleItem}>
          <Text>
            <Text style={styles.ruleItemTextHeader}>Daily Coin Claim: </Text>
            <Text style={styles.ruleItemText}>
              Users can claim 5 Pure Coins daily by logging into the Pureworker
              app.
            </Text>
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text>
            <Text style={styles.ruleItemTextHeader}>Spin to Win:</Text>
            <Text style={styles.ruleItemText}>
              Users can spin a daily wheel to win additional Pure Coins or Naira
              prizes. The wheel offers a range of prizes, including varying
              amounts of Pure Coins and Naira. Each spin is limited to once per
              day.
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.ruleSections}>
        <Text style={styles.ruleItemTextHeader}>General Rules:</Text>
        <View style={styles.ruleItem}>
          <Text>
            <Text style={styles.ruleItemTextHeader}>
              Minimum Conversion Threshold:
            </Text>
            <Text style={styles.ruleItemText}>
              {' '}
              Users can convert their Pure Coins to Naira once they have
              accumulated a minimum of 1,000 coins.
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.ruleSections}>
        <Text style={styles.ruleItemTextHeader}>Conversion Process:</Text>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleItemText}>
            Once users reach the 1,000 Pure Coins threshold, they can convert
            their coins to Naira directly within the app.
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleItemText}>
            The converted amount will be credited to their Pureworker wallet,
            where they can withdraw or use it as needed.
          </Text>
        </View>
      </View>

      <View style={styles.ruleSections}>
        <Text style={styles.ruleItemTextHeader}>Additional Rules:</Text>
        <View style={styles.ruleItem}>
          <Text>
            <Text style={styles.ruleItemTextHeader}>Coin Accumulation:</Text>
            <Text style={styles.ruleItemText}>
              {' '}
              Coins earned from transactions and daily claims are cumulative
            </Text>
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Text>
            <Text style={styles.ruleItemTextHeader}>Coin Expiration:</Text>
            <Text style={styles.ruleItemText}>
              {' '}
              Pure Coins do not expire as long as the user is active on the
              platform. However, inactivity for more than 6 months may result in
              the forfeiture of accumulated coins.
            </Text>
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Text>
            <Text style={styles.ruleItemTextHeader}>Fraudulent Activity: </Text>
            <Text style={styles.ruleItemText}>
              {' '}
              Any attempt to manipulate the system or earn coins fraudulently
              will result in the suspension of the user's account and forfeiture
              of all accumulated coins.
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  headerText: {
    marginLeft: 10,
    color: colors.black,
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.medium,
  },

  ruleSections: {
    paddingHorizontal: 12,
    marginBottom: 24,
  },

  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  ruleItemTextHeader: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  ruleItemText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
  },
});

export default Rules;
