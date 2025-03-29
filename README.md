# Money Transfer Matching App

A real-time web application that helps Afghan students in India find matching money transfer requests between India and Afghanistan.

## Features

- Phone number authentication using Firebase
- Create, view, and manage money transfer requests
- Real-time updates using Firebase Firestore
- Modern and responsive UI with dark mode support
- Secure user data and request management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd money-transfer-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable:
   - Authentication (Phone Number)
   - Firestore Database
   - Hosting (optional)

4. Copy the Firebase configuration values to `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts (Auth, etc.)
├── pages/         # Page components
├── config/        # Configuration files
└── theme.ts       # Chakra UI theme configuration
```

## Technologies Used

- React + TypeScript
- Vite
- Firebase (Authentication & Firestore)
- Chakra UI
- React Router

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
