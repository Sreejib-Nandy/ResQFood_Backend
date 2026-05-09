![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)
# ResQFood – Backend API
#### ResQFood is a scalable backend system built to reduce food wastage by connecting food donors (restaurants) with NGOs in real time.

#### This repository contains the Node.js + Express + MongoDB backend, handling authentication, food listings, geo-based discovery, NGO coordination, and secure APIs.

### 🚀 Features

- 🔐 JWT-based Authentication (Donors / NGOs)
- 🏪 Food Donation Management
- 📍 Location-based Food Discovery
- 🏥 NGO Registration
- 🧭 Radius-based Nearby Food Search
- 📦 Food Pickup & Status Tracking
- 🧾 Secure REST APIs
- 🛡️ Production-ready architecture

## 📁 Folder Structure
```
backend/
│
├── node_modules/
│
├── src/
│   │
│   ├── config/
│   │   ├── cloudinary.js       
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js  
│   │   ├── foodController.js  
│   │   └── userController.js  
│   │
│   ├── inngest/
│   │   ├── functions/
│   │   │   ├── cleanupExpiredFoods.js
│   │   │   └── expireFoods.js    
│   │   │
│   │   ├── client.js          
│   │   └── handler.js     
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js    
│   │   ├── foodMiddleware.js   
│   │   └── upload.js         
│   │
│   ├── models/
│   │   ├── foodPost.js      
│   │   └── User.js     
│   │
│   ├── routes/
│   │   ├── authRoutes.js      
│   │   ├── foodRoutes.js       
│   │   └── userRoutes.js      
│   │
│   ├── socket/
│   │   └── socketHandler.js    
│   │
│   ├── utils/
│   │   ├── emailTemplates.js    
│   │   └── sendEmail.js      
│   │
│   └── app.js                 
│
├── .dockerignore
├── .env                       
├── .gitignore
├── Dockerfile                
├── fly.toml               
├── package.json
├── package-lock.json
└── server.js                   
```
## ⚙️ Environment Variables
#### Create a .env file in the root directory :
``` env
PORT = 
MONGO_URI = 
JWT_SECRET = 
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
MAPBOX_ACCESS_TOKEN = 
FRONTEND_URL = 
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
INNGEST_SIGNING_KEY=
INNGEST_EVENT_KEY=
```
## 📦 Installation & Setup (Local)
#### 1️⃣ Clone the Repository
``` bash
git clone https://github.com/Sreejib-Nandy/ResQFood_Backend.git
```
``` bash
cd ResQFood_Backend
```

#### 2️⃣ Install Dependencies
``` bash
npm install
```

#### 3️⃣ Run the Server
#### Development Mode
``` bash
npm run dev
```
#### Production Mode
``` bash
npm start
```
#### Server will run at :
``` bash
http://localhost:5000
```

## 📡 Sample API Endpoints
``` bash
POST      /api/auth/register
POST      /api/auth/login
POST      /api/auth/logout

GET       /api/food/
GET       /api/food/restaurant/:restaurantId
GET       /api/food/nearby
POST      /api/food/createfood
PATCH     /api/food/:id/claim
GET       /api/food/claimed
PATCH     /api/food/:id/collected
PUT       /api/food/food/:id
DELETE    /api/food/food/:id

PATCH     /api/users/me
DELETE    /api/users/me
GET       /api/users/me
```

## 🤝 Contributing
#### Contributions are welcome!
``` bash
# Create a new branch
git checkout -b feature-name

# Commit changes
git commit -m "Add feature"

# Push
git push origin feature-name
```

## 📌 Notes
``` text
• Make sure MongoDB is running
• Use Node.js v18+
• Do not commit .env files
```

## 📜 License
This project is licensed under the **MIT License**.

## 👨‍💻 Author
### Sreejib Nandy
#### 🔗 GitHub : https://github.com/Sreejib-Nandy

#### ⭐ If you like this project, give it a star!
