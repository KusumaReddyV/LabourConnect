# LabourConnect

LabourConnect is a full-stack MERN application for connecting clients with labourers for service-based work. The application provides role-based access for clients, labourers, and administrators, along with labour search, job requests, booking management, job tracking, earnings, and user management.

## Features

* Role-based authentication for Client, Labour, and Admin
* Client and labour registration and login
* Labour profile management
* Labour search and profile viewing
* Job request and booking system
* Accept and reject job requests
* Job status tracking
* Client-labour communication
* Labour earnings tracking
* Labour profile image uploads
* Admin dashboard
* User management
* Helpdesk management
* JWT-based authentication
* Protected routes and role-based authorization

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript
* React Router

### Backend

* Node.js
* Express.js
* REST API
* JWT
* Multer

### Database

* MongoDB Atlas
* Mongoose

### Cloud Storage

* Cloudinary

### Tools

* Git
* GitHub
* Postman
* npm

## Project Structure

```text
LabourConnect/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── labourController.js
│   ├── middleware/
│   │   └── upload.js
│   ├── utils/
│   │   └── uploadToCloudinary.js
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/KusumaReddyV/LabourConnect.git
```

Navigate to the project:

```bash
cd LabourConnect
```

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm start
```

For development, if configured in `package.json`:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

## MongoDB Atlas

LabourConnect uses MongoDB Atlas as its cloud database.

The backend connects to MongoDB Atlas using Mongoose.

Example connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/labourconnect
```

Before running the application:

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Configure network access.
4. Copy the MongoDB connection string.
5. Add the connection string to the backend `.env` file.

Do not commit the `.env` file or database credentials to GitHub.

## Cloudinary

Cloudinary is used to store labour profile images.

The upload flow is:

```text
Frontend
   ↓
Backend
   ↓
Multer
   ↓
Cloudinary
   ↓
Image URL
   ↓
MongoDB Atlas
```

Cloudinary credentials should be stored in the backend `.env` file.

## Authentication

LabourConnect uses JWT authentication.

The authentication flow is:

```text
User Login
    ↓
Backend validates credentials
    ↓
JWT generated
    ↓
Token sent to client
    ↓
Protected requests use JWT
```

Access to different features is controlled based on the user's role:

* Client
* Labour
* Admin

## Application Flow

```text
Client
  │
  ├── Search Labour
  ├── View Labour Profile
  ├── Send Job Request
  └── Track Job
          │
          ↓
       Labour
          │
          ├── View Request
          ├── Accept / Reject
          ├── Complete Job
          └── View Earnings
          
Admin
  │
  ├── Manage Users
  ├── Monitor Platform
  └── Manage Helpdesk
```

## API Modules

The backend provides APIs for:

* Authentication
* User management
* Labour profiles
* Job requests
* Job management
* Earnings
* Helpdesk
* Admin management
* Image uploads

## Environment Variables

The following variables are required for the backend:

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Add the following to `.gitignore`:

```gitignore
.env
node_modules/
```

## Repository

GitHub: https://github.com/KusumaReddyV/LabourConnect
