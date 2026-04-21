# **💸 PayMates**  
*"Easily split group expenses, track payments, and settle up — together!"*

---

## **🚀 Description:**  

**PayMates** is a lightweight, full-stack expense-splitting app that helps friends, roommates, travel buddies, and teams manage shared costs effortlessly. Create or join an event, add expenses, and let PayMates calculate who owes what. It’s your digital IOU notebook — but smarter, faster, and way easier to use!

- ✅ Create or join an event using a unique invite code.
- ✅ Add shared expenses and specify how they should be split (evenly or custom amounts).
- ✅ Track who owes who — with live balance summaries.
- ✅ Mark payments as "paid" to stay on top of what’s settled.
- ✅ Auto-deletes events (and data) after 7 days for privacy and simplicity.

Whether you're traveling with friends or splitting rent with roommates, **PayMates** keeps the math (and peace) in check.

---

## **🛠️ Technologies Used:**  

### **Frontend (React + Bootstrap)**  
- **React.js** – Component-based UI.  
- **React Router** – Routing.  
- **Bootstrap 5 + React-Bootstrap** – UI styling and layout.  
- **Axios** – HTTP requests to the backend.  
- **React Hooks** – State and lifecycle management.  

### **Backend (Node.js & Express)**  
- **Node.js** – Server-side runtime.  
- **Express.js** – API routing and logic.  
- **MongoDB (via Mongoose)** – NoSQL data storage.  
- **Mongoose** – Object modeling for MongoDB.  
- **MongoDB TTL Indexes** – Auto-delete events and transactions after expiration.  

---

## **📚 Skills & Concepts Applied:**  

### **Core App Functionality**  
- **Create & Join Events** via invite codes.  
- **Add/Edit Transactions** with flexible splitting options.  
- **Balance Summaries** that calculate real-time IOUs.  
- **Mark Transactions as Paid** — with individual tracking.  

### **Full-Stack Architecture**  
- **MongoDB + Express + React + Node (MERN)**.  
- **RESTful API** design.  
- **Client-server communication** with Axios.  

### **UI/UX Best Practices**  
- Responsive design for all screen sizes.  
- Inline form validation & error feedback.  
- Auto-dismiss toasts for notifications.  
- Live countdowns to event expiration.  

### **Data & State Management**  
- **React State Hooks** – Form control & dynamic UI.  
- **MongoDB Map Fields** – Store custom split values.  
- **TTL (Time To Live)** – Auto-cleanup expired events & expenses.  

---

## **📖 Features & How to Use PayMates:**  

### **🌟 Creating or Joining an Event:**  
- Create an event with a name and a title.  
- Share the invite code or link with friends.  
- Friends can join by selecting their name or entering a new one.  

### **💳 Adding & Managing Expenses:**  
- Add a transaction with:
  - A title (e.g., "Groceries").
  - Who paid.
  - Who participated.
  - How much each person owes (even split or custom).
- Edit or delete expenses if something changes.  
- Real-time balance updates.  

### **📉 Balance Summary:**  
- See what you owe and who owes you.  
- Mark your own payments as "paid".  
- See others’ payment status in your event.  

### **🧼 Event Auto-Cleanup:**  
- Events auto-expire 7 days after creation.  
- Transactions tied to expired events are deleted automatically.  

---

## **📈 Ideas for Future Improvements:**  

- **Mobile App** support (React Native).  
- **Receipt Uploads** and attachments.  
- **Payment Reminders or Notifications**.  
- **Export to PDF or CSV**.  
- **Payment Integrations** (Venmo, PayPal, etc.)  
- **Event History** with analytics and summaries.  

---

## **📜 How to Run the Project Locally:**  

### **1. Clone the Repository:**  
```bash
git clone https://github.com/your-username/payMates.git
```

### **2. Backend Setup:**  
```bash
cd payMates/backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your-mongodb-connection-string
PORT=5003
```

Start the backend server:
```bash
npm start
```

### **3. Frontend Setup:**  
```bash
cd ../frontend
npm install
npm start
```

Then open:
```
http://localhost:3000
```

---

## **👤 Author:**  
**Carlos A. Cárdenas**  

---

## **💡 Final Thoughts:**  

**PayMates** is a clean, purpose-built app that simplifies one of the most common group pain points: shared expenses. From friends on vacation to roommates splitting rent, PayMates saves time, avoids awkward money convos, and makes “settling up” seamless.

If you found this useful, star the repo ⭐ and feel free to contribute!
