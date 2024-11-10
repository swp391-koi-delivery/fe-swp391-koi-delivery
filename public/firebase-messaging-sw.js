// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object.
const firebaseConfig = {
  apiKey: "AIzaSyDDBMVKQu70j5z1ZH3TFnBUqmphvoNKwG8",
  authDomain: "koi-fish-delivery.firebaseapp.com",
  projectId: "koi-fish-delivery",
  storageBucket: "koi-fish-delivery.appspot.com",
  messagingSenderId: "84496872349",
  appId: "1:84496872349:web:355ba50631144617f17574",
  measurementId: "G-H9JWMGG6S5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  // Customize notification here
  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message body.",
    icon: payload.notification?.icon || "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
