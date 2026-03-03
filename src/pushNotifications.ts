import { getToken } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";
import { db, messaging, auth } from "./firebaseConfig";

export const saveFcmToken = async () => {
  try {
    // ✅ VERY IMPORTANT: ask user for permission first
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "BBCyT8usCL4Y0kMvk1YNdDOfXwzMr0J0cPkWGISAdIY8l84J9hYg-WeDrrEh0oFG5kNGsNpqOeCr7KSWPZtGFuQ"
    });

    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      fcmToken: token
    });

    console.log("FCM token saved:", token);
  } catch (err) {
    console.error("Error getting FCM token:", err);
  }
};
