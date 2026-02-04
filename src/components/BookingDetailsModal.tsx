import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton
} from "@ionic/react";

interface Props {
  booking: any;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<Props> = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <IonModal isOpen={!!booking} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Booking Details</IonTitle>

          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>
            <strong style={{color:"blue"}}>Service</strong>
            <p>{booking.service.title}</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel >
            <strong style={{color:"blue"}}>Description</strong>
            <p>{booking.service.desc}</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <strong style={{color:"blue"}}>Status</strong>
            <p>{booking.status}</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <strong style={{color:"blue"}}>Price</strong>
            <p>{booking.service.price}</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <strong style={{color:"blue"}}>Address</strong>
            <p>{booking.address || "—"}</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <strong style={{color:"blue"}}>Date</strong>
            <p>
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString()
                : "—"}
            </p>
          </IonLabel>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

export default BookingDetailsModal;
