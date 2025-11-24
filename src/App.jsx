import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";

// Pages
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Blog from "./Pages/Blog";
import Service from "./Pages/Service";
import ContactDoctor from "./Pages/ContactDoctor";
import PatientProfiles from "./Pages/PatientProfiles";
import BookAppointment from "./Pages/BookAppointment";
import MyAppointments from "./Pages/MyAppointments";
import SymptomHistory from "./Pages/SymptomHistory";
import SymptomInput from "./Pages/SymptomInput"; // MAKE SURE name is fixed
import DiagnosisResult from "./Pages/DiagnosisResult";

// Utility
import { createPageUrl } from "./utils";

// --- Auth Wrapper ---
import { base44 } from "./api/base44Client";

// Protect routes that require login
function PrivateRoute({ children }) {
  const token = localStorage.getItem("base44_token");
  if (!token) return <Navigate to={createPageUrl("Login")} />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/Landing" element={<Landing />} />
      <Route path="/Login" element={<Login />} />

      {/* Protected Routes wrapped in Layout */}
      <Route
        path="/Home"
        element={
          <PrivateRoute>
            <Layout currentPageName="Home">
              <Home />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/About"
        element={
          <PrivateRoute>
            <Layout currentPageName="About">
              <About />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Blog"
        element={
          <PrivateRoute>
            <Layout currentPageName="Blog">
              <Blog />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Service"
        element={
          <PrivateRoute>
            <Layout currentPageName="Service">
              <Service />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/ContactDoctor"
        element={
          <PrivateRoute>
            <Layout currentPageName="ContactDoctor">
              <ContactDoctor />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/PatientProfiles"
        element={
          <PrivateRoute>
            <Layout currentPageName="PatientProfiles">
              <PatientProfiles />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/BookAppointment"
        element={
          <PrivateRoute>
            <Layout currentPageName="BookAppointment">
              <BookAppointment />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/MyAppointments"
        element={
          <PrivateRoute>
            <Layout currentPageName="MyAppointments">
              <MyAppointments />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/SymptomInput"
        element={
          <PrivateRoute>
            <Layout currentPageName="SymptomInput">
              <SymptomInput />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/SymptomHistory"
        element={
          <PrivateRoute>
            <Layout currentPageName="SymptomHistory">
              <SymptomHistory />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/DiagnosisResult"
        element={
          <PrivateRoute>
            <Layout currentPageName="DiagnosisResult">
              <DiagnosisResult />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/Home" />} />
    </Routes>
  );
}
