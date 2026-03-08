// import { getToken } from "firebase/messaging";
// import { doc, updateDoc } from "firebase/firestore";
// import { db, messaging, auth } from "./firebaseConfig";

// export const saveFcmToken = async () => {
//   try {
//     // ✅ VERY IMPORTANT: ask user for permission first
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.warn("Notification permission denied");
//       return;
//     }

//     const token = await getToken(messaging, {
//       vapidKey: "BBCyT8usCL4Y0kMvk1YNdDOfXwzMr0J0cPkWGISAdIY8l84J9hYg-WeDrrEh0oFG5kNGsNpqOeCr7KSWPZtGFuQ"
//     });

//     const user = auth.currentUser;
//     if (!user) return;

//     await updateDoc(doc(db, "users", user.uid), {
//       fcmToken: token
//     });

//     console.log("FCM token saved:", token);
//   } catch (err) {
//     console.error("Error getting FCM token:", err);
//   }
// };




import { PushNotifications } from '@capacitor/push-notifications';
import { doc, updateDoc } from "firebase/firestore";
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

    await updateDoc(doc(db, "users", userId), {
      fcmToken: token.value
    });

    console.log("Token saved to Firestore");

  });

  PushNotifications.addListener('registrationError', (err) => {
    console.error("Registration error:", err);
  });

};