import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, ArrowRight, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";

export default function Landing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (isAuthenticated) {
        navigate(createPageUrl("Home"));
      }
    };
    checkAuth();
  }, [navigate]);

  const handleStartSurvey = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem("initialPatientData", JSON.stringify(formData));
      toast.info("Please log in to continue");
      base44.auth.redirectToLogin(createPageUrl("Home"));
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-blue-900">
                Doc<span className="text-yellow-500">Health</span>™
              </span>
            </div>

            <Button
              onClick={() => base44.auth.redirectToLogin(createPageUrl("Home"))}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 opacity-95"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-block">
                <span className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-400/30">
                  GET IN TOUCH
                </span>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                  Check your <br />
                  Symptoms
                </h1>
                <div className="flex items-center gap-3 text-4xl md:text-5xl font-bold">
                  <span className="text-gray-300 italic font-light">with</span>
                  <span className="text-yellow-400">DocHealth™</span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="flex items-center gap-4 group">
                  <div className="bg-yellow-500 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-blue-900" />
                  </div>
                  <span className="text-lg">+123-456-7890</span>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="bg-yellow-500 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-blue-900" />
                  </div>
                  <span className="text-lg">hello@dochealth.com</span>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="bg-yellow-500 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-blue-900" />
                  </div>
                  <span className="text-lg">
                    123 Healthcare St., Medical City, 12345
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
              <form onSubmit={handleStartSurvey} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Patient's Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="h-12 rounded-xl border-gray-200 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 234 567 8900"
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Message on Premedical Condition
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Brief description of any existing medical conditions..."
                    className="min-h-32 rounded-xl border-gray-200 focus:border-blue-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      START SURVEY
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 font-medium">
              AI-Powered Healthcare
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How DocHealth Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get instant, intelligent symptom analysis and personalized health
            recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Share Your Symptoms",
              description:
                "Type, record audio, or upload images of your symptoms",
              color: "blue",
            },
            {
              step: "02",
              title: "AI Analysis",
              description: "Our AI analyzes your symptoms and medical history",
              color: "yellow",
            },
            {
              step: "03",
              title: "Get Recommendations",
              description:
                "Receive home remedies, medications, and urgency guidance",
              color: "blue",
            },
            {
              step: "04",
              title: "Book Appointment",
              description: "Schedule consultations with qualified doctors",
              color: "yellow",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r ${
                  item.color === "yellow"
                    ? "from-yellow-400 to-yellow-600"
                    : "from-blue-600 to-blue-800"
                }`}
              ></div>
              <div
                className={`text-6xl font-bold mb-4 ${
                  item.color === "yellow" ? "text-yellow-500" : "text-blue-900"
                } opacity-20`}
              >
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

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
