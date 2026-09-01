# ระบบแบบทดสอบก่อนเรียนและหลังเรียน เรื่อง วันสำคัญทางพระพุทธศาสนา 🌸

Web Application สื่อการเรียนรู้และแบบทดสอบก่อนเรียน-หลังเรียน เรื่อง **"วันสำคัญทางพระพุทธศาสนา"** 
ออกแบบในสไตล์ **Light Mode ผสม Glassmorphism** (เอฟเฟกต์กระจกใส โทนสีดอกบัวและสีทองอร่าม) 
พร้อมระบบ **Dashboard สรุปพัฒนาการนักเรียนแบบ Real-time** และ **ระบบหลังบ้านสำหรับคุณครู** เพื่อดูรายงาน คัดกรองรายห้อง ลบข้อมูล และส่งออกเป็นไฟล์ Excel / CSV

---

## 🌟 ฟีเจอร์หลัก (Features)

1. **ระบบคัดกรองนักเรียน**:
   - เลือกห้องเรียน (ม.2/1 - ม.2/5)
   - กรอกเลขประจำตัวนักเรียน 5 หลัก
   - เลือกคำนำหน้าชื่อ (เด็กชาย, เด็กหญิง, นาย, นางสาว) และกรอก ชื่อ-สกุล
   - ตรวจสอบสถานะอัตโนมัติ: ทำครั้งแรกจะเป็น **"แบบทดสอบก่อนเรียน"** ทำครั้งถัดไปจะเป็น **"แบบทดสอบหลังเรียน"**

2. **แบบทดสอบ 10 ข้อ**:
   - แสดงโจทย์และตัวเลือกทีละข้อ พร้อมแถบ Progress Bar สไตล์ Glassmorphism
   - อ้างอิงเนื้อหาตามหลักสูตรศาสนาและวันสำคัญทางพระพุทธศาสนา (มาฆบูชา, วิสาขบูชา, อัฏฐมีบูชา, อาสาฬหบูชา, เข้าพรรษา, ออกพรรษา, เทโวโรหณะ)

3. **Dashboard สรุปพัฒนาการแบบ Real-time**:
   - เปรียบเทียบคะแนน Pre-test vs Post-test แบบเรียลไทม์
   - คำนวณเปอร์เซ็นต์พัฒนาการ (+XX%) และคะแนนที่เพิ่มขึ้น
   - แสดงเฉลยคำตอบพร้อมคำอธิบายแบบละเอียดทั้ง 10 ข้อ

4. **ระบบหลังบ้านสำหรับคุณครู (Teacher Backoffice)**:
   - ป้องกันเข้าใช้งานด้วยรหัสผ่าน `nwsp1234`
   - คัดกรองดูข้อมูลแยกตามห้องเรียน (ม.2/1 - ม.2/5)
   - สรุปค่าเฉลี่ยคะแนนก่อนเรียน, หลังเรียน และพัฒนาการเฉลี่ยของห้อง
   - **ปุ่มลบข้อมูลนักเรียน**: สำหรับแก้ไขเมื่อนักเรียนกรอกข้อมูลผิดพลาด
   - **ส่งออกรายงาน**: ดาวน์โหลดไฟล์ **Excel (.xlsx)** และ **CSV** จัดคอลัมน์สวยงามได้ทันที

---

## 📘 คู่มืออย่างละเอียด Step-by-Step (Firebase + GitHub + Cloudflare)

### 📌 ส่วนที่ 1: การตั้งค่า Firebase Firestore Database (ฟรี 100%)

1. ไปที่เว็บไซต์ [Firebase Console](https://console.firebase.google.com/) แล้วเข้าสู่ระบบด้วย Google Account
2. กดปุ่ม **Add Project** -> ตั้งชื่อโปรเจกต์ เช่น `buddhist-quiz-app` -> กด **Continue** จนสร้างโปรเจกต์เสร็จ
3. ในแถบเมนูด้านซ้าย เลือก **Build** -> **Firestore Database** -> กด **Create Database**
4. เลือกโหมด **Start in test mode** -> เลือก Location (เช่น `asia-southeast1`) -> กด **Enable**
5. ไปที่ **Project Settings** (ไอคอนฟันเฟือง ⚙️ มุมซ้ายบน)
6. เลื่อนลงมาด้านล่างหัวข้อ *Your apps* -> กดไอคอนเว็บ **`</>`**
7. ตั้งชื่อแอป แล้วกด **Register app**
8. คัดลอกชุดโค้ด `firebaseConfig` ที่ปรากฏบนหน้าจอ ตัวอย่างเช่น:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXX...",
     authDomain: "buddhist-quiz-app.firebaseapp.com",
     projectId: "buddhist-quiz-app",
     storageBucket: "buddhist-quiz-app.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef..."
   };
   ```
9. เปิดไฟล์ `app-storage.js` ในโปรเจกต์ นำโค้ด `firebaseConfig` ไปวางแทนที่บรรทัดที่ 7-14 แล้วบันทึกไฟล์ (Save)

---

### 📌 ส่วนที่ 2: การอัปโหลดซอร์สโค้ดขึ้น GitHub

1. เข้าไปที่ [GitHub.com](https://github.com/) เข้าสู่ระบบ แล้วกดปุ่ม **New Repository** (หรือไอคอน `+` มุมขวาบน)
2. ตั้งชื่อ Repository เช่น `buddhist-quiz` เลือกสถานะเป็น **Public** -> กด **Create repository**
3. เปิด PowerShell หรือ Command Prompt ในโฟลเดอร์โปรเจกต์ `d:\WEB APP\Social Quiz` แล้วคัดลอกคำสั่งนี้ไปวาง:

```bash
git init
git add .
git commit -m "Initial commit - Buddhist Quiz Web App"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/buddhist-quiz.git
git push -u origin main
```
*(⚠️ หมายเหตุ: เปลี่ยน `YOUR_GITHUB_USERNAME` เป็น Username GitHub ของคุณครู)*

---

### 📌 ส่วนที่ 3: การรันขึ้นโฮสติ้งฟรีผ่าน Cloudflare Pages

1. เข้าสู่ระบบ [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. ที่แถบเมนูด้านซ้าย เลือก **Workers & Pages** -> กดปุ่ม **Create Application** -> เลือกแท็บ **Pages**
3. กดเลือก **Connect to GitHub**
4. เลือกร้านค้าบัญชี GitHub และเลือก Repository `buddhist-quiz` ที่อัปโหลดไว้ -> กด **Begin setup**
5. ในหน้าตั้งค่า **Build settings**:
   - **Framework preset**: เลือก `None`
   - **Build command**: *ปล่อยว่างไว้ (ไม่ต้องใส่)*
   - **Build output directory**: *ปล่อยว่างไว้ (ไม่ต้องใส่)*
6. กดปุ่ม **Save and Deploy**
7. รอประมาณ 30 วินาที ระบบจะขึ้นเครื่องหมายถูกสีเขียว พร้อมแจกโดเมนฟรี เช่น `https://buddhist-quiz.pages.dev` คุณครูสามารถคัดลอกลิงก์นี้ส่งให้นักเรียนทำแบบทดสอบได้ทันที!

---

## 🔑 ข้อมูลการเข้าสู่ระบบหลังบ้าน
- **รหัสผ่านคุณครู**: `nwsp1234`
