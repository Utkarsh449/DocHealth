import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import {
  Heart,
  Home,
  Info,
  Stethoscope,
  Users,
  BookOpen,
  LogOut,
  Calendar as CalendarIcon,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children, currentPageName }) {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  const navItems = [
    { name: "Home", path: "Home", icon: Home },
    { name: "Patients", path: "PatientProfiles", icon: Users },
    { name: "Appointments", path: "MyAppointments", icon: CalendarIcon },
    { name: "History", path: "SymptomHistory", icon: BookOpen },
    { name: "About", path: "About", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-2"
            >
              <Heart className="w-7 h-7 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-blue-900">
                Doc<span className="text-yellow-500">Health</span>™
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-900 text-white"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 ml-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              {user && (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-700 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-blue-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-xl font-bold">
              Doc<span className="text-yellow-500">Health</span>™
            </span>
          </div>
          <p className="text-blue-200">
            Smart AI-powered medical symptom analysis
          </p>
          <p className="text-blue-300 text-sm mt-2">
            © 2024 DocHealth. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
