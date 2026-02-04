

// import React, { useEffect, useRef, useState } from "react";
// import {
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonButton,
//   IonAlert
// } from "@ionic/react";
// import styled from "styled-components";
// import { ref, onValue, off, update } from "firebase/database";
// import { rtdb, auth } from "../firebaseConfig";
// import { useApp } from "../context/AppContext";
// import ProviderTrackingMap from "./ProviderTrackingMap";

// const MapContainer = styled.div`
//   width: 100%;
//   height: 100%;
// `;

// const StatusBar = styled.div`
//   position: absolute;
//   bottom: 50px;
//   width: 100%;
//   background: #ffffff;
//   padding: 16px;
//   border-top-left-radius: 18px;
//   border-top-right-radius: 18px;
//   box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
// `;

// const StatusText = styled.h3`
//   margin: 0;
//   text-align: center;
//   color: #2b2b2b;
// `;

// const TrackingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   const { setTrackingOpen } = useApp();
//   const user = auth.currentUser;

//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstance = useRef<google.maps.Map | null>(null);
//   const serviceMarker = useRef<google.maps.Marker | null>(null);
//   const providerMarker = useRef<google.maps.Marker | null>(null);

//   const [status, setStatus] = useState("");
//   const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
//   const [activeOrder, setActiveOrder] = useState<any | null>(null);

//   // 🔹 CONFIRMATION ALERT STATES
//   const [showStartConfirm, setShowStartConfirm] = useState(false);
//   const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

//   // INIT MAP
//   useEffect(() => {
//     if (!mapRef.current || mapInstance.current) return;

//     mapInstance.current = new google.maps.Map(mapRef.current, {
//       zoom: 14,
//       center: { lat: 25.118, lng: 55.2 },
//       disableDefaultUI: true
//     });
//   }, []);

//   // LISTEN FOR PROVIDER ACTIVE ORDER
//   // useEffect(() => {
//   //   if (!user) return;

//   //   const ordersRef = ref(rtdb, "orders");

//   //   const unsubscribe = onValue(ordersRef, (snapshot) => {
//   //     const orders = snapshot.val();
//   //     if (!orders || !mapInstance.current) return;

//   //     const active = Object.entries(orders).find(
//   //       ([_, order]: any) =>
//   //         order.providerId === user.uid &&
//   //         (order.status === "ACCEPTED" ||
//   //           order.status === "IN_PROGRESS" ||
//   //           order.status === "COMPLETED")
//   //     );

//   //     if (!active) return;

//   //     const [orderId, data]: any = active;

//   //     setActiveOrder(data);
//   //     setStatus(data.status);
//   //     setActiveOrderId(orderId);

//   //     // 📍 Customer (service) location
//   //     if (data.latLng && !serviceMarker.current) {
//   //       serviceMarker.current = new google.maps.Marker({
//   //         position: data.latLng,
//   //         map: mapInstance.current,
//   //         label: "📍"
//   //       });
//   //       mapInstance.current.setCenter(data.latLng);
//   //     }

//   //     // 🚗 Provider live location marker
//   //     if (data.providerLocation) {
//   //       if (!providerMarker.current) {
//   //         providerMarker.current = new google.maps.Marker({
//   //           position: data.providerLocation,
//   //           map: mapInstance.current,
//   //           label: "🚗"
//   //         });
//   //       } else {
//   //         providerMarker.current.setPosition(data.providerLocation);
//   //       }
//   //     }

//   //     // Close when paid
//   //     if (data.status === "PAID") {
//   //       setTrackingOpen(false);
//   //       onClose();
//   //     }
//   //   });

//   //   return () => off(ordersRef);
//   // }, [user]);


// useEffect(() => {
//   if (!user) return;

//   const ordersRef = ref(rtdb, "orders");

//   const unsubAll = onValue(ordersRef, (snapshot) => {
//     const orders = snapshot.val();
//     if (!orders) {
//       setActiveOrder(null);
//       setStatus("");
//       setActiveOrderId(null);
//       return;
//     }

//     // 🔹 STEP 1 — Find provider’s active order ID
//     const activeEntry = Object.entries(orders).find(
//       ([_, order]: any) =>
//         order.providerId === user.uid &&
//         (order.status === "ACCEPTED" ||
//           order.status === "IN_PROGRESS" ||
//           order.status === "COMPLETED" ||
//           order.status === "PAID")
//     );

//     if (!activeEntry) {
//       setActiveOrder(null);
//       setStatus("");
//       setActiveOrderId(null);
//       return;
//     }

//     const [orderId] = activeEntry;
//     setActiveOrderId(orderId);

//     // 🔥 STEP 2 — Listen ONLY to this order
//     const orderRef = ref(rtdb, `orders/${orderId}`);

//     const unsubOne = onValue(orderRef, (snap) => {
//       const data = snap.val();
//       if (!data) return;

//       // ✅ SAFE REAL-TIME STATE UPDATES
//       setActiveOrder(data);
//       setStatus(data.status);

//       if (mapInstance.current) {
//         // 📍 Customer marker (only once)
//         if (data.latLng && !serviceMarker.current) {
//           serviceMarker.current = new google.maps.Marker({
//             position: data.latLng,
//             map: mapInstance.current,
//             label: "📍"
//           });
//           mapInstance.current.setCenter(data.latLng);
//         }

//         // 🚗 Provider marker (create once, then MOVE IT)
//         if (data.providerLocation) {
//           if (!providerMarker.current) {
//             providerMarker.current = new google.maps.Marker({
//               position: data.providerLocation,
//               map: mapInstance.current,
//               label: "🚗"
//             });
//           } else {
//             providerMarker.current.setPosition(data.providerLocation);
//           }
//         }
//       }

//       // Close when paid
//       if (data.status === "PAID") {
//         setTrackingOpen(false);
//         onClose();
//       }
//     });

//     // Cleanup inner listener when order changes
//     return () => off(orderRef);
//   });

//   return () => off(ordersRef);
// }, [user]);




//   // ACTUAL UPDATES (only called AFTER confirmation)
//   const confirmStartService = async () => {
//     if (!activeOrderId) return;

//     await update(ref(rtdb, `orders/${activeOrderId}`), {
//       status: "IN_PROGRESS"
//     });
//   };

//   const confirmCompleteService = async () => {
//     if (!activeOrderId) return;

//     await update(ref(rtdb, `orders/${activeOrderId}`), {
//       status: "COMPLETED"
//     });
//   };

//   return (
//     <>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Tracking</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent fullscreen>
//         {/* <MapContainer ref={mapRef} /> */}

//         <ProviderTrackingMap
//   customerLocation={activeOrder?.latLng}
//   providerLocation={activeOrder?.providerLocation}
//   onMapClick={(loc) => console.log("Map clicked:", loc)}
// />


//         <StatusBar>
//           <StatusText>
//             {status === "ACCEPTED" && "On the way 🚗"}
//             {status === "IN_PROGRESS" && "Washing in progress 🧼"}
//             {status === "COMPLETED" && "Waiting for payment ✅"}
//           </StatusText>

//           {status === "ACCEPTED" && (
//             <IonButton expand="block" onClick={() => setShowStartConfirm(true)}>
//               Start Service
//             </IonButton>
//           )}

//           {status === "IN_PROGRESS" && (
//             <IonButton
//               expand="block"
//               color="success"
//               onClick={() => setShowCompleteConfirm(true)}
//             >
//               Mark Completed
//             </IonButton>
//           )}
//         </StatusBar>

//         {/* ✅ CONFIRM START SERVICE ALERT */}
//         <IonAlert
//           isOpen={showStartConfirm}
//           onDidDismiss={() => setShowStartConfirm(false)}
//           header="Start Service?"
//           message="Are you sure you want to start the service?"
//           buttons={[
//             {
//               text: "Cancel",
//               role: "cancel",
//               handler: () => setShowStartConfirm(false)
//             },
//             {
//               text: "Yes, Start",
//               handler: () => {
//                 setShowStartConfirm(false);
//                 confirmStartService();
//               }
//             }
//           ]}
//         />

//         {/* ✅ CONFIRM COMPLETE SERVICE ALERT */}
//         <IonAlert
//           isOpen={showCompleteConfirm}
//           onDidDismiss={() => setShowCompleteConfirm(false)}
//           header="Complete Service?"
//           message="Are you sure the service is fully completed?"
//           buttons={[
//             {
//               text: "Cancel",
//               role: "cancel",
//               handler: () => setShowCompleteConfirm(false)
//             },
//             {
//               text: "Yes, Complete",
//               handler: () => {
//                 setShowCompleteConfirm(false);
//                 confirmCompleteService();
//               }
//             }
//           ]}
//         />
//       </IonContent>
//     </>
//   );
// };

// export default TrackingModal;





import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonAlert
} from "@ionic/react";
import styled from "styled-components";
import { ref, onValue, off, update } from "firebase/database";
import { rtdb, auth } from "../firebaseConfig";
import { useApp } from "../context/AppContext";
import ProviderTrackingMap from "./ProviderTrackingMap";

const StatusBar = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  background: #ffffff;
  padding: 16px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
`;

const StatusText = styled.h3`
  margin: 0;
  text-align: center;
  color: #2b2b2b;
`;

const TrackingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { setTrackingOpen } = useApp();
  const user = auth.currentUser;

  const [status, setStatus] = useState("");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // 🔹 CONFIRMATION ALERT STATES
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  // 🔹 CLEAN REAL-TIME LISTENER (kept exactly as your working version)
  useEffect(() => {
    if (!user) return;

    const ordersRef = ref(rtdb, "orders");

    const unsubAll = onValue(ordersRef, (snapshot) => {
      const orders = snapshot.val();
      if (!orders) {
        setActiveOrder(null);
        setStatus("");
        setActiveOrderId(null);
        return;
      }

      // 🔹 STEP 1 — Find provider’s active order ID
      const activeEntry = Object.entries(orders).find(
        ([_, order]: any) =>
          order.providerId === user.uid &&
          (order.status === "ACCEPTED" ||
            order.status === "IN_PROGRESS" ||
            order.status === "COMPLETED" ||
            order.status === "PAID")
      );

      if (!activeEntry) {
        setActiveOrder(null);
        setStatus("");
        setActiveOrderId(null);
        return;
      }

      const [orderId] = activeEntry;
      setActiveOrderId(orderId);

      // 🔥 STEP 2 — Listen ONLY to this order
      const orderRef = ref(rtdb, `orders/${orderId}`);

      const unsubOne = onValue(orderRef, (snap) => {
        const data = snap.val();
        if (!data) return;

        setActiveOrder(data);
        setStatus(data.status);

        // Close when paid
        if (data.status === "PAID") {
          setTrackingOpen(false);
          onClose();
        }
      });

      return () => off(orderRef);
    });

    return () => off(ordersRef);
  }, [user]);

  // ACTUAL UPDATES (unchanged)
  const confirmStartService = async () => {
    if (!activeOrderId) return;

    await update(ref(rtdb, `orders/${activeOrderId}`), {
      status: "IN_PROGRESS"
    });
  };

  const confirmCompleteService = async () => {
    if (!activeOrderId) return;

    await update(ref(rtdb, `orders/${activeOrderId}`), {
      status: "COMPLETED"
    });
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tracking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ProviderTrackingMap
          customerLocation={activeOrder?.latLng}
          providerLocation={activeOrder?.providerLocation}
          onMapClick={(loc) => console.log("Map clicked:", loc)}
        />

        <StatusBar>
          <StatusText>
            {status === "ACCEPTED" && "On the way 🚗"}
            {status === "IN_PROGRESS" && "Washing in progress 🧼"}
            {status === "COMPLETED" && "Waiting for payment ✅"}
          </StatusText>

          {status === "ACCEPTED" && (
            <IonButton expand="block" onClick={() => setShowStartConfirm(true)}>
              Start Service
            </IonButton>
          )}

          {status === "IN_PROGRESS" && (
            <IonButton
              expand="block"
              color="success"
              onClick={() => setShowCompleteConfirm(true)}
            >
              Mark Completed
            </IonButton>
          )}
        </StatusBar>

        {/* ✅ CONFIRM START SERVICE ALERT */}
        <IonAlert
          isOpen={showStartConfirm}
          onDidDismiss={() => setShowStartConfirm(false)}
          header="Start Service?"
          message="Are you sure you want to start the service?"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => setShowStartConfirm(false)
            },
            {
              text: "Yes, Start",
              handler: () => {
                setShowStartConfirm(false);
                confirmStartService();
              }
            }
          ]}
        />

        {/* ✅ CONFIRM COMPLETE SERVICE ALERT */}
        <IonAlert
          isOpen={showCompleteConfirm}
          onDidDismiss={() => setShowCompleteConfirm(false)}
          header="Complete Service?"
          message="Are you sure the service is fully completed?"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => setShowCompleteConfirm(false)
            },
            {
              text: "Yes, Complete",
              handler: () => {
                setShowCompleteConfirm(false);
                confirmCompleteService();
              }
            }
          ]}
        />
      </IonContent>
    </>
  );
};

export default TrackingModal;

