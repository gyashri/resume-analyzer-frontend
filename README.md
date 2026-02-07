# AI Resume Analyzer - Frontend

Modern React frontend for the AI Resume Analyzer application. Upload resumes, get AI-powered analysis, and receive actionable improvement tips.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT
- **Resume Upload**: Drag-and-drop PDF/DOCX upload with validation
- **AI Analysis**: Real-time resume analysis powered by Google Gemini AI
- **Match Scoring**: 0-100% compatibility score with visual indicators
- **Keyword Extraction**: Identifies found and missing skills
- **Actionable Tips**: Prioritized improvement suggestions
- **Resume History**: View and manage all past analyses
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - Global state management
- **CSS3** - Custom styling with animations

## 📋 Prerequisites

Before running the frontend, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## 🏃‍♂️ Quick Start

### 1. Install Dependencies

```bash
cd resume-analyzer-frontend
npm install
```

### 2. Configure Environment

The `.env` file is already configured with:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

If your backend runs on a different port, update this value.

### 3. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
resume-analyzer-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Login.js         # Login form
│   │   ├── Register.js      # Registration form
│   │   ├── Dashboard.js     # Main dashboard
│   │   ├── FileUpload.js    # File upload component
│   │   ├── ResumeResults.js # Analysis results display
│   │   ├── ResumeHistory.js # Resume history list
│   │   ├── ProtectedRoute.js# Route protection
│   │   └── *.css            # Component styles
│   ├── context/
│   │   └── AuthContext.js   # Authentication context
│   ├── services/
│   │   └── api.js           # Axios configuration
│   ├── App.js               # Main app with routing
│   ├── App.css              # Global styles
│   └── index.js             # React entry point
├── public/
├── .env                     # Environment variables
├── package.json
└── README.md
```

## 🎨 Key Components

### Authentication Context

Manages user authentication state globally:

```javascript
const { user, loading, login, register, logout, isAuthenticated } = useAuth();
```

### Protected Routes

Automatically redirects unauthenticated users to login:

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### API Service

Centralized API calls with automatic cookie handling:

```javascript
import { authAPI, resumeAPI } from '../services/api';

// Authentication
await authAPI.register(userData);
await authAPI.login(credentials);

// Resume operations
await resumeAPI.upload(formData);
await resumeAPI.getMyResumes();
```

## 🔐 Authentication Flow

1. **Register**: User creates account → Receives JWT in HTTP-only cookie
2. **Login**: User signs in → JWT stored in cookie
3. **Protected Access**: Cookie automatically sent with each request
4. **Logout**: Cookie cleared → User redirected to login

## 📊 Usage Guide

### Uploading a Resume

1. Navigate to **Dashboard** after login
2. Click **New Analysis** tab
3. Drag & drop or click to select PDF/DOCX file (max 5MB)
4. Optionally add job description for tailored analysis
5. Click **Analyze Resume**
6. Wait for AI analysis (typically 3-5 seconds)

### Viewing Results

The analysis shows:
- **Match Score**: Overall compatibility (0-100%)
- **Found Skills**: Technical & soft skills present in resume
- **Missing Skills**: Skills recommended for the role
- **Improvement Tips**: Prioritized suggestions (High/Medium/Low)
- **AI Summary**: Overall assessment

### Managing History

1. Click **History** tab to view all analyzed resumes
2. Each card shows:
   - File name and upload date
   - Match score with color coding
   - Quick stats (found/missing skills, tips)
3. **View Details**: See full analysis again
4. **Delete**: Remove resume from history

## 🎨 Styling Highlights

- **Gradient Theme**: Purple-blue gradient for primary actions
- **Color Coding**:
  - Green: Excellent scores (80%+), found skills
  - Orange: Good scores (60-79%), warnings
  - Red: Needs improvement (<60%), missing skills
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 🔧 Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`

Builds the app for production to the `build` folder. Optimized for best performance.

### `npm test`

Launches the test runner in interactive watch mode.

## 🌐 API Integration

The frontend communicates with the backend API:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Get current user |
| `/api/resumes/upload` | POST | Upload & analyze resume |
| `/api/resumes/my-resumes` | GET | Get user's resumes |
| `/api/resumes/:id` | GET | Get specific resume |
| `/api/resumes/:id` | DELETE | Delete resume |

## 🐛 Troubleshooting

### "Network Error" or "CORS Error"

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Ensure backend is running on `http://localhost:5000`
2. Check backend CORS configuration allows `http://localhost:3000`
3. Verify `.env` has correct `REACT_APP_API_URL`

### "401 Unauthorized" on Protected Routes

**Problem**: Authentication not working

**Solutions**:
1. Check cookies are enabled in browser
2. Verify `withCredentials: true` in `services/api.js`
3. Ensure backend sets cookies correctly

### Upload Fails with "File Too Large"

**Problem**: File exceeds size limit

**Solution**:
- Frontend limit: 5MB
- Backend limit: 5MB (check backend `upload.js` middleware)
- Compress PDF or convert to a lighter format

### Analysis Takes Too Long

**Problem**: AI analysis seems stuck

**Solutions**:
1. Check backend console for errors
2. Verify Gemini API key is valid
3. Check API quota (1500/day on free tier)
4. Test with smaller resume file

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Environment Variables for Production

Update `.env` or create `.env.production`:

```bash
REACT_APP_API_URL=https://your-production-backend.com/api
```

### Hosting Options

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Connect GitHub repo or drag & drop `build/` folder
- **GitHub Pages**: See [deployment docs](https://create-react-app.dev/docs/deployment/#github-pages)

## 🔒 Security Features

- **HTTP-only Cookies**: Prevents XSS attacks
- **CSRF Protection**: Cookies sent with `withCredentials`
- **Input Validation**: File type and size checks
- **Protected Routes**: Automatic authentication checks
- **Error Handling**: User-friendly error messages

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above (full layout)
- **Tablet**: 768px - 1023px (adjusted grid)
- **Mobile**: Below 768px (single column)

## 🎯 Future Enhancements

Potential features for future versions:

- **Resume Templates**: Generate optimized resume formats
- **Keyword Highlighting**: Visual markup of important keywords
- **Export Reports**: Download analysis as PDF
- **Comparison Mode**: Compare multiple resumes side-by-side
- **Integration with LinkedIn**: Import profile data
- **Real-time Collaboration**: Share resumes with mentors

## 📝 Development Tips

### Adding New Components

1. Create component in `src/components/`
2. Create corresponding CSS file
3. Import and use in App.js or parent component

### Styling Guidelines

- Use existing color palette for consistency
- Follow mobile-first approach
- Add hover states for interactive elements
- Test responsiveness at various breakpoints

### State Management

- Use Context API for global state (auth, user data)
- Use local state for component-specific data
- Lift state up when shared between siblings

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the AI Resume Analyzer application.

## 🆘 Support

If you encounter issues:

1. Check this README for troubleshooting steps
2. Review browser console for errors
3. Check backend logs for API issues
4. Ensure all dependencies are installed

---

**Happy coding! 🚀** Built with ❤️ using React and Google Gemini AI
