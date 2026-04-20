// import React, { useEffect, useState } from "react";
// import {
//   IonModal,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonItem,
//   IonInput,
//   IonButton,
//   IonText
// } from "@ionic/react";
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//    onUpdated: () => void;
// }

// const ProfileModal: React.FC<Props> = ({ isOpen, onClose, onUpdated }) => {
//   const user = auth.currentUser;

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (!user || !isOpen) return;

//     setMessage("");

//     const loadProfile = async () => {
//       const snap = await getDoc(doc(db, "users", user.uid));
//       if (snap.exists()) {
//         const data = snap.data();
//         setName(data.name || "");
//         setPhone(data.phone || "");
//         setEmail(user.email || "");
//       }
//     };

//     loadProfile();
//   }, [user, isOpen]);

//   const handleSave = async () => {
//     if (!name || !phone) {
//       setMessage("Name and phone are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       await updateDoc(doc(db, "users", user!.uid), {
//         name,
//         phone
//       });

//       setMessage("Profile updated successfully ✅");
//       onUpdated();
//       onClose();
//     } catch (err: any) {
//       setMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <IonModal isOpen={isOpen} onDidDismiss={onClose}>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>My Profile</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent className="ion-padding">
//         <IonItem>
//           <IonInput
//             label="Full Name"
//             labelPlacement="stacked"
//             value={name}
//             onIonChange={(e) => setName(e.detail.value!)}
//           />
//         </IonItem>

//         <IonItem>
//           <IonInput
//             label="Phone Number"
//             labelPlacement="stacked"
//             value={phone}
//             onIonChange={(e) => setPhone(e.detail.value!)}
//           />
//         </IonItem>

//         <IonItem>
//           <IonInput
//             label="Email"
//             labelPlacement="stacked"
//             value={email}
//             readonly
//           />
//         </IonItem>

//         {message && (
//           <IonText color={message.includes("success") ? "success" : "danger"}>
//             <p style={{ marginTop: 12 }}>{message}</p>
//           </IonText>
//         )}

//         <IonButton
//           expand="block"
//           style={{ marginTop: 20 }}
//           onClick={handleSave}
//           disabled={loading}
//         >
//           Save Changes
//         </IonButton>

//         <IonButton
//           expand="block"
//           fill="clear"
//           onClick={onClose}
//         >
//           Close
//         </IonButton>
//       </IonContent>
//     </IonModal>
//   );
// };

// export default ProfileModal;




import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText
} from "@ionic/react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const ProfileModal: React.FC<Props> = ({ isOpen, onClose, onUpdated }) => {
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 📸 image states
  const [file, setFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    if (!user || !isOpen) return;

    setMessage("");

    const loadProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(user.email || "");
        setPhotoURL(data.photoURL || null);
      }
    };

    loadProfile();
  }, [user, isOpen]);

  /* ================= FILE HANDLING ================= */

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

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

          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width *= ratio;
          height *= ratio;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx!.imageSmoothingEnabled = true;
          ctx!.imageSmoothingQuality = "high";

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
      uploadFileData = await compressImage(file);
    }

    data.append("file", uploadFileData);
    data.append("upload_preset", "matthew car wash and cleaning website");

    // 👇 better organization per user
    data.append("folder", `app_profile_images/${user?.uid}`);

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

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!name || !phone) {
      setMessage("Name and phone are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let newPhotoURL = photoURL;

      // 📸 upload new image if selected
      if (file) {
        try {
          newPhotoURL = await uploadFile(file);
        } catch {
          setMessage("Image upload failed");
          return;
        }
      }

      // update firestore
      await updateDoc(doc(db, "users", user!.uid), {
        name,
        phone,
        photoURL: newPhotoURL || null
      });

      // update firebase auth
      await updateProfile(user!, {
        displayName: name,
        photoURL: newPhotoURL || undefined
      });

      setMessage("Profile updated successfully ✅");

      onUpdated();
      onClose();

    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* PROFILE IMAGE */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <label style={{ cursor: "pointer" }}>
            <img
              src={
                previewUrl ||
                photoURL ||
                `https://ui-avatars.com/api/?name=${name || "User"}&background=00c8ff&color=fff`
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
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          <p style={{ fontSize: "12px", color: "#777" }}>
            Tap to change profile image
          </p>

          {uploadProgress > 0 && (
            <p style={{ fontSize: "12px", color: "#00c8ff" }}>
              Uploading: {uploadProgress}%
            </p>
          )}
        </div>

        <IonItem>
          <IonInput
            label="Full Name"
            labelPlacement="stacked"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Phone Number"
            labelPlacement="stacked"
            value={phone}
            onIonChange={(e) => setPhone(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Email"
            labelPlacement="stacked"
            value={email}
            readonly
          />
        </IonItem>

        {message && (
          <IonText color={message.includes("success") ? "success" : "danger"}>
            <p style={{ marginTop: 12 }}>{message}</p>
          </IonText>
        )}

        <IonButton expand="block" style={{ marginTop: 20 }} onClick={handleSave} disabled={loading}>
          Save Changes
        </IonButton>

        <IonButton expand="block" fill="clear" onClick={onClose}>
          Close
        </IonButton>

      </IonContent>
    </IonModal>
  );
};

export default ProfileModal;