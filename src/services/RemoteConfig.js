import React, {Component} from 'react';
import { Text } from 'react-native';
// import * as CONSTANTS from '../assets/constants/Constant';
// import remoteConfig from '@react-native-firebase/remote-config';
// import OneSignal from 'react-native-onesignal';
 
export default function RemoteConfig() {
  console.log("AQUUIIIIIIII")
  const { signed } = useSelector((state) => state.Auth);

  const dispatch = useDispatch();

  function onReceived(device) {
    // console.log('DEVICE onReceived', device.payload);
  }
  function onOpened(device) {
    // console.log('DEVICE onOpened', device);
  }
  function getID_OS(device) {
    // console.log('DEVICE getID_OS', device);
  }

  useEffect(() => {
    console.log("AQUI")
    //OneSignal Init Code
    // OneSignal.setLogLevel(6, 0);
    // OneSignal.setAppId("8acb295a-ec80-48dd-9c76-4208883edd31");
    //END OneSignal Init Code

    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log("Prompt response:", response);
    });

    //Method for handling notifications received while app in foreground
    // OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    //   console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    //   let notification = notificationReceivedEvent.getNotification();
    //   console.log("notification: ", notification);
    //   const data = notification.additionalData
    //   console.log("additionalData: ", data);
    //   // Complete with null means don't show a notification.
    //   notificationReceivedEvent.complete(notification);
    // });

    // //Method for handling notifications opened
    // OneSignal.setNotificationOpenedHandler(notification => {
    //   console.log("OneSignal: notification opened:", notification);
    // });

  }, []);
}
