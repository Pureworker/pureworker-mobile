import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUser,
  getCategory,
  getPopularService,
  getProviderByProximity,
  getSupportUser,
  getUserOrders,
  getUserNotification,
  getChatsbyuser,
} from '../utils/api/func'; // Import your API functions here
import {getUnreadMessages} from '../utils/api/chat';
import {
  addUserData,
  addSCategory,
  addPopularServices,
  addcloseProvider,
  addcustomerOrders,
  addnotifications,
  addchatList,
} from '../store/reducer/mainSlice';

export function useInitialData() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);

  useEffect(() => {
    const fetchData = async () => {
      // Call your API functions here and dispatch actions with the received data
      const resUser = await getUser('');
      if (resUser?.status === 201 || resUser?.status === 200) {
        dispatch(addUserData(resUser?.data?.user));
      }

      const resUserOrder: any = await getUserOrders('');
      if (resUserOrder?.status === 201 || resUserOrder?.status === 200) {
        dispatch(addcustomerOrders(resUserOrder?.data?.data));
      }

      const resUserNotification: any = await getUserNotification(userData?._id ?? '');
      if (resUserNotification?.status === 201 || resUserNotification?.status === 200) {
        dispatch(addnotifications(resUserNotification?.data?.data));
      }
      const resChatUser: any = await getChatsbyuser('');
      if (resChatUser?.status === 201 || resChatUser?.status === 200) {
        dispatch(addchatList(resChatUser?.data.chats));
      }
      const resCategory = await getCategory('');
      if (resCategory?.status === 201 || resCategory?.status === 200) {
        dispatch(addSCategory(resCategory?.data?.data));
      }
      const resPopularServices = await getPopularService('');
      if (
        resPopularServices?.status === 201 ||
        resPopularServices?.status === 200
      ) {
        dispatch(addPopularServices(resPopularServices?.data?.data));
      }
      const resProviderByProximity = await getProviderByProximity(
        userData?._id,
      );
      if (
        resProviderByProximity?.status === 201 ||
        resProviderByProximity?.status === 200
      ) {
        if (resProviderByProximity?.data?.data) {
          dispatch(addcloseProvider(resProviderByProximity?.data?.data));
        }
        if (resProviderByProximity?.data === undefined) {
          dispatch(addcloseProvider([]));
        }
        if (
          resProviderByProximity?.data?.data &&
          resProviderByProximity?.data?.data?.length === 0
        ) {
          dispatch(addcloseProvider([]));
        }
      }
      //notification, chats, orders,
      getSupportUser('');
      getUnreadMessages();

      console.error('DONEE');
      
    };
    fetchData();
  }, [dispatch]);
}
