# Mobile Legends Hero Explorer

A web application to explore Mobile Legends heroes, their roles, and specialties. Users can search, filter, and save their favorite heroes.

## Features

- User authentication (Email/Password and Google OAuth)
- View all Mobile Legends heroes
- Filter heroes by role (Tank, Fighter, Mage, etc.)
- Filter heroes by specialty (Chase, Control, Damage, etc.)
- Search heroes by name
- Add heroes to favorites collection
- AI-powered content generation using Gemini API

## Technology Stack

### Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JSON Web Token for authentication
- Google OAuth integration
- Gemini API for AI content

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios for HTTP requests

## API Documentation

### Base URL

```
http://localhost:3009
```

### Authentication

#### 1. Register

- **URL**: `/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

#### 2. Login

- **URL**: `/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### 3. Google Login

- **URL**: `/authgoogle`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "googleToken": "string"
  }
  ```

### Heroes

#### 1. Get All Heroes

- **URL**: `/hero`
- **Method**: `GET`

#### 2. Get Hero By ID

- **URL**: `/hero/:id`
- **Method**: `GET`

#### 3. Get All Roles

- **URL**: `/role`
- **Method**: `GET`

#### 4. Get All Specialties

- **URL**: `/specially`
- **Method**: `GET`

### Favorites

#### 1. Get All Favorites

- **URL**: `/favorite`
- **Method**: `GET`

#### 2. Edit Favorite

- **URL**: `/favorite/:id`
- **Method**: `PUT`

#### 3. Delete Favorite

- **URL**: `/favorite/:id`
- **Method**: `DELETE`

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- PostgreSQL
- Google OAuth credentials (for authentication)
- Gemini API key (for AI content)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/mobile-legends-hero-explorer.git
   ```

2. Install dependencies for backend

   ```bash
   cd server
   npm install
   ```

3. Install dependencies for frontend

   ```bash
   cd ../client/IP-Indra
   npm install
   ```

4. Configure environment variables

   - Create `.env` file in server directory

   ```
   PORT=3009
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_db_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

   - Create `.env` file in client/IP-Indra directory

   ```
   VITE_API_URL=http://localhost:3009
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

5. Set up the database

   ```bash
   cd server
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. Start the backend server

   ```bash
   npm start
   ```

7. Start the frontend development server

   ```bash
   cd ../client/IP-Indra
   npm run dev
   ```

8. Access the application at `http://localhost:5173`

## Sample Account

```
email: reviewer@mail.com
password: password123
```

## Screenshot

![Application Screenshot](./screenshot.png)

## ERD

![Entity Relationship Diagram](./erd.png)

## Contributors

- [Your Name](https://github.com/yourusername)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
