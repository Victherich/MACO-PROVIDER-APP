import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonSpinner,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import { ref, push, onValue, off, update } from "firebase/database";
import { rtdb } from "../firebaseConfig";
import { IonAlert } from "@ionic/react";
import { useApp } from "../context/AppContext";
import { auth } from "../firebaseConfig";



const Container = styled.div`
  padding: 18px;
  background: #f6f8ff;
  min-height: 100%;
  text-align: center;
`;

const StatusText = styled.h3`
  margin-top: 16px;
  color: #2b2b2b;
`;

interface Props {
  service: any;
  address: string;
  latLng: any;
  onClose: () => void;
}

const SearchingModal: React.FC<Props> = ({
  service,
  address,
  latLng,
  onClose
}) => {
  const history = useHistory();

  const [status, setStatus] = useState("SEARCHING");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
const { setTrackingOpen } = useApp();

const user = auth.currentUser;



  const hasCreatedRef = useRef(false);

//   // 1️⃣ CREATE ORDER
//   useEffect(() => {
//     if (hasCreatedRef.current) return;

//     const ordersRef = ref(rtdb, "orders");

//     const newOrderRef = push(ordersRef, {
//       service,
//       address,
//       latLng,
//       status: "SEARCHING",
//       createdAt: Date.now()
//     });

//     hasCreatedRef.current = true;
//     setOrderId(newOrderRef.key);
//   }, []);


useEffect(() => {
  if (hasCreatedRef.current) return;

  const user = auth.currentUser;

  if (!user) {
    console.error("No authenticated user found");
    return;
  }

  const ordersRef = ref(rtdb, "orders");

  const newOrderRef = push(ordersRef, {
    service,
    address,
    latLng,

    // 🔐 USER INFO
    userId: user.uid,
    userEmail: user.email || null,

    status: "SEARCHING",
    createdAt: Date.now()
  });

  hasCreatedRef.current = true;
  setOrderId(newOrderRef.key);
}, []);




  // 2️⃣ LISTEN FOR REALTIME UPDATES
  useEffect(() => {
    if (!orderId) return;

    const orderRef = ref(rtdb, `orders/${orderId}`);

    onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setStatus(data.status);

      if (data.status === "ACCEPTED") {
  setTrackingOpen(true);         // open tracking modal
  onClose();                     // close searching modal
}

      if (data.status === "CANCELLED") {
        onClose();
      }
    });

    return () => off(orderRef);
  }, [orderId]);

  // 3️⃣ CANCEL ORDER
  const cancelOrder = async () => {
    if (!orderId) return;

    const orderRef = ref(rtdb, `orders/${orderId}`);
    await update(orderRef, {
      status: "CANCELLED",
      cancelledAt: Date.now(),
      cancelledBy: "CUSTOMER"
    });

    onClose();
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Searching</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Container>
          <IonSpinner name="crescent" />

          <StatusText>
            {status === "SEARCHING" && "Searching for provider..."}
            {status === "ACCEPTED" && "Provider accepted your request"}
          </StatusText>

          {status === "SEARCHING" && (
            <IonButton
              fill="outline"
              color="danger"
              style={{ marginTop: 20 }}
              onClick={() => setShowCancelAlert(true)}

            >
              Cancel Request
            </IonButton>
          )}


          <IonAlert
  isOpen={showCancelAlert}
  onDidDismiss={() => setShowCancelAlert(false)}
  header="Cancel Request?"
  message="Are you sure you want to cancel this service request?"
  buttons={[
    {
      text: "No",
      role: "cancel"
    },
    {
      text: "Yes, Cancel",
      role: "destructive",
      handler: () => cancelOrder()
    }
  ]}
/>

        </Container>
      </IonContent>
    </>
  );
};

export default SearchingModal;
