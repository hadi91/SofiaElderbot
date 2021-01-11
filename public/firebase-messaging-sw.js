
// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.

const configOptions = {
  apiKey: "AIzaSyDv1bnbHiOrMnNz8GAVv9J0sswmVHpWuTo",
  authDomain: "sofiaforseniors-ohwbgj.firebaseapp.com",
  databaseURL: "https://sofiaforseniors-ohwbgj.firebaseio.com",
  projectId: "sofiaforseniors-ohwbgj",
  storageBucket: "sofiaforseniors-ohwbgj.appspot.com",
  messagingSenderId: "163858115357",
  appId: "1:163858115357:web:dd0cc7a9467748b9768ff4"
};

firebase.initializeApp(configOptions);

class CustomPushEvent extends Event {
  constructor(data) {
    super("push");

    Object.assign(this, data);
    this.custom = true;
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener("push", (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  let oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  let newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        let newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

// messaging.onMessage((payload)=>{
//   console.log("oNmessage success: " + payload);
// });


messaging.onBackgroundMessage(payload => {
  console.log(payload)
  const notification = payload.data; 
  const notificationTitle = notification.title;
  const notificationOptions = {
    icon: "/img/icons/avatar_192.png",
    badge: "/favicon.ico",
    body: notification.body,
    vibrate: [500, 300, 500, 300, 500],
    tag: "notification-1",
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// const staticCacheName = "pages-cache-v1";

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});

self.addEventListener("notificationclick", function(event){
  console.log(event);
  event.notification.close();
  
    // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});