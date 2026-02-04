import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
  IonItem,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Header from "../components/Header";
import { eye, eyeOff } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";


/* ---------- styles ---------- */
const Container = styled.div`
  padding: 24px;
  background: #f6f8ff;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-top: 20px;
  font-weight: 700;
`;

const ErrorText = styled(IonText)`
  color: #e53935;
`;




/* ---------- component ---------- */
const Signup: React.FC = () => {
  const history = useHistory();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSignup = async () => {

    if (!name || !phone || !email || !password || !confirmPassword || !confirmEmail) {
  setError("Please fill all fields");
  return;
}
if(email !== confirmEmail){
    setError("Emails do not match");
    return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match");
  return;
}


    try {
      setLoading(true);
      setError("");

      // 1️⃣ Create auth user
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = cred.user;

      // 2️⃣ Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        role: "CUSTOMER",
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Redirect
      history.replace("/home");
    } 
    
    catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // 🔐 User already logged in → go home
      history.replace("/home");
    }
  });

  return () => unsubscribe();
}, [history]);





  return (
    <IonPage>
      <Header title="Sign Up" />
      <IonContent fullscreen>
        <Container>
          <Title>Create Account ✨</Title>
<IonItem>
          <IonInput
            placeholder="Full Name"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
          />
</IonItem>
<IonItem>
<IonInput
            type="email"
            placeholder="Email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />

</IonItem>

<IonItem>
<IonInput
            type="email"
            placeholder="Confirm Email"
            value={confirmEmail}
            onIonChange={(e) => setConfirmEmail(e.detail.value!)}
          />

</IonItem>

<IonItem>
  <IonInput
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onIonChange={(e) => setPassword(e.detail.value!)}
  />
  <IonIcon
    slot="end"
    icon={showPassword ? eyeOff : eye}
    style={{ cursor: "pointer" }}
    onClick={() => setShowPassword(!showPassword)}
  />
</IonItem>
<IonItem>
  <IonInput
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
  />
  <IonIcon
    slot="end"
    icon={showConfirmPassword ? eyeOff : eye}
    style={{ cursor: "pointer" }}
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  />
</IonItem>


<IonItem>
 <IonInput
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onIonChange={(e) => setPhone(e.detail.value!)}
          />
</IonItem>
         

          

        

          {error && <ErrorText>{error}</ErrorText>}

          <IonButton expand="block" onClick={handleSignup}>
            Sign Up
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            onClick={() => history.goBack()}
          >
            Back to Login
          </IonButton>

          <IonLoading isOpen={loading} message="Creating account..." />
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
