import firebase from 'firebase';

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: "479160953028"
  });

  navigator.serviceWorker
    .register('/public/my-sw.js')
    .then((registration) => {
      firebase.messaging().useServiceWorker(registration);
    });
}

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('token do usuário:', token);
    
    return token;
  } catch (error) {
    console.error(error);
  }
}