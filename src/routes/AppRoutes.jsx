import React from "react";
import { Routes, Route } from "react-router-dom";

import Splash from "../pages/Splash";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Training from "../pages/Training";
import WordPractice from "../pages/WordPractice";
import ImagePractice from "../pages/ImagePractice";
import PhrasePractice from "../pages/PhrasePractice";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Splash />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/training"
        element={<Training />}
      />

      <Route
        path="/word-practice"
        element={<WordPractice />}
      />

      <Route
        path="/image-practice"
        element={<ImagePractice />}
      />

      <Route
        path="/phrase-practice"
        element={<PhrasePractice />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

    </Routes>
  );
}

export default AppRoutes;