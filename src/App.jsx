import React from "react";
import Splash from "./pages/Splash";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Training from "./pages/Training";
import WordPractice from "./pages/WordPractice";
import ImagePractice from "./pages/ImagePractice";
import PhrasePractice from "./pages/PhrasePractice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Progress from "./pages/Progress";
import { getStoredAuth } from "./services/api";


function ProtectedRoute({ children }) {

  const auth = getStoredAuth();

  return auth
    ? children
    : <Navigate to="/login" replace />;

}



function PublicRoute({ children }) {

  const auth = getStoredAuth();

  return auth
    ? <Navigate to="/home" replace />
    : children;

}



function HomeRedirect() {

  const auth = getStoredAuth();

  return (
    <Navigate
      to={auth ? "/home" : "/login"}
      replace
    />
  );

}



function App() {

  return (

    <Routes>


      <Route
  path="/"
  element={<Splash />}
/>


      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />


      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />



      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
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
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />



      <Route
        path="/training"
        element={
          <ProtectedRoute>
            <Training />
          </ProtectedRoute>
        }
      />



      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />



      <Route
        path="/word-practice"
        element={
          <ProtectedRoute>
            <WordPractice />
          </ProtectedRoute>
        }
      />



      <Route
        path="/image-practice"
        element={
          <ProtectedRoute>
            <ImagePractice />
          </ProtectedRoute>
        }
      />



      <Route
        path="/phrase-practice"
        element={
          <ProtectedRoute>
            <PhrasePractice />
          </ProtectedRoute>
        }
      />



      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />


    </Routes>

  );

}


export default App;