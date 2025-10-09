import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FloatingShape from "./components/FloatingShape";
import { Navigate, Route, Routes } from "react-router-dom";
import EmailVerification from "./components/EmailVerification";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";
import SearchResult from "./components/SearchResult";
import Nav from "./components/Nav";
import RecipeDetail from "./components/RecipeDetail";
import HomePageLinks from "./components/HomePageLinks";
import SearchLetter from "./components/SearchLetter";
import SavedRecipe from "./components/SavedRecipe";

//protect routes that require authentication

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen bg-gradient-to-br 
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <div className="fixed top-0 left-0">
        <Nav collapsed={collapsed} toggleCollapse={toggleCollapse} />
      </div>
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <div
        className={`relative z-1 transition-all duration-300 flex-1 flex items-center justify-center p-6 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="flex justify-center items-center flex-col gap-8">
                  <Search />
                  <HomePageLinks />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/letter/:letter"
            element={
              <ProtectedRoute>
                <SearchLetter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search/:keyword"
            element={
              <ProtectedRoute>
                <SearchResult /> {/* results page */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/:keyword/:id"
            element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-recipes"
            element={
              <ProtectedRoute>
                <SavedRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <Signup />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <Login />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerification />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
