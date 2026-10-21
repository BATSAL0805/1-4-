import { doc, setDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { useState } from "react";
import { db, getMessagingIfSupported } from "../firebase";

export type PushStatus = "idle" | "enabling" | "enabled" | "unsupported" | "denied" | "error";

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function enable() {
    setStatus("enabling");
    setError(null);
    try {
      const messaging = await getMessagingIfSupported();
      if (!messaging) {
        setStatus("unsupported");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}firebase-messaging-sw.js`,
      );
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      await setDoc(doc(db, "pushTokens", token), { token, createdAt: Date.now() });
      setStatus("enabled");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? `${err.name}: ${err.message}` : String(err));
      setStatus("error");
    }
  }

  return { status, error, enable };
}
