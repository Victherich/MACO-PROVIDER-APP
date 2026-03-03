import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonText,
  IonButton
} from "@ionic/react";
import { auth } from "../firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";

import BookingDetailsModal from "./BookingDetailsModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BookingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const user = auth.currentUser;

  const [bookings, setBookings] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (!user || !isOpen) return;

    const rtdb = getDatabase();
    const ordersRef = ref(rtdb, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setBookings([]);
        return;
      }

      const list = Object.entries<any>(data)
        .map(([id, value]) => ({
          id,
          ...value
        }))
        // ✅ SHOW BOOKINGS WHERE CURRENT USER IS THE PROVIDER
        .filter((order) => order.providerId === user.uid)
        .sort((a, b) => b.createdAt - a.createdAt); // latest first

      setBookings(list);
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>My Provider Bookings</IonTitle>

            <IonButton slot="end" fill="clear" onClick={onClose}>
              Back
            </IonButton>
          </IonToolbar>
        </IonHeader>

        <IonContent style={{ paddingTop: "100px" }}>
          {bookings.length === 0 && (
            <IonText className="ion-padding">
              No provider bookings found
            </IonText>
          )}

          {bookings.map((b) => (
            <IonItem key={b.id} button onClick={() => setSelected(b)}>
              <IonLabel>
                <h2 style={{ color: "blue", fontWeight: "bold" }}>
                  {b.service.title}
                </h2>
                <p>{b.service.desc}</p>
                <p>Status: {b.status}</p>
                <p>Payment: {b.payment_status}</p>
                <p>
                  Booked:{" "}
                  {b.createdAt
                    ? new Date(b.createdAt).toLocaleString()
                    : "—"}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonContent>
      </IonModal>

      {/* 🔥 Details modal */}
      <BookingDetailsModal
        booking={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default BookingsModal;
