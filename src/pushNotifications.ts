

// import { PushNotifications } from '@capacitor/push-notifications';
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "./firebaseConfig";

// export const registerPush = async (userId: string) => {

//   console.log("Starting push registration...");

//   let permission = await PushNotifications.checkPermissions();

//   if (permission.receive === 'prompt') {
//     permission = await PushNotifications.requestPermissions();
//   }

//   if (permission.receive !== 'granted') {
//     console.log("Push permission denied");
//     return;
//   }

//   await PushNotifications.register();

//   PushNotifications.addListener('registration', async (token) => {

//     console.log("FCM Token:", token.value);

//     await updateDoc(doc(db, "users", userId), {
//       fcmToken: token.value
//     });

//     console.log("Token saved to Firestore");

//   });

//   PushNotifications.addListener('registrationError', (err) => {
//     console.error("Registration error:", err);
//   });

// };






import { PushNotifications } from '@capacitor/push-notifications';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const registerPush = async (userId: string) => {
  console.log("Starting push registration...");

  let permission = await PushNotifications.checkPermissions();

  if (permission.receive === 'prompt') {
    permission = await PushNotifications.requestPermissions();
  }

  if (permission.receive !== 'granted') {
    console.log("Push permission denied");
    return;
  }

  await PushNotifications.register();

  PushNotifications.addListener('registration', async (token) => {
    console.log("FCM Token:", token.value);

    // ✅ Use arrayUnion to store multiple tokens
    await updateDoc(doc(db, "users", userId), {
      fcmTokens: arrayUnion(token.value)
    });

    console.log("Token added to Firestore");
  });

  PushNotifications.addListener('registrationError', (err) => {
    console.error("Registration error:", err);
  });
};