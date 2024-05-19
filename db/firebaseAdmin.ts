const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require("/serviceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
     // The database URL depends on the location of the database
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

// TODO: need auth

export { admin, db };