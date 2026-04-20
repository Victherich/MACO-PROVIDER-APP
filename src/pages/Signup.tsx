// import React, { useState } from "react";
// import {
//   IonPage,
//   IonContent,
//   IonInput,
//   IonButton,
//   IonText,
//   IonLoading,
//   IonItem,
// } from "@ionic/react";
// import { useHistory } from "react-router-dom";
// import styled from "styled-components";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "../firebaseConfig";
// import Header from "../components/Header";
// import { eye, eyeOff } from "ionicons/icons";
// import { IonIcon } from "@ionic/react";
// import { useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";


// /* ---------- styles ---------- */
// const Container = styled.div`
//   padding: 24px;
//   background: #f6f8ff;
//   min-height: 100vh;
// `;

// const Title = styled.h2`
//   margin-top: 20px;
//   font-weight: 700;
// `;

// const ErrorText = styled(IonText)`
//   color: #e53935;
// `;




// /* ---------- component ---------- */
// const Signup: React.FC = () => {
//   const history = useHistory();

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
// const [confirmEmail, setConfirmEmail] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState("");
// const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);


//   const handleSignup = async () => {

//     if (!name || !phone || !email || !password || !confirmPassword || !confirmEmail) {
//   setError("Please fill all fields");
//   return;
// }
// if(email !== confirmEmail){
//     setError("Emails do not match");
//     return;
// }

// if (password !== confirmPassword) {
//   setError("Passwords do not match");
//   return;
// }


//     try {
//       setLoading(true);
//       setError("");

//       // 1️⃣ Create auth user
//       const cred = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const user = cred.user;

//       // 2️⃣ Save user profile in Firestore
//       await setDoc(doc(db, "users", user.uid), {
//         uid: user.uid,
//         name,
//         phone,
//         email,
//         role: "provider",
//         createdAt: serverTimestamp(),
//       });

//       // 3️⃣ Redirect
//       history.replace("/home");
//     } 
    
//     catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };



// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//       // 🔐 User already logged in → go home
//       history.replace("/home");
//     }
//   });

//   return () => unsubscribe();
// }, [history]);





//   return (
//     <IonPage>
//       <Header title="Sign Up" />
//       <IonContent fullscreen>
//         <Container>
//           <Title>Create Account ✨</Title>
// <IonItem>
//           <IonInput
//             placeholder="Full Name"
//             value={name}
//             onIonChange={(e) => setName(e.detail.value!)}
//           />
// </IonItem>
// <IonItem>
// <IonInput
//             type="email"
//             placeholder="Email"
//             value={email}
//             onIonChange={(e) => setEmail(e.detail.value!)}
//           />

// </IonItem>

// <IonItem>
// <IonInput
//             type="email"
//             placeholder="Confirm Email"
//             value={confirmEmail}
//             onIonChange={(e) => setConfirmEmail(e.detail.value!)}
//           />

// </IonItem>

// <IonItem>
//   <IonInput
//     type={showPassword ? "text" : "password"}
//     placeholder="Password"
//     value={password}
//     onIonChange={(e) => setPassword(e.detail.value!)}
//   />
//   <IonIcon
//     slot="end"
//     icon={showPassword ? eyeOff : eye}
//     style={{ cursor: "pointer" }}
//     onClick={() => setShowPassword(!showPassword)}
//   />
// </IonItem>
// <IonItem>
//   <IonInput
//     type={showConfirmPassword ? "text" : "password"}
//     placeholder="Confirm Password"
//     value={confirmPassword}
//     onIonChange={(e) => setConfirmPassword(e.detail.value!)}
//   />
//   <IonIcon
//     slot="end"
//     icon={showConfirmPassword ? eyeOff : eye}
//     style={{ cursor: "pointer" }}
//     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//   />
// </IonItem>


// <IonItem>
//  <IonInput
//             type="tel"
//             placeholder="Phone Number"
//             value={phone}
//             onIonChange={(e) => setPhone(e.detail.value!)}
//           />
// </IonItem>
         

          

        

//           {error && <ErrorText>{error}</ErrorText>}

//           <IonButton expand="block" onClick={handleSignup}>
//             Sign Up
//           </IonButton>

//           <IonButton
//             expand="block"
//             fill="clear"
//             onClick={() => history.goBack()}
//           >
//             Back to Login
//           </IonButton>

//           <IonLoading isOpen={loading} message="Creating account..." />
//         </Container>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Signup;











import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
  IonItem,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Header from "../components/Header";
import { eye, eyeOff } from "ionicons/icons";

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
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📸 image states
  const [file, setFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /* ================= FILE HANDLING ================= */

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 25 * 1024 * 1024) {
      alert("Max file size is 25MB");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const compressImage = async (file: any) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx!.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => resolve(blob || file),
            "image/jpeg",
            0.8
          );
        };
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: any) => {
    const data = new FormData();

    let uploadFileData = file;

    if (file.type.includes("image")) {
      try {
        uploadFileData = await compressImage(file);
      } catch {}
    }

    data.append("file", uploadFileData);
    data.append("upload_preset", "matthew car wash and cleaning website");
    data.append("folder", "app_profile_images");

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cloudinary.com/v1_1/dzshme0rg/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploadProgress(0);
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response).secure_url);
        } else reject();
      };

      xhr.onerror = reject;
      xhr.send(data);
    });
  };

  /* ================= SIGNUP ================= */

  const handleSignup = async () => {
    if (
      !name ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword ||
      !confirmEmail
    ) {
      setError("Please fill all fields");
      return;
    }

    if (email !== confirmEmail) {
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

      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = cred.user;

      // 📸 upload image
      let photoURL = null;

      if (file) {
        try {
          photoURL = await uploadFile(file);
        } catch {
          alert("Image upload failed, continuing without image");
        }
      }

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        role: "provider",
        photoURL: photoURL || null,
        createdAt: serverTimestamp(),
      });

      history.replace("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        history.replace("/home");
      }
    });

    return () => unsubscribe();
  }, [history]);

  /* ================= UI ================= */

  return (
    <IonPage>
      <Header title="Sign Up" />
      <IonContent fullscreen>
        <Container>
          <Title>Create Account ✨</Title>

          {/* PROFILE IMAGE */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <label style={{ cursor: "pointer" }}>
              <img
                src={
                  previewUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #00c8ff",
                }}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>

            <p style={{ fontSize: "12px", color: "#777" }}>
              Tap to add profile image (optional)
            </p>

            {uploadProgress > 0 && (
              <p style={{ fontSize: "12px", color: "#00c8ff" }}>
                Uploading: {uploadProgress}%
              </p>
            )}
          </div>

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
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
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
