import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import Bookmarks from './pages/Bookmarks';
import MockInterviewSetup from './pages/MockInterviewSetup';
import MockInterviewSession from './pages/MockInterviewSession';
import SessionSummary from './pages/SessionSummary';
import SessionHistory from './pages/SessionHistory';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminQuestions from './pages/AdminQuestions';
import AdminCategories from './pages/AdminCategories';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/questions" element={<QuestionBank />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />

              {/* Protected User Routes */}
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <Bookmarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mock-interview"
                element={
                  <ProtectedRoute>
                    <MockInterviewSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mock-interview/:sessionId"
                element={
                  <ProtectedRoute>
                    <MockInterviewSession />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sessions/:sessionId"
                element={
                  <ProtectedRoute>
                    <SessionSummary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sessions"
                element={
                  <ProtectedRoute>
                    <SessionHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Routes */}
              <Route
                path="/admin/questions"
                element={
                  <AdminRoute>
                    <AdminQuestions />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <AdminCategories />
                  </AdminRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
