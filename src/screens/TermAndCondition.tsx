import React from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import images from '../constants/images';
import commonStyle from '../constants/commonStyle';
import Header from '../components/Header';

const {width, height} = Dimensions.get('screen');

export default function TermAndCondition() {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        image={images.back}
        title={'Privacy Policy'}
        style={{backgroundColor: '#fff'}}
        imageStyle={{tintColor: '#000'}}
        textStyle={{color: '#000'}}
      />
      <ScrollView>
        <Text
          style={{
            fontSize: 16,
            fontFamily: commonStyle.fontFamily.medium,
            color: '#000',
            fontWeight: '700',
            textAlign: 'center',
            marginTop: 30,
          }}>
          Terms of Service for Pureworker App
        </Text>
        <View style={{marginHorizontal: 20}}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 30,
              fontFamily: commonStyle.fontFamily.regular,
              color: '#000',
              marginTop: 30,
            }}>
            These Terms of Service ("Terms") constitute a legally binding
            agreement between Pureworker ("Pureworker", "we", "us", or "our"),
            and you, the user of the Pureworker app ("you", "your", or "user").
            By accessing or using the Pureworker app, you agree to be bound by
            these Terms, our Privacy Policy, and any additional terms and
            conditions that are referenced herein or that otherwise apply to
            your use of the Pureworker app.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              1. Overview of the Pureworker App
            </Text>
            {'\n'}
            {'\n'}
            The Pureworker app is a platform that connects Customers,
            Freelancers, and Businesses in Nigeria seeking to buy and sell
            services. Customers can search for services on the app, and
            Freelancers and Businesses located nearest to the customer's
            location will be chosen to provide quotes. The customer can then
            select the Freelancer or Business they prefer, and schedule the job
            with them. After the service, the customer can review the Freelancer
            or Business, and the Freelancer or Business can review the customer.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              2. Registration and Use of the Pureworker App
            </Text>
            {'\n'}
            {'\n'}
            To use the Pureworker app, you must register and create an account.
            When registering, you agree to provide accurate, current, and
            complete information about yourself, and to update such information
            as necessary to maintain its accuracy. You also agree to keep your
            login credentials confidential, and to immediately notify Pureworker
            if you become aware of any unauthorized use of your account.
            {'\n'}
            You agree to use the Pureworker app in accordance with these Terms,
            and to comply with all applicable laws and regulations. You agree
            not to use the Pureworker app for any illegal or fraudulent
            activities.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              3. Cancellation of Orders
            </Text>
            {'\n'}
            {'\n'}
            Orders can only be canceled 5 hours before the scheduled delivery
            time. If a customer cancels an order within 5 hours of the scheduled
            delivery time, the Freelancer or Business may dispute the
            cancellation.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              4. Order Status
            </Text>
            {'\n'}
            {'\n'}
            Orders on the Pureworker app can have the following statuses: -
            Order Placed: The customer places an order for a service. - Order In
            Progress: The Freelancer or Business works on the job, and the
            customer can track the progress in real-time. They can also
            communicate with the Freelancer or Business through the app's
            messaging system. - Order Delivered: Once the Freelancer or Business
            completes the job, they indicate through the app. The customer has
            the option to request revisions or approve the job. - Order Dispute:
            If the customer is not satisfied with the job, they can dispute the
            order, and the app's support team will investigate the issue and
            provide a resolution. - Order Completed: The customer approves the
            job, and the order is marked as completed. The Freelancer or
            Business receives payment for their work. - Order Canceled: The
            customer or Freelancer or Business cancels the order before
            completion.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              5. Fees
            </Text>
            {'\n'}
            {'\n'}
            Pureworker charges a service fee of 20% for each service rendered by
            Freelancers and Businesses on the platform. Additionally,
            Freelancers and Businesses pay a one-time registration fee of
            #5,000.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              6. Location Tracking
            </Text>
            {'\n'}
            {'\n'}
            The Pureworker app may allow customers to view the location of
            Freelancers or Businesses. This feature is only available for
            on-site services, and customers will only be able to view the
            location 1 hour before the scheduled delivery time. For off-site
            services, the customer will not be able to view the location at all.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              7. Dispute Resolution
            </Text>
            {'\n'}
            {'\n'}
            If a dispute arises between a customer and a Freelancer or Business,
            the parties should first try to resolve the dispute themselves. If
            the dispute cannot be resolved, the customer can file a dispute with
            Pureworker. Pureworker will investigate the dispute and provide a
            resolution.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              8. Termination
            </Text>
            {'\n'}
            {'\n'}
            We may terminate your access to and use of the Pureworker app at
            anytime without notice or liability, including if we determine in
            our sole discretion that:
            {'\n'}- You have violated any provision of these Terms of Service
            {'\n'}- Your use of the Pureworker app violates any applicable law
            or regulation{'\n'}- Your conduct is harmful to our business
            interests, reputation or goodwill, or to any other users of the
            Pureworker app
            {'\n'}
            Upon termination, you must immediately stop using the Pureworker app
            and delete any copies of the app in your possession or control.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              9. Intellectual Property
            </Text>
            {'\n'}
            {'\n'}
            All content and materials available on the Pureworker app, including
            but not limited to trademarks, logos, graphics, images, text,
            software, and the arrangement of such content and materials
            (collectively, the "Content"), are owned or licensed by Pureworker
            and are protected by Nigerian and international copyright,
            trademark, patent, trade secret, and other intellectual property or
            proprietary rights laws.
            {'\n'}
            You may not use, reproduce, distribute, display, modify, or create
            derivative works of any of the Content without our prior written
            permission. Any unauthorized use of the Content may violate
            copyright, trademark, and other applicable laws and could result in
            criminal or civil penalties.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              10. Disclaimer of Warranties
            </Text>
            {'\n'}
            {'\n'}
            The Pureworker app and all content, materials, and services
            available through the app are provided on an "as is" and "as
            available" basis, without warranties of any kind, either express or
            implied. Pureworker disclaims all warranties, express or implied,
            including but not limited to implied warranties of merchantability,
            fitness for a particular purpose, non-infringement, and title.
            {'\n'}
            Pureworker does not warrant that the app or any of its content,
            materials, or services will be uninterrupted, error-free, or free
            from viruses or other harmful components. You acknowledge that your
            use of the app and its content, materials, and services is at your
            sole risk.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              11. Limitation of Liability
            </Text>
            {'\n'}
            {'\n'}
            In no event shall Pureworker or its affiliates, directors, officers,
            employees, agents, or licensors be liable for any direct, indirect,
            incidental, special, consequential, punitive, or exemplary damages
            arising out of or in connection with your use of the app or its
            content, materials, or services, even if Pureworker has been advised
            of the possibility of such damages.
            {'\n'}
            If any jurisdiction does not allow the exclusion or limitation of
            liability for consequential or incidental damages, the liability of
            Pureworker and its affiliates, directors, officers, employees,
            agents, or licensors shall be limited to the greatest extent
            permitted by law.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              12. Indemnification
            </Text>
            {'\n'}
            {'\n'}
            You agree to indemnify, defend, and hold harmless Pureworker and its
            affiliates, directors, officers, employees, agents, and licensors
            from and against all claims, losses, expenses, damages, and costs,
            including reasonable attorneys' fees, arising out of or in
            connection with your use of the app, your violation of these Terms
            of Service, or your violation of any applicable law or regulation.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              13. Governing Law and Jurisdiction
            </Text>
            {'\n'}
            {'\n'}
            These Terms of Service shall be governed by and construed in
            accordance with the laws of Nigeria without regard to its conflict
            of law provisions. Any dispute arising out of or in connection with
            these Terms of Service shall be resolved in the courts of Nigeria.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              14. Changes to Terms of Service
            </Text>
            {'\n'}
            {'\n'}
            We reserve the right, at our sole discretion, to modify or replace
            these Terms of Service at any time. If we make material changes to
            these Terms of Service, we will notify you by posting the new terms
            on the Pureworker app or sending you an email or other
            communication. Your continued use of the app following the posting
            of any changes to these Terms of Service constitutes your acceptance
            of those changes.
            {'\n'}
            {'\n'}
            <Text
              style={{
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.medium,
                color: '#000',
                fontWeight: '700',
              }}>
              15. Entire Agreement
            </Text>
            {'\n'}
            {'\n'}
            These Terms of Service constitute the entire agreement between you
            and Pureworker with respect to the use of the Pureworker app and its
            content, materials, and services and supersede all prior or
            contemporaneous communications and proposals,
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
