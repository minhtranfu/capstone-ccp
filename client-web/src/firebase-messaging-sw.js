importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// console.log(firebase);
// if (firebase.messaging.isSupported()) {
  firebase.initializeApp({
      messagingSenderId: "479160953028"
  });
  const messaging = firebase.messaging();
// }
