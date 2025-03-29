# SimpleTransfer - Money Transfer Platform

A modern web application that facilitates money transfers between users, built with React, TypeScript, and Firebase.

## Features

- 🔐 **Google Authentication**: Secure login using Google accounts
- 💰 **Transfer Requests**: Create and manage money transfer requests
- 🌍 **International Support**: Support for multiple countries and currencies
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌓 **Dark/Light Mode**: User-friendly theme switching
- 🔍 **Search & Filter**: Find transfer requests easily
- 🔒 **Secure**: Built with Firebase Authentication and Firestore

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **UI Library**: Chakra UI
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Routing**: React Router
- **Build Tool**: Vite
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/easy-transfer.git
   cd easy-transfer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/          # React Context providers
├── pages/            # Page components
├── theme/            # Chakra UI theme configuration
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component
```

## Features in Detail

### Authentication
- Google Sign-in integration
- Protected routes
- Persistent authentication state

### Transfer Requests
- Create new transfer requests
- Edit existing requests
- Delete requests
- View all active requests
- Filter by country and amount

### User Interface
- Modern, clean design
- Responsive layout
- Dark/Light mode support
- Loading states and animations
- Error handling and notifications

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file handles client-side routing.

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chakra UI](https://chakra-ui.com/) for the beautiful components
- [Firebase](https://firebase.google.com/) for the backend services
- [React](https://reactjs.org/) for the frontend framework
