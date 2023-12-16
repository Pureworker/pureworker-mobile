import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';

const PrivacyPolicy = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const [deactivateAccount, setdeactivateAccount] = useState(false);
  const [deleteAccount, setdeleteAccount] = useState(false);

  const data = [
    {
      header: 'Overview of the Pureworker App',
      text: "The Pureworker app is a platform that connects Customers, Freelancers, and Businesses in Nigeria seeking to buy and sell services. Customers can search for services on the app, and Freelancers and Businesses located nearest to the customer's location will be chosen to provide quotes. The customer can then select the Freelancer or Business they prefer, and schedule the job with them. After the service, the customer can review the Freelancer or Business, and the Freelancer or Business can review the customer.",
    },
    {
      header: 'Registration and Use of the Pureworker App',
      text: 'To use the Pureworker app, you must register and create an account. When registering, you agree to provide accurate, current, and complete information about yourself, and to update such information as necessary to maintain its accuracy. You also agree to keep your login credentials confidential, and to immediately notify Pureworker if you become aware of any unauthorized use of your account. You agree to use the Pureworker app in accordance with these Terms, and to comply with all applicable laws and regulations. You agree not to use the Pureworker app for any illegal or fraudulent activities.',
    },
    {
      header: 'Cancellation of Orders',
      text: 'Orders can only be canceled 5 hours before the scheduled delivery time. If a customer cancels an order within 5 hours of the scheduled delivery time, the Freelancer or Business may dispute the cancellation.',
    },
    {
      header: 'Order Status',
      text: "Orders on the Pureworker app can have the following statuses: - Order Placed: The customer places an order for a service. - Order In Progress: The Freelancer or Business works on the job, and the customer can track the progress in real-time. They can also communicate with the Freelancer or Business through the app's messaging system. - Order Delivered: Once the Freelancer or Business completes the job, they indicate through the app. The customer has the option to request revisions or approve the job. - Order Dispute: If the customer is not satisfied with the job, they can dispute the order, and the app's support team will investigate the issue and provide a resolution. - Order Completed: The customer approves the job, and the order is marked as completed. The Freelancer or Business receives payment for their work. - Order Canceled: The customer or Freelancer or Business cancels the order before completion.",
    },
    {
      header: 'Fees',
      text: 'Pureworker charges a service fee of 20% for each service rendered by Freelancers and Businesses on the platform. Additionally, Freelancers and Businesses pay a one-time registration fee of #5,',
    },
    {
      header: 'Location Tracking',
      text: 'The Pureworker app may allow customers to view the location of Freelancers or Businesses. This feature is only available for on-site services, and customers will only be able to view the location 1 hour before the scheduled delivery time. For off-site services, the customer will not be able to view the location at all.',
    },
    {
      header: 'Dispute Resolution',
      text: 'If a dispute arises between a customer and a Freelancer or Business, the parties should first try to resolve the dispute themselves. If the dispute cannot be resolved, the customer can file a dispute with Pureworker. Pureworker will investigate the dispute and provide a resolution.',
    },
    {
      header: 'Termination',
      text: 'We may terminate your access to and use of the Pureworker app at anytime without notice or liability, including if we determine in our sole discretion that: - You have violated any provision of these Terms of Service - Your use of the Pureworker app violates any applicable law or regulation - Your conduct is harmful to our business interests, reputation or goodwill, or to any other users of the Pureworker app Upon termination, you must immediately stop using the Pureworker app and delete any copies of the app in your possession or control.',
    },
    {
      header: 'Intellectual Property',
      text: 'All content and materials available on the Pureworker app, including but not limited to trademarks, logos, graphics, images, text, software, and the arrangement of such content and materials (collectively, the "Content"), are owned or licensed by Pureworker and are protected by Nigerian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You may not use, reproduce, distribute, display, modify, or create derivative works of any of the Content without our prior written permission. Any unauthorized use of the Content may violate copyright, trademark, and other applicable laws and could result in criminal or civil penalties.',
    },
    {
      header: 'Disclaimer of Warranties',
      text: 'The Pureworker app and all content, materials, and services available through the app are provided on an "as is" and "as available" basis, without warranties of any kind, either express or implied. Pureworker disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and title. Pureworker does not warrant that the app or any of its content, materials, or services will be uninterrupted, error-free, or free from viruses or other harmful components. You acknowledge that your use of the app and its content, materials, and services is at your sole risk.',
    },
    {
      header: 'Limitation of Liability',
      text: 'In no event shall Pureworker or its affiliates, directors, officers, employees, agents, or licensors be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages arising out of or in connection with your use of the app or its content, materials, or services, even if Pureworker has been advised of the possibility of such damages. If any jurisdiction does not allow the exclusion or limitation of liability for consequential or incidental damages, the liability of Pureworker and its affiliates, directors, officers, employees, agents, or licensors shall be limited to the greatest extent permitted by law.',
    },
    {
      header: 'Indemnification',
      text: "You agree to indemnify, defend, and hold harmless Pureworker and its affiliates, directors, officers, employees, agents, and licensors from and against all claims, losses, expenses, damages, and costs, including reasonable attorneys' fees, arising out of or in connection with your use of the app, your violation of these Terms of Service, or your violation of any applicable law or regulation.",
    },
    {
      header: 'Governing Law and Jurisdiction',
      text: 'These Terms of Service shall be governed by and construed in accordance with the laws of Nigeria without regard to its conflict of law provisions. Any dispute arising out of or in connection with these Terms of Service shall be resolved in the courts of Nigeria.',
    },
    {
      header: 'Changes to Terms of Service',
      text: 'We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. If we make material changes to these Terms of Service, we will notify you by posting the new terms on the Pureworker app or sending you an email or other communication. Your continued use of the app following the posting of any changes to these Terms of Service constitutes your acceptance of those changes.',
    },
    {
      header: 'Entire Agreement',
      text: 'These Terms of Service constitute the entire agreement between you and Pureworker with respect to the use of the Pureworker app and its content, materials, and services and supersede all prior or contemporaneous communications and proposals,',
    },
  ];

  const data_customer = [
    {
      title: 'Information We Collect:',
      text: 'When you register as a service provider on Pureworker, we may collect the following information:',
    },
    {
      title: 'Personal Information: ',
      text: 'This includes your name, email address, contact number, and any other information you provide during the registration process.',
    },
    {
      title: 'Communication Data: ',
      text: 'We collect information from your communications with customers through our messaging system, including chat history and attachments.',
    },
    {
      title: 'Use of Information:',
      text: `We use the collected information for the following purposes:
To create and maintain your service provider account.
To display your profile information to potential customers seeking services.
To facilitate communication between you and customers regarding service requests, negotiations, and job details.
To provide customer support and address any inquiries, issues, or disputes.
To send you important updates, notifications, and promotional messages related to your account or the Pureworker platform.`,
    },
    {
      title: 'Data Sharing',
      text: ' We may share your personal information in the following cases:',
    },
    {
      title: 'Data Security',
      text: 'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, please note that no data transmission over the internet or storage system is completely secure, and we cannot guarantee the absolute security of your data.',
    },
    {
      title: 'Data Retention:',
      text: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.',
    },
    {
      title: 'Your Rights:',
      text: 'As a service provider, you have the right to access, update, correct, or delete your personal information. You can manage your information through your account settings or by contacting our support team.',
    },
    {
      title: 'Changes to the Privacy Policy:',
      text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. We will notify you of any material changes and seek your consent, if required by applicable laws.',
    },
  ];
  const userType = useSelector((state: any) => state.user.isLoggedIn);
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
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
            text={'Privacy Policy'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>
      <View style={tw` h-[87.5%]`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{minHeight: SIZES.height}}>
          {userType.userType === 'CUSTOMER' && (
            <View style={[tw` flex-1`]}>
              <View style={tw`mx-auto mt-[5%]`}>
                <Textcomp
                  text={'Terms of Service for Pureworker App'}
                  size={14}
                  lineHeight={17}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
                <View style={tw``}>
                  <Textcomp
                    text={''}
                    size={16}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
                <View style={tw`mt-2`}>
                  <Textcomp
                    text={
                      userType?.userType === 'CUSTOMER'
                        ? 'These Terms of Service ("Terms") constitute a legally binding agreement between Pureworker ("Pureworker", "we", "us", or "our"), and you, the user of the Pureworker app ("you", "your", or "user"). By accessing or using the Pureworker app, you agree to be bound by these Terms, our Privacy Policy, and any additional terms and conditions that are referenced herein or that otherwise apply to your use of the Pureworker app.'
                        : 'At Pureworker, we are committed to protecting the privacy and confidentiality of our service providers(Businesses and Freelancers).This Privacy Policy outlines how we collect, use, store, and disclose your personal information as a service provider on our platform.Please read this policy carefully to understand our practices regarding your personal data.'
                    }
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter'}
                  />
                </View>
              </View>
              {/* {data.map((item, index) => {
              return (
                <View
                  key={index}
                  style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
                  <View style={tw``}>
                    <Textcomp
                      text={item?.header}
                      size={16}
                      lineHeight={17}
                      color={'#000000'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>
                  <View style={tw`mt-1`}>
                    <Textcomp
                      text={item?.text}
                      size={12}
                      lineHeight={14.5}
                      color={'#000000'}
                      fontFamily={'Inter'}
                    />
                  </View>
                </View>
              );
            })} */}
            </View>
          )}
          {userType.userType === 'CUSTOMER' && (
            //           <View style={[tw` flex-1`]}>
            //             <View style={tw`mx-auto mt-[5%]`}>
            //               <Textcomp
            //                 text={'Terms of Service for Pureworker App'}
            //                 size={14}
            //                 lineHeight={17}
            //                 color={'#000413'}
            //                 fontFamily={'Inter-SemiBold'}
            //               />
            //             </View>

            //             <View style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
            //               <View style={tw``}>
            //                 <Textcomp
            //                   text={`At Pureworker, we are committed to protecting the privacy and confidentiality of our service providers (Businesses and Freelancers). This Privacy Policy outlines how we collect, use, store, and disclose your personal information as a service provider on our platform. Please read this policy carefully to understand our practices regarding your personal data.

            // Information We Collect:
            // When you register as a service provider on Pureworker, we may collect the following information:

            // Personal Information: This includes your name, email address, contact number, and any other information you provide during the registration process.

            // Profile Information: We collect information about your skills, experience, service offerings, portfolio, and other details you choose to provide to enhance your profile.

            // Communication Data: We collect information from your communications with customers through our messaging system, including chat history and attachments.

            // Use of Information:
            // We use the collected information for the following purposes:

            // To create and maintain your service provider account.
            // To display your profile information to potential customers seeking services.
            // To facilitate communication between you and customers regarding service requests, negotiations, and job details.
            // To provide customer support and address any inquiries, issues, or disputes.
            // To send you important updates, notifications, and promotional messages related to your account or the Pureworker platform.

            // Data Sharing:
            // We may share your personal information in the following cases:

            // With Customers: Your profile information, portfolio, and ratings may be visible to customers seeking services.

            // With Third Parties: We may engage third-party service providers to assist us in operating our platform and delivering services. These service providers are obligated to maintain the confidentiality and security of your information.

            // Legal Requirements: We may disclose your information if required to comply with applicable laws, regulations, legal processes, or enforceable governmental requests.

            // Data Security:
            // We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, please note that no data transmission over the internet or storage system is completely secure, and we cannot guarantee the absolute security of your data.

            // Data Retention:
            // We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.

            // Your Rights:
            // As a service provider, you have the right to access, update, correct, or delete your personal information. You can manage your information through your account settings or by contacting our support team.

            // Changes to the Privacy Policy:
            // We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. We will notify you of any material changes and seek your consent, if required by applicable laws.
            //                   `}
            //                   size={14}
            //                   lineHeight={16}
            //                   color={'#000000'}
            //                   fontFamily={'Inter-SemiBold'}
            //                 />
            //               </View>
            //               {/* <View style={tw`mt-1`}>
            //                 <Textcomp
            //                   text={item?.text}
            //                   size={12}
            //                   lineHeight={14.5}
            //                   color={'#000000'}
            //                   fontFamily={'Inter'}
            //                 />
            //               </View> */}
            //             </View>
            //           </View>
            <>
              {data_customer.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
                    <View style={tw``}>
                      <Textcomp
                        text={item?.title}
                        size={16}
                        lineHeight={17}
                        color={'#000000'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </View>
                    <View style={tw`mt-1`}>
                      <Textcomp
                        text={item?.text}
                        size={12}
                        lineHeight={14.5}
                        color={'#000000'}
                        fontFamily={'Inter'}
                      />
                    </View>
                  </View>
                );
              })}
            </>
          )}
          <View style={tw`h-40`} />
        </ScrollView>
      </View>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
    </View>
  );
};

export default PrivacyPolicy;
