import React, {useEffect, useState} from "react";
import {
  IonPage,
  IonContent,
  IonModal,
  IonButton,
  IonAlert
} from "@ionic/react";
import styled from "styled-components";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ServiceDetailsModal from "../components/ServiceDetailsModal";
import { useApp } from "../context/AppContext";
import TrackingModal from "../components/TrackingModal"; // ✅ NEW
import UserInfo from "../components/UserInfo";
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "../firebaseConfig";
import AvailableOrders from "../components/AvailableOrders";

const Container = styled.div`
  padding: 18px 5px;
  background: #f6f8ff;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #2b2b2b;
  font-size: 22px;
  margin: 0;
  font-weight: 700;
  margin-left:10px;
  margin-top:50px;
`;

const Subtitle = styled.p`
  color: #6b6b6b;
  margin: 4px 0 0 0;
  font-size: 14px;
  margin-left:10px;
`;

const DashboardHome: React.FC = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const { isTrackingOpen, setTrackingOpen, hasActiveBooking, setHasActiveBooking } = useApp();
  const [showNoBookingAlert, setShowNoBookingAlert] = useState(false);
  // const [hasActiveBooking, setHasActiveBooking] = useState(false);

  const { user, loading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      history.replace("/login");
    }
  }, [user, loading]);

  // 🔥 PROVIDER ACTIVE ORDER LISTENER (UPDATED)
 


    const handleActiveBooking = ()=>{
    if (!user) return;

    const ordersRef = ref(rtdb, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const orders = snapshot.val();

      if (!orders) {
        setHasActiveBooking(false);
        setTrackingOpen(false);
        return;
      }

      // ✅ LOOK FOR ORDER ASSIGNED TO THIS PROVIDER
      const active = Object.entries(orders).find(
        ([_, order]: any) =>
          order.providerId === user.uid &&
          (order.status === "ACCEPTED" ||
            order.status === "IN_PROGRESS" ||
            order.status === "COMPLETED")&&order.payment_status === "NOT_PAID"
      );

      if (!active) {
        setHasActiveBooking(false);
        setTrackingOpen(false);
        return;
      }

      // ✅ Provider HAS an active job
      setHasActiveBooking(true);

      // ✅ AUTO OPEN TRACKING MODAL WHEN JOB IS ACCEPTED
      setTrackingOpen(true);
    });

    return () => off(ordersRef);
  }



 useEffect(() => {
handleActiveBooking();
  }, [user]);

  return (
    <IonPage>
      <Header title="MACO STAFF" />

      <IonContent fullscreen>
        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
          {selectedService && (
            <ServiceDetailsModal
              service={selectedService}
              onClose={() => setIsOpen(false)}
            />
          )}
        </IonModal>

        <Container>
          <UserInfo />

          <IonButton
            expand="block"
            onClick={() => {
               handleActiveBooking();
              if (hasActiveBooking) {
                setTrackingOpen(true);
              } else {
                setShowNoBookingAlert(true);
              }
            }}
          >
            Ongoing Booking
          </IonButton>

          <Title>AVAILABLE ORDERS</Title>
          <Subtitle>Click any ORDER to accept</Subtitle>

          <AvailableOrders/>

          {/* ✅ USE PROVIDER TRACKING MODAL */}
          <IonModal isOpen={isTrackingOpen}>
            <TrackingModal
              onClose={() => setTrackingOpen(false)}
              

            />
          </IonModal>

          <IonAlert
            isOpen={showNoBookingAlert}
            onDidDismiss={() => setShowNoBookingAlert(false)}
            header="No Active Booking"
            message="You have no ongoing booking at the moment."
            buttons={["OK"]}
          />
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default DashboardHome;
