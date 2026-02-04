import React from "react";
import { IonAvatar, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ProfileModal from "./ProfileModal";
import { useCallback } from "react";
import BookingsModal from "./BookingsModal";




/* ---------- styles ---------- */
const UserCard = styled.div`
  background: linear-gradient(135deg, #2d4cff, #6a00ff);
  padding: 22px;
  border-radius: 18px;
  margin-bottom: 18px;
  box-shadow: 0 18px 40px rgba(45, 76, 255, 0.25);
  position: relative;
  overflow: hidden;
`;

const CardGlow = styled.div`
  position: absolute;
  width: 220px;
  height: 220px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  top: -70px;
  right: -70px;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserName = styled.h3`
  margin: 0;
  font-weight: 800;
  color: #fff;
  font-size: 20px;
`;

const UserEmail = styled.p`
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
`;

const BalanceBox = styled.div`
  margin-top: 18px;
  background: rgba(255, 255, 255, 0.14);
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const BalanceLabel = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
`;

const BalanceAmount = styled.h2`
  margin: 6px 0 0;
  color: #fff;
  font-size: 26px;
  font-weight: 900;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const ActionBtn = styled(IonButton)`
  flex: 1;
  border-radius: 14px;
  font-weight: 700;
  --padding-top: 12px;
  --padding-bottom: 12px;
`;

/* ---------- component ---------- */
const UserInfo: React.FC = () => {
  const history = useHistory();
  const user = auth.currentUser;

  const [bookingsOpen, setBookingsOpen] = React.useState(false);

  const [profileOpen, setProfileOpen] = React.useState(false);


  const [profile, setProfile] = React.useState<any>(null);




const loadProfile = useCallback(async () => {
   if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setProfile(snap.data());
    }
  }, [user]);



React.useEffect(() => {
  loadProfile();
}, [loadProfile]);


  return (
    <UserCard>
      <CardGlow />

      <UserRow>
        <div>
        <UserName>{profile?.name || "User"}</UserName>
<UserEmail>{user?.email}</UserEmail>

        </div>

      <IonAvatar>
  <img
    alt="user avatar"
    src={`https://ui-avatars.com/api/?name=${
      profile?.name || "User"
    }&background=fff&color=000`}
  />
</IonAvatar>

      </UserRow>

      {/* <BalanceBox>
        <BalanceLabel>Available Balance</BalanceLabel>
        <BalanceAmount>AED 1,250</BalanceAmount>
      </BalanceBox> */}

      <QuickActions>
      <ActionBtn
  fill="solid"
  color="light"
  onClick={() => setProfileOpen(true)}
>
  Profile
</ActionBtn>


       <ActionBtn
  fill="outline"
  color="light"
  onClick={() => setBookingsOpen(true)}
>
  Bookings
</ActionBtn>

      </QuickActions>


      <ProfileModal
  isOpen={profileOpen}
  onClose={() => setProfileOpen(false)}
  onUpdated={()=>loadProfile()}
/>
<BookingsModal
  isOpen={bookingsOpen}
  onClose={() => setBookingsOpen(false)}
/>

    </UserCard>
  );
};

export default UserInfo;
