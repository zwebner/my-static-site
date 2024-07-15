const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-file.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://lehanchil-bbc8b.firebaseio.com'
    });
}

const db = admin.firestore();

module.exports = db;
