import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText
} from "@ionic/react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
   onUpdated: () => void;
}

const ProfileModal: React.FC<Props> = ({ isOpen, onClose, onUpdated }) => {
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !isOpen) return;

    setMessage("");

    const loadProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(user.email || "");
      }
    };

    loadProfile();
  }, [user, isOpen]);

  const handleSave = async () => {
    if (!name || !phone) {
      setMessage("Name and phone are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await updateDoc(doc(db, "users", user!.uid), {
        name,
        phone
      });

      setMessage("Profile updated successfully ✅");
      onUpdated();
      onClose();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Full Name"
            labelPlacement="stacked"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Phone Number"
            labelPlacement="stacked"
            value={phone}
            onIonChange={(e) => setPhone(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Email"
            labelPlacement="stacked"
            value={email}
            readonly
          />
        </IonItem>

        {message && (
          <IonText color={message.includes("success") ? "success" : "danger"}>
            <p style={{ marginTop: 12 }}>{message}</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          style={{ marginTop: 20 }}
          onClick={handleSave}
          disabled={loading}
        >
          Save Changes
        </IonButton>

        <IonButton
          expand="block"
          fill="clear"
          onClick={onClose}
        >
          Close
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default ProfileModal;
