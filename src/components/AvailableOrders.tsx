// import React, { useEffect, useState } from "react";
// import {
//   IonList,
//   IonItem,
//   IonLabel,
//   IonButton,IonAlert,
// } from "@ionic/react";

// import { ref, onValue, off, update } from "firebase/database";
// import { rtdb } from "../firebaseConfig";
// import { auth } from "../firebaseConfig";






// // 📏 Distance helper
// const getDistanceInKm = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number => {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;

//   return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
// };

// interface Order {
//   id: string;
//   address: string;
//   latLng: { lat: number; lng: number };
//   service: any;
//   userId: string;
//   distanceKm: number;
// }

// const AvailableOrders: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);

//   const provider = auth.currentUser;
// const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);



//   // 🔴 Replace with Capacitor Geolocation later
//   const providerLocation = {
//     lat: 6.5244,
//     lng: 3.3792
//   };

//   useEffect(() => {
//     const ordersRef = ref(rtdb, "orders");

//     onValue(ordersRef, (snapshot) => {
//       const data = snapshot.val();
//       if (!data) {
//         setOrders([]);
//         return;
//       }

//       const list: Order[] = [];

//       Object.entries<any>(data).forEach(([id, order]) => {
//         if (order.status === "SEARCHING" && order.latLng) {
//           const distanceKm = getDistanceInKm(
//             providerLocation.lat,
//             providerLocation.lng,
//             order.latLng.lat,
//             order.latLng.lng
//           );

//           list.push({
//             id,
//             address: order.address,
//             latLng: order.latLng,
//             service: order.service,
//             userId: order.userId,
//             distanceKm
//           });
//         }
//       });

//       list.sort((a, b) => a.distanceKm - b.distanceKm);
//       setOrders(list);
//     });

//     return () => off(ordersRef);
//   }, []);






//  const acceptOrder = async (orderId: string) => {
//   const provider = auth.currentUser;

//   if (!provider) {
//     console.error("Provider not authenticated");
//     return;
//   }

//   const orderRef = ref(rtdb, `orders/${orderId}`);

//   await update(orderRef, {
//     status: "ACCEPTED",

//     // 🔐 PROVIDER INFO
//     providerId: provider.uid,
//     providerEmail: provider.email || null,

//     // 📍 PROVIDER LOCATION AT ACCEPT TIME
//     providerLatLng: {
//       lat: providerLocation.lat,
//       lng: providerLocation.lng
//     },

//     acceptedAt: Date.now()
//   });
// };


//   return (
//   <>
//     <IonList>

        
//       {orders.map((order) => (
//         <IonItem key={order.id}>
//           <IonLabel>
//             <h2>{order.service.title}</h2>
//             <h5>{order.address}</h5>
//             <p>{order.distanceKm.toFixed(2)} km away</p>
//           </IonLabel>

//          <IonButton
//   slot="end"
// //   color="success"
//   onClick={() => setConfirmOrderId(order.id)}
// >
//   Accept
// </IonButton>



//         </IonItem>
//       ))}

      
//     </IonList>

//     <IonAlert
//   isOpen={!!confirmOrderId}
//   onDidDismiss={() => setConfirmOrderId(null)}
//   header="Accept this order?"
//   message="Are you sure you want to accept this service request?"
//   buttons={[
//     {
//       text: "Cancel",
//       role: "cancel"
//     },
//     {
//       text: "Accept",
//       role: "confirm",
//       handler: async () => {
//         if (confirmOrderId) {
//           await acceptOrder(confirmOrderId);
//           setConfirmOrderId(null);
//         }
//       }
//     }
//   ]}
// />

//   </>

//   );
// };

// export default AvailableOrders;





import React, { useEffect, useState } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonAlert
} from "@ionic/react";
import { ref, onValue, off, update, get } from "firebase/database";
import { rtdb, auth } from "../firebaseConfig";

// 📏 Distance helper
const getDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

interface Order {
  id: string;
  address: string;
  latLng: { lat: number; lng: number };
  service: any;
  userId: string;
  distanceKm: number;
}

const AvailableOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [showActiveAlert, setShowActiveAlert] = useState(false);

  // 🔴 Replace with Capacitor Geolocation later
  const providerLocation = { lat: 6.5244, lng: 3.3792 };

  const provider = auth.currentUser;

  // 🔍 Fetch available orders
  useEffect(() => {
    const ordersRef = ref(rtdb, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setOrders([]);
        return;
      }

      const list: Order[] = [];

      Object.entries<any>(data).forEach(([id, order]) => {
        if (order.status === "SEARCHING" && order.latLng) {
          const distanceKm = getDistanceInKm(
            providerLocation.lat,
            providerLocation.lng,
            order.latLng.lat,
            order.latLng.lng
          );

          list.push({
            id,
            address: order.address,
            latLng: order.latLng,
            service: order.service,
            userId: order.userId,
            distanceKm
          });
        }
      });

      list.sort((a, b) => a.distanceKm - b.distanceKm);
      setOrders(list);
    });

    return () => off(ordersRef);
  }, []);

  // ✅ Accept order with active order check
  const acceptOrder = async (orderId: string) => {
    if (!provider) return;

    const ordersRef = ref(rtdb, "orders");

    try {
      const snapshot = await get(ordersRef);
      const allOrders = snapshot.val();

      // 🔴 Check if provider already has an active order
      const hasActiveOrder =
        allOrders &&
        Object.values<any>(allOrders).some(
          (o) =>
            o.providerId === provider.uid &&
            ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(o.status)
        );

      if (hasActiveOrder) {
        setShowActiveAlert(true);
        return;
      }

      // 🔵 Accept order
      const orderRef = ref(rtdb, `orders/${orderId}`);
      await update(orderRef, {
        status: "ACCEPTED",
        providerId: provider.uid,
        providerEmail: provider.email || null,
  providerLocation: {
    lat: providerLocation.lat,
    lng: providerLocation.lng
  },
        acceptedAt: Date.now()
      });
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  return (
    <>
      <IonList>
        {orders.map((order) => (
          <IonItem key={order.id}>
            <IonLabel>
              <h2>{order.service.title}</h2>
              <h5>{order.address}</h5>
              <p>{order.distanceKm.toFixed(2)} km away</p>
            </IonLabel>

            <IonButton
              slot="end"
              onClick={() => setConfirmOrderId(order.id)}
            >
              Accept
            </IonButton>
          </IonItem>
        ))}
      </IonList>

      {/* Confirm Accept Modal */}
      <IonAlert
        isOpen={!!confirmOrderId}
        onDidDismiss={() => setConfirmOrderId(null)}
        header="Accept this order?"
        message="Are you sure you want to accept this service request?"
        buttons={[
          { text: "Cancel", role: "cancel" },
          {
            text: "Accept",
            role: "confirm",
            handler: async () => {
              if (confirmOrderId) {
                await acceptOrder(confirmOrderId);
                setConfirmOrderId(null);
              }
            }
          }
        ]}
      />

      {/* Active Order Alert */}
      <IonAlert
        isOpen={showActiveAlert}
        onDidDismiss={() => setShowActiveAlert(false)}
        header="Active Order Found"
        message="You already have an ongoing order. Complete it before accepting a new one."
        buttons={["OK"]}
      />
    </>
  );
};

export default AvailableOrders;
