import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner
} from "@ionic/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

const ClientDetailsModal: React.FC<Props> = ({ isOpen, onClose, clientId }) => {
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const callClient = (phone?: string) => {
  if (!phone) return;

  // Remove spaces just in case
  const formatted = phone.replace(/\s+/g, "");

  window.open(`tel:${formatted}`, "_self");
};


  useEffect(() => {
    if (!clientId || !isOpen) return;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "users", clientId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setClient(snap.data());
        }
      } catch (err) {
        console.error("Error fetching client:", err);
      }
      setLoading(false);
    };

    fetchClient();
  }, [clientId, isOpen]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Client Details</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonSpinner />}

        {!loading && client && (
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>Name</h2>
                <p>{client.name || "N/A"}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Email</h2>
                <p>{client.email || "N/A"}</p>
              </IonLabel>
            </IonItem>

           <IonItem>
  <IonLabel>
    <h2>Phone</h2>
    <p>{client.phone || "N/A"}</p>
  </IonLabel>

  {client.phone && (
    <IonButton
      slot="end"
      color="primary"
      onClick={() => callClient(client.phone)}
    >
      Call
    </IonButton>
  )}
</IonItem>


            <IonItem>
              <IonLabel>
                <h2>Address</h2>
                <p>{client.address || "N/A"}</p>
              </IonLabel>
            </IonItem>
          </IonList>
        )}

        {!loading && !client && (
          <p>No client details found.</p>
        )}
      </IonContent>
    </IonModal>
  );
};

export default ClientDetailsModal;
