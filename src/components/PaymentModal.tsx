import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner
} from "@ionic/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

interface Props {
  isOpen: boolean;
  amount: number; // in AED
  orderId: string;
  onClose: () => void;
}

const CheckoutForm: React.FC<Props> = ({ amount, orderId, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // 🔐 Create PaymentIntent via backend
  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency: "aed",
        orderId
      })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin
      }
    });

    if (!error) {
      onClose();
    }

    setLoading(false);
  };

  if (!clientSecret) {
    return <IonSpinner />;
  }

  return (
    <>
      <PaymentElement />

      <IonButton
        expand="block"
        style={{ marginTop: 20 }}
        onClick={handlePay}
        disabled={!stripe || loading}
      >
        {loading ? "Processing…" : `Pay AED ${amount}`}
      </IonButton>
    </>
  );
};

const PaymentModal: React.FC<Props> = ({ isOpen, onClose, amount, orderId }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Secure Payment</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ padding: 16 }}>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            currency: "aed",
            amount: amount * 100
          }}
        >
          <CheckoutForm
            amount={amount}
            orderId={orderId}
            isOpen={isOpen}
            onClose={onClose}
          />
        </Elements>
      </IonContent>
    </IonModal>
  );
};

export default PaymentModal;
