import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

/* Import your logo */
import Logo from '../assets/logo.png'; // Make sure your logo is in /src/assets/logo.png

/* Styled Components */
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   width: 100%;
//   padding: 20px;
//   background: linear-gradient(180deg, #00c6ff 0%, #0072ff 100%);
// `;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 20px;
  background: linear-gradient(180deg, #00c8ff 0%, #003c85 100%);
`;

const LogoImage = styled.img`
  width: 180px;
  height: 180px;
  margin-bottom: 30px;
  border-radius: 90px;
  object-fit: contain;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 28px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #e0f7ff;
  text-align: center;
  margin-bottom: 50px;
`;

const StartButton = styled.button`
  background-color: #fff;
  color: #0072ff;
  font-size: 18px;
  font-weight: bold;
  padding: 14px 50px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Splash: React.FC = () => {
  const history = useHistory();

  const goToMain = () => {
    history.replace('/login'); // Navigate to Home or Main page
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Container>
          <LogoImage src={Logo} alt="App Logo" />
          <Title>MACO STAFF</Title>
          <Subtitle>Shine like never before!</Subtitle>
          <StartButton onClick={goToMain}>Get Started</StartButton>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Splash;



// import React from 'react';
// import { IonPage, IonContent } from '@ionic/react';
// import { useHistory } from 'react-router-dom';
// import styled from 'styled-components';

// /* Import your logo */
// import Logo from '../assets/logo.png';

// // /* Styled Components */
// // const Container = styled.div`
// //   display: flex;
// //   flex-direction: column;
// //   justify-content: center;
// //   align-items: center;
// //   height: 100%;
// //   width: 100%;
// //   padding: 20px;
// //   /* Darker, premium gradient inspired by ride-sharing apps */
// //   background: linear-gradient(180deg, #121212 0%, #1a1a2e 100%);
// // `;

// // const LogoContainer = styled.div`
// //   /* Creates a soft glow behind the logo to make it stand out against dark */
// //   background: rgba(255, 255, 255, 0.05);
// //   padding: 20px;
// //   border-radius: 50%;
// //   margin-bottom: 40px;
// //   // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
// // `;

// const LogoImage = styled.img`
//   width: 160px;
//   height: 160px;
//   object-fit: cover;
//   border-radius: 50%;
// `;

// // const Title = styled.h1`
// //   font-size: 32px;
// //   color: #ffffff;
// //   font-weight: 800;
// //   letter-spacing: 1.5px;
// //   text-align: center;
// //   margin-bottom: 8px;
// //   text-transform: uppercase;
// // `;

// // const Subtitle = styled.p`
// //   font-size: 16px;
// //   color: #94a3b8; /* Muted slate color */
// //   text-align: center;
// //   margin-bottom: 60px;
// //   font-weight: 400;
// // `;

// // const StartButton = styled.button`
// //   /* Using a color that complements the teal/yellow logo */
// //   background-color: #facc15; /* Professional Yellow/Gold */
// //   color: #000;
// //   font-size: 18px;
// //   font-weight: 700;
// //   padding: 16px 60px;
// //   border: none;
// //   border-radius: 12px; /* Slightly more modern "squircle" than pill shape */
// //   cursor: pointer;
// //   box-shadow: 0px 4px 15px rgba(250, 204, 21, 0.3);
// //   transition: all 0.3s ease;

// //   &:active {
// //     transform: scale(0.95);
// //   }
// // `;


// /* Styled Components */
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   width: 100%;
//   padding: 20px;
//   /* Darker shades derived from your logo's teal base */
//   background: linear-gradient(180deg, #0a191e 0%, #050c0f 100%);
// `;

// const LogoContainer = styled.div`
//   /* Uses a semi-transparent version of your logo cyan for a glow effect */
//   background: rgba(0, 198, 224, 0.08); 
//   padding: 30px;
//   border-radius: 50%;
//   margin-bottom: 40px;
//   box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
// `;

// const Title = styled.h1`
//   font-size: 32px;
//   color: #ffffff;
//   font-weight: 800;
//   letter-spacing: 2px;
//   margin-bottom: 8px;
// `;

// const Subtitle = styled.p`
//   font-size: 16px;
//   color: #64748b; /* Slate gray for readability */
//   margin-bottom: 60px;
// `;

// const StartButton = styled.button`
//   /* Matching the exact Yellow from your logo */
//   background-color: #fdd85d; 
//   color: #050c0f;
//   font-size: 18px;
//   font-weight: 700;
//   padding: 18px 70px;
//   border: none;
//   border-radius: 12px;
//   box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
//   transition: all 0.2s ease-in-out;

//   &:active {
//     transform: scale(0.96);
//     background-color: #e6c453;
//   }
// `;


// const Splash: React.FC = () => {
//   const history = useHistory();

//   const goToMain = () => {
//     history.replace('/home');
//   };

//   return (
//     <IonPage>
//       <IonContent fullscreen>
//         <Container>
//           <LogoContainer>
//             <LogoImage src={Logo} alt="MACO Logo" />
//           </LogoContainer>
          
//           <Title>MACO</Title>
//           <Subtitle>Your premium ride awaits.</Subtitle>
          
//           <StartButton onClick={goToMain}>Get Started</StartButton>
//         </Container>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Splash;