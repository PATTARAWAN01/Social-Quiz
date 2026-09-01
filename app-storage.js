// Data Storage & Synchronization Manager (Firebase Firestore + LocalStorage Fallback)

const STORAGE_KEY_STUDENTS = 'buddhist_quiz_students_v1';
const STORAGE_KEY_RESULTS = 'buddhist_quiz_results_v1';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLYNZyIFWEusI2CMQP65_wPMzTC3__E-g",
  authDomain: "nwsp-social-quiz.firebaseapp.com",
  projectId: "nwsp-social-quiz",
  storageBucket: "nwsp-social-quiz.firebasestorage.app",
  messagingSenderId: "302303510508",
  appId: "1:302303510508:web:91ba116291c8df371ecac9",
  measurementId: "G-F3YNNMRDWL"
};

let db = null;
let isFirebaseEnabled = false;

// Initialize Firebase if configured
try {
  if (typeof firebase !== 'undefined' && firebaseConfig.projectId) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    isFirebaseEnabled = true;
    console.log("Firebase Firestore Initialized Successfully");
  }
} catch (e) {
  console.warn("Firebase not configured or script unavailable, using LocalStorage fallback mode.", e);
}

const AppStorage = {
  // Helper: Get local data
  _getLocalStudents() {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    return raw ? JSON.parse(raw) : [];
  },

  _saveLocalStudents(students) {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  },

  _getLocalResults() {
    const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
    return raw ? JSON.parse(raw) : {};
  },

  _saveLocalResults(results) {
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(results));
  },

  // 1. Check student status by 5-digit student ID
  async getStudent(studentId) {
    const cleanId = String(studentId).trim();
    
    if (isFirebaseEnabled && db) {
      try {
        const docRef = db.collection('students').doc(cleanId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const student = docSnap.data();
          const resultSnap = await db.collection('results').doc(cleanId).get();
          const results = resultSnap.exists ? resultSnap.data() : null;
          return { student, results };
        }
      } catch (err) {
        console.error("Firebase getStudent error:", err);
      }
    }

    // LocalStorage fallback
    const students = this._getLocalStudents();
    const student = students.find(s => s.studentId === cleanId) || null;
    const resultsMap = this._getLocalResults();
    const results = resultsMap[cleanId] || null;

    return { student, results };
  },

  // 2. Save Pre-test
  async savePreTest(studentData, score, answers) {
    const cleanId = String(studentData.studentId).trim();
    const timestamp = new Date().toISOString();

    const updatedStudent = {
      studentId: cleanId,
      prefix: studentData.prefix,
      fullname: studentData.fullname,
      room: studentData.room,
      updatedAt: timestamp
    };

    if (isFirebaseEnabled && db) {
      try {
        await db.collection('students').doc(cleanId).set(updatedStudent, { merge: true });
        await db.collection('results').doc(cleanId).set({
          studentId: cleanId,
          preScore: score,
          preAnswers: answers,
          preSubmittedAt: timestamp
        }, { merge: true });
      } catch (err) {
        console.error("Firebase savePreTest error:", err);
      }
    }

    // LocalStorage fallback sync
    const students = this._getLocalStudents();
    const existingIndex = students.findIndex(s => s.studentId === cleanId);
    if (existingIndex >= 0) {
      students[existingIndex] = updatedStudent;
    } else {
      students.push(updatedStudent);
    }
    this._saveLocalStudents(students);

    const results = this._getLocalResults();
    results[cleanId] = {
      ...(results[cleanId] || {}),
      studentId: cleanId,
      preScore: score,
      preAnswers: answers,
      preSubmittedAt: timestamp
    };
    this._saveLocalResults(results);

    return { student: updatedStudent, results: results[cleanId] };
  },

  // 3. Save Post-test
  async savePostTest(studentId, score, answers) {
    const cleanId = String(studentId).trim();
    const timestamp = new Date().toISOString();

    if (isFirebaseEnabled && db) {
      try {
        await db.collection('results').doc(cleanId).set({
          postScore: score,
          postAnswers: answers,
          postSubmittedAt: timestamp
        }, { merge: true });
      } catch (err) {
        console.error("Firebase savePostTest error:", err);
      }
    }

    // LocalStorage fallback sync
    const results = this._getLocalResults();
    if (results[cleanId]) {
      results[cleanId].postScore = score;
      results[cleanId].postAnswers = answers;
      results[cleanId].postSubmittedAt = timestamp;
      this._saveLocalResults(results);
    }

    const { student } = await this.getStudent(cleanId);
    return { student, results: results[cleanId] };
  },

  // 4. Get all records for Teacher Backoffice
  async getAllRecords() {
    if (isFirebaseEnabled && db) {
      try {
        const studentDocs = await db.collection('students').get();
        const resultDocs = await db.collection('results').get();

        const resultsMap = {};
        resultDocs.forEach(doc => {
          resultsMap[doc.id] = doc.data();
        });

        const list = [];
        studentDocs.forEach(doc => {
          const s = doc.data();
          const r = resultsMap[s.studentId] || {};
          list.push({ ...s, ...r });
        });

        return list;
      } catch (err) {
        console.error("Firebase getAllRecords error:", err);
      }
    }

    // LocalStorage fallback
    const students = this._getLocalStudents();
    const resultsMap = this._getLocalResults();

    return students.map(s => {
      const r = resultsMap[s.studentId] || {};
      return { ...s, ...r };
    });
  },

  // 5. Delete student record by Student ID
  async deleteStudent(studentId) {
    const cleanId = String(studentId).trim();

    if (isFirebaseEnabled && db) {
      try {
        await db.collection('students').doc(cleanId).delete();
        await db.collection('results').doc(cleanId).delete();
      } catch (err) {
        console.error("Firebase deleteStudent error:", err);
      }
    }

    // LocalStorage fallback
    const students = this._getLocalStudents().filter(s => s.studentId !== cleanId);
    this._saveLocalStudents(students);

    const results = this._getLocalResults();
    delete results[cleanId];
    this._saveLocalResults(results);

    return true;
  }
};

window.AppStorage = AppStorage;
