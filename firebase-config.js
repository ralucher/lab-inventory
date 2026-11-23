// Firebase web-app settings for the lab inventory.
// These values are not secret: Firebase identifies the project with them.
// Access to the data is controlled by the Firestore security rules (see README).
window.LAB_CONFIG = {
  firebase: {
    apiKey: "AIzaSyDHef9Efif0aOYrhHeV6eyNEmCHZ3U-MZI",
    authDomain: "lucena-alcaide-lab.firebaseapp.com",
    projectId: "lucena-alcaide-lab",
    storageBucket: "lucena-alcaide-lab.firebasestorage.app",
    messagingSenderId: "763482265482",
    appId: "1:763482265482:web:329307e780c8abfc3f1a73"
  },
  // Web-app address of the Google Apps Script that emails new order requests
  // (see notify/Code.gs and README). Leave empty to send no emails.
  notifyUrl: ""
};
