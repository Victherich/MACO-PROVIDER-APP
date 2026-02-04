
import React from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonAlert
} from "@ionic/react";
import { person, list, card, logOut, helpCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import ProfileModal from "../components/ProfileModal";
import BookingsModal from "../components/BookingsModal";



/* ---------- styles ---------- */
const Container = styled.div`
  padding: 16px;
  background: #f6f8ff;
  min-height: 100vh;
`;

const UserCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
`;

const UserName = styled.h3`
  margin: 0;
  font-weight: 700;
`;

const UserEmail = styled.p`
  margin: 4px 0 0;
  color: #6b6b6b;
`;

/* ---------- component ---------- */
const UserAccount: React.FC = () => {
  const history = useHistory();
  const user = auth.currentUser;
 const [showLogoutAlert, setShowLogoutAlert] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);
const [bookingsOpen, setBookingsOpen] = useState(false);



  const handleLogout = async () => {
    await signOut(auth);
    history.replace("/splash");
  };



const [profile, setProfile] = useState<any>(null);

const loadProfile = useCallback(async () => {
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) {
    setProfile(snap.data());
  }
}, [user]);

useEffect(() => {
  loadProfile();
}, [loadProfile]);



  return (
    <IonPage>
      <Header title="Account" />
      <IonContent fullscreen>
        <Container>
          {/* USER INFO */}
        <UserCard>
  <UserName>{profile?.name || "User"}</UserName>
  <UserEmail>{user?.email}</UserEmail>
</UserCard>


          {/* MENU */}
          <IonList inset>
          <IonItem button onClick={() => setProfileOpen(true)}>
  <IonIcon icon={person} slot="start" />
  <IonLabel>User Information</IonLabel>
</IonItem>

<IonItem button onClick={() => setBookingsOpen(true)}>
  <IonIcon icon={list} slot="start" />
  <IonLabel>Booking History</IonLabel>
</IonItem>


            <IonItem button onClick={() => history.push("/contact")}>
              <IonIcon icon={helpCircle} slot="start" />
              <IonLabel>Help & Support</IonLabel>
            </IonItem>
          </IonList>

          {/* LOGOUT */}
          <IonButton
            expand="block"
            
            style={{ marginTop: 30, backgroundColor:"gray" }}
             onClick={() => setShowLogoutAlert(true)}
          >
            Logout
          </IonButton>

          <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header={"Confirm Logout"}
        message={"Are you sure you want to logout?"}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => setShowLogoutAlert(false),
          },
          {
            text: "Logout",
            handler: handleLogout,
          },
        ]}
      />

      <ProfileModal
  isOpen={profileOpen}
  onClose={() => setProfileOpen(false)}
  onUpdated={loadProfile}
/>

<BookingsModal
  isOpen={bookingsOpen}
  onClose={() => setBookingsOpen(false)}
/>

        </Container>
      </IonContent>
    </IonPage>
  );
};

export default UserAccount;
