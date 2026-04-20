// import React, { useEffect, useState } from "react";
// import {
//   IonModal,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonButton,
//   IonList,
//   IonItem,
//   IonLabel,
//   IonSpinner
// } from "@ionic/react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   clientId?: string;
// }

// const ClientDetailsModal: React.FC<Props> = ({ isOpen, onClose, clientId }) => {
//   const [client, setClient] = useState<any | null>(null);
//   const [loading, setLoading] = useState(false);

//   const callClient = (phone?: string) => {
//   if (!phone) return;

//   // Remove spaces just in case
//   const formatted = phone.replace(/\s+/g, "");

//   window.open(`tel:${formatted}`, "_self");
// };


//   useEffect(() => {
//     if (!clientId || !isOpen) return;

//     const fetchClient = async () => {
//       setLoading(true);
//       try {
//         const ref = doc(db, "users", clientId);
//         const snap = await getDoc(ref);

//         if (snap.exists()) {
//           setClient(snap.data());
//         }
//       } catch (err) {
//         console.error("Error fetching client:", err);
//       }
//       setLoading(false);
//     };

//     fetchClient();
//   }, [clientId, isOpen]);

//   return (
//     <IonModal isOpen={isOpen} onDidDismiss={onClose}>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Client Details</IonTitle>
//           <IonButton slot="end" fill="clear" onClick={onClose}>
//             Close
//           </IonButton>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent className="ion-padding">
//         {loading && <IonSpinner />}

//         {!loading && client && (
//           <IonList>
//             <IonItem>
//               <IonLabel>
//                 <h2>Name</h2>
//                 <p>{client.name || "N/A"}</p>
//               </IonLabel>
//             </IonItem>

//             <IonItem>
//               <IonLabel>
//                 <h2>Email</h2>
//                 <p>{client.email || "N/A"}</p>
//               </IonLabel>
//             </IonItem>

//            <IonItem>
//   <IonLabel>
//     <h2>Phone</h2>
//     <p>{client.phone || "N/A"}</p>
//   </IonLabel>

//   {client.phone && (
//     <IonButton
//       slot="end"
//       color="primary"
//       onClick={() => callClient(client.phone)}
//     >
//       Call
//     </IonButton>
//   )}
// </IonItem>


//             <IonItem>
//               <IonLabel>
//                 <h2>Address</h2>
//                 <p>{client.address || "N/A"}</p>
//               </IonLabel>
//             </IonItem>
//           </IonList>
//         )}

//         {!loading && !client && (
//           <p>No client details found.</p>
//         )}
//       </IonContent>
//     </IonModal>
//   );
// };

// export default ClientDetailsModal;


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
        } else {
          setClient(null);
        }
      } catch (err) {
        console.error("Error fetching client:", err);
        setClient(null);
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

        {loading && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <IonSpinner />
          </div>
        )}

        {!loading && client && (
          <>
            {/* PROFILE IMAGE */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={
                  client.photoURL ||
                  `https://ui-avatars.com/api/?name=${client.name || "User"}&background=00c8ff&color=fff`
                }
                alt="client"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #00c8ff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              />
            </div>

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
          </>
        )}

        {!loading && !client && (
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            No client details found.
          </p>
        )}

      </IonContent>
    </IonModal>
  );
};

export default ClientDetailsModal;
