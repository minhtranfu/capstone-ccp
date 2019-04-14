import firebase from 'firebase/app';
import 'firebase/messaging';
import ccpServices from './services/domain/ccp-api-service';
import { appConsts } from "./common/app-const";

export const initializeFirebase = () => {

  if (!firebase.messaging.isSupported()) {
    return;
  }
  
  firebase.initializeApp({
    messagingSenderId: "479160953028"
  });

  // navigator.serviceWorker
  //   .register('/public/my-sw.js')
  //   .then((registration) => {
  //     firebase.messaging().useServiceWorker(registration);
  //   });
}

export const askForPermissioToReceiveNotifications = async () => {

  if (!firebase.messaging.isSupported()) {
    return;
  }
  
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const registrationToken = await messaging.getToken();
    console.log('registrationToken:', registrationToken);
    ccpServices.userServices.sendNotificationToken(registrationToken);
    localStorage.setItem(appConsts.NOTI_TOKEN, registrationToken);
    
    return registrationToken;
  } catch (error) {
    console.log(error);
  }
}
