import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrSZeDBkev16fWPkqTj4aIIIsWXl2Wp0E",
    authDomain: "dana-first-birthday.firebaseapp.com",
    projectId: "dana-first-birthday",
    storageBucket: "dana-first-birthday.firebasestorage.app",
    messagingSenderId: "609008667156",
    appId: "1:609008667156:web:c2cac349d171eb0d45b501"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveAttendance = async function (data) {

    try {

        await addDoc(collection(db, "attendance"), {

            ...data,
            createdAt: serverTimestamp()

        });

        return true;

    } catch (e) {

        console.error(e);
        return false;

    }

}