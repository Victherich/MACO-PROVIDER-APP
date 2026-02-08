import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner
} from "@ionic/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust path if needed

interface Props {
  booking: any;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<Props> = ({ booking, onClose }) => {
  const [client, setClient] = useState<any | null>(null);
  const [loadingClient, setLoadingClient] = useState(false);

  console.log("Booking data:", booking);

  // 🔹 Fetch CLIENT (customer) details from Firestore — NOT provider
  useEffect(() => {
    if (!booking?.userId) return;

    const fetchClient = async () => {
      setLoadingClient(true);
      try {
        const ref = doc(db, "users", booking.userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setClient(snap.data());
        }
      } catch (err) {
        console.error("Error fetching client:", err);
      }
      setLoadingClient(false);
    };

    fetchClient();
  }, [booking?.userId]);

  if (!booking) return null;

  return (
    <IonModal isOpen={!!booking} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Booking Details (Provider)</IonTitle>

          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* BOOKING ID */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Booking ID</strong>
            <p>{booking.id}</p>
          </IonLabel>
        </IonItem>

        {/* SERVICE */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Service</strong>
            <p>{booking.service.title}</p>
          </IonLabel>
        </IonItem>

        {/* DESCRIPTION */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Description</strong>
            <p>{booking.service.desc}</p>
          </IonLabel>
        </IonItem>

        {/* 🔹 CLIENT (CUSTOMER) DETAILS — Provider View */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Client Name</strong>
            {loadingClient ? (
              <IonSpinner name="dots" />
            ) : (
              <p>{client?.name || "—"}</p>
            )}
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Client Email</strong>
            <p>{booking.userEmail || client?.email || "—"}</p>
          </IonLabel>
        </IonItem>

        {/* STATUS */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Status</strong>
            <p>{booking.status}</p>
          </IonLabel>
        </IonItem>

        {/* PAYMENT STATUS */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Payment Status</strong>
            <p>{booking.payment_status}</p>
          </IonLabel>
        </IonItem>

        {/* PRICE */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Price</strong>
            <p>{booking.service.price}</p>
          </IonLabel>
        </IonItem>

        {/* ADDRESS */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Address</strong>
            <p>{booking.address || "—"}</p>
          </IonLabel>
        </IonItem>

        {/* BOOKED AT */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Booked At</strong>
            <p>
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString()
                : "—"}
            </p>
          </IonLabel>
        </IonItem>

        {/* ACCEPTED AT */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Accepted At</strong>
            <p>
              {booking.acceptedAt
                ? new Date(booking.acceptedAt).toLocaleString()
                : "Not yet accepted"}
            </p>
          </IonLabel>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

export default BookingDetailsModal;
