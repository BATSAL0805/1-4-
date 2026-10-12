// Sends the daily 11pm reminder push notification to every registered device.
// Run by .github/workflows/daily-alarm.yml on a cron schedule (KST 23:00).
// Requires FIREBASE_SERVICE_ACCOUNT_KEY env var: the full JSON content of a
// Firebase service account key (Project settings -> Service accounts).
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountJson) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not set.");
  process.exit(1);
}

const app = initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
const db = getFirestore(app);
const messaging = getMessaging(app);

const snapshot = await db.collection("pushTokens").get();
const tokens = snapshot.docs.map((doc) => doc.id);

if (tokens.length === 0) {
  console.log("No registered devices, nothing to send.");
  process.exit(0);
}

const response = await messaging.sendEachForMulticast({
  tokens,
  notification: {
    title: "1-4 알림장",
    body: "오늘 할일을 확인해보세요.",
  },
});

console.log(`Sent: ${response.successCount}, failed: ${response.failureCount}`);

const staleTokens = [];
response.responses.forEach((result, index) => {
  if (!result.success && result.error?.code === "messaging/registration-token-not-registered") {
    staleTokens.push(tokens[index]);
  }
});

if (staleTokens.length > 0) {
  await Promise.all(staleTokens.map((token) => db.collection("pushTokens").doc(token).delete()));
  console.log(`Removed ${staleTokens.length} stale token(s).`);
}
