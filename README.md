# Campus ID Flow - Student ID Card Management System

A comprehensive web application for managing student ID card reissue requests at Sona College of Technology.

## Project Structure

```
campus-id-flow/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── ...
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js/Express backend
│   ├── index.js            # Main server file
│   └── package.json        # Backend dependencies
├── docs/                   # Documentation files
│   ├── TODO.md
│   └── VALIDATION_SYSTEM.md
└── README.md
```

## Features

- **Student Authentication**: Secure login system using register numbers
- **ID Card Request Management**: Submit and track ID card reissue requests
- **Live Tracking**: Real-time status updates for submitted requests
- **Request History**: View previous accepted and rejected requests
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Status Management**: Comprehensive workflow from submission to pickup

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-id-flow
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/login` - Student login with register number

### ID Card Management
- `POST /api/idcards` - Submit new ID card request
- `GET /api/idcards` - Fetch all applications (admin)
- `GET /api/idcards/:registerNumber` - Fetch specific application
- `PATCH /api/idcards/:registerNumber/status` - Update application status

### Status Tracking
- `GET /api/status/:registerNumber` - Get comprehensive status
- `GET /api/printids/:registerNumber` - Check printing status
- `GET /api/acceptedidcards/:registerNumber` - Check accepted status
- `GET /api/rejectedidcards/:registerNumber` - Check rejected status

### History Management
- `GET /api/acchistoryid/user/:registerNumber` - Get accepted history
- `GET /api/rejhistoryids/user/:registerNumber` - Get rejected history
- `POST /api/acceptedidcards/transfer-to-history/:registerNumber` - Transfer to history

## Workflow

1. **Login**: Students log in using their register number
2. **Status Check**: System checks current status across all collections
3. **Form Submission**: Students can submit requests when eligible
4. **Live Tracking**: Real-time updates on request progress
5. **History Management**: Completed requests are moved to history

## Database Collections

- `regnumbers` - Valid register numbers for login
- `idcards` - Active ID card requests
- `printids` - Requests currently being printed
- `acceptedidcards` - Accepted requests ready for pickup
- `rejectedidcards` - Rejected requests
- `acchistoryid` - Historical accepted requests
- `rejhistoryids` - Historical rejected requests

## Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev        # Start with nodemon
npm start          # Start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, contact the development team or create an issue in the repository.