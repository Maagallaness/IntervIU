# IntervIU To Implement
Backend (BE) Tools
Database Tools
Authentication (AUTH)
Frontend Tools
Other Essentials

### Backend (BE) Tools
1. **Framework**:  
   - **Node.js + Express.js** (lightweight, JavaScript, large ecosystem).  
   - Alternative: **Python + Django** (batteries-included, great for rapid prototyping).  

2. **API Testing**:  
   - **Postman** & ** Insomnia**

3. **Local Development**:  
   - **Nodemon** (auto-reload server during development).  

---

### **Database Tools**  
1. **Database**:  
   - **MongoDB** (NoSQL, free tier for local/cloud).  

2. **Database GUI**:  
   - **DBeaver** (universal database client, free).  
   - **TablePlus** (free tier for local databases).  

3. **ORM/ODM**:  
   - For SQL: **Prisma** (TypeScript-friendly) or **Sequelize**.  
   - For MongoDB: **Mongoose**.  

4. MongoDB & Prisma Implemented 
---

### **Authentication (AUTH)**  
1. **JWT (JSON Web Tokens)**:  
   - Use libraries like **jsonwebtoken** (Node.js) for token-based auth.  

2. **OAuth Providers** (free tiers):  
   - **Firebase Authentication** (free for basic use, supports Google/GitHub/etc.).  
   - **Auth0** (free tier for up to 7k active users).  

3. **Local Auth**:  
   - Implement email/password auth with hashing (e.g., **bcrypt**).  

---

### **Frontend Tools**  
1. **Framework**:  
   - **React** (with **Vite** for fast setup) or **SvelteKit**.  

2. **Styling**:  
   - **Tailwind CSS** (utility-first, free) for rapid UI development.  

3. **State Management**:  
   - **React Context API** (built-in) or **Zustand** (lightweight).  

---

### **Other Essentials**  
1. **Version Control**:  
   - **Git** + **GitHub** (free for public/private repos).  

2. **Environment Management**:  
   - **Docker** (containerize your app for consistency).  

3. **Hosting (Later Stages)**:  
   - **Render** (free tier) or **Vercel** (frontend hosting).  

4. **Project Management**:  
   - **Trello** or **Notion** (free tiers) for task tracking.  

---

### **Current App Feedback**  
From your screenshots:  
- Fix typos:  
  - *"Automática el proceso"* → *"Automatiza el proceso"*.  
  - *"Otúen evaluaciones"* → *"Obtén evaluaciones"*.  
- Ensure consistency in buttons (**"Comenzar ahora"** vs. **"Conectar ahora"**).  

---
## Installation
### **Local Setup Example**  
For a Node.js/React stack:  
```bash
# Backend
mkdir intervui-backend && cd intervui-backend
npm init -y
npm install express mongoose jsonwebtoken bcrypt cors
npm install nodemon --save-dev

# Frontend
npx create-vite@latest intervui-frontend --template react
cd intervui-frontend
npm install react-router-dom axios
```
