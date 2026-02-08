import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonText,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSpinner,
} from '@ionic/react';
import styled from 'styled-components';
import Logo from '../assets/logo.png'
import Header from '../components/Header';

const Container = styled.div`
  padding: 20px;
  background-color: #eef6f9;
  min-height: 100vh;
`;

const Hero = styled.div`
  padding: 30px;
  align-items: center;
  display: flex;
  flex-direction: column;
  // background-color: rgb(134, 134, 238);
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  // color: #f0f0f0;
  margin-top: 8px;
  text-align: center;
`;

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 16px;
  background-color: #eee;
  border: 2px solid #fff;
`;

const FormSection = styled.div`
  padding-bottom: 40px;
`;

const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: #0073ff;
  margin-bottom: 20px;
`;

const Input = styled(IonInput)`
  --padding-start: 12px;
  --padding-end: 12px;

  border-radius: 8px;


`;

const Textarea = styled(IonTextarea)`
  --padding-start: 12px;
  --padding-end: 12px;
  --background: #fff;
  border-radius: 8px;
  // border: 1px solid #ccc;
  margin-bottom: 15px;
  height: 100px;
`;

const Button = styled(IonButton)`
  // --background: rgb(134, 134, 238);
  width: 100%;
  margin-top: 10px;
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      alert('All fields are required');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      recipientEmail: 'matthewcarwashandcleaning20@gmail.com',
      websiteName: 'MCC Mobile App',
    };

    try {
      const res = await fetch('https://backend-mailer-1.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Message sent! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('❌ Error: ' + (data.error || 'Something went wrong.'));
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network Error: Please try again.');
    } finally {
      setLoading(false);
    }
  };

return (
  <IonPage>
    <Header title="Contact Us" />

    <IonContent fullscreen>
      <Container>

        <Hero>
          <LogoImage src={Logo} alt="Logo" />
          <HeroSubtitle>Contact Information and Support</HeroSubtitle>
        </Hero>

        <FormSection>
          <FormTitle>Contact Form</FormTitle>

          <IonItem>
            <Input
              value={formData.name}
              onIonChange={(e) => handleChange('name', e.detail.value)}
              placeholder="Name"
            />
          </IonItem>

          <IonItem>
            <Input
              type="email"
              value={formData.email}
              onIonChange={(e) => handleChange('email', e.detail.value)}
              placeholder="Email"
            />
          </IonItem>

          <IonItem>
            <Input
              type="tel"
              value={formData.phone}
              onIonChange={(e) => handleChange('phone', e.detail.value)}
              placeholder="Phone Number"
            />
          </IonItem>

          <IonItem>
            <Textarea
              value={formData.message}
              onIonChange={(e) => handleChange('message', e.detail.value)}
              placeholder="Message"
            />
          </IonItem>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <IonSpinner name="crescent" /> : 'Submit'}
          </Button>
        </FormSection>

      </Container>
    </IonContent>
  </IonPage>
);

};

export default Contact;
