# Knot - Cloud Link Manager 🔗

Knot is a full-stack, cloud-based link management platform (similar to Linktree). It allows users to securely register, manage their social media and portfolio links, and instantly generates a clean, public profile page to share with the world.

## 🚀 Live Demo
- **Frontend:** [https://knot-parth.vercel.app](https://knot-parth.vercel.app)
- **Backend API:** Hosted on Google Cloud Compute Engine

## 🏗️ Architecture & Tech Stack

This project uses a decoupled, modern architecture:

*   **Frontend:** Pure HTML, CSS, and Vanilla JavaScript (Hosted on **Vercel** Edge CDN)
*   **Backend:** Node.js & Express.js (Hosted on **Google Cloud Platform** Ubuntu VM)
*   **Database:** MongoDB Atlas (NoSQL Cloud Database)
*   **Authentication:** Firebase Authentication (Secure JWT Tokens)

## 📁 Repository Structure

Because this is a decoupled application, the code is split into two main directories:

*   `/knot-frontend` - Contains all client-side UI files, CSS styles, and Firebase integration logic.
*   `/knot-backend` - Contains the Node.js API server, Mongoose database models, and JWT security middleware.

## ⚙️ How it Works

1.  **Authentication:** Users sign up via Firebase on the frontend. A secure JWT is generated.
2.  **Data Sync:** The frontend sends the JWT to the Google Cloud backend, which cryptographically verifies the token using Firebase Admin and syncs the user into MongoDB.
3.  **CRUD Operations:** The dashboard allows users to Create, Read, Update, and Delete links via the REST API.
4.  **Reverse Proxy:** Vercel securely proxies all `/api` requests to the raw Google Cloud IP address, bypassing CORS and Mixed Content browser restrictions.
