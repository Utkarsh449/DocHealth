import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Stethoscope,
  Brain,
  Image,
  MessageSquare,
  Video,
  Shield,
} from "lucide-react";

export default function Service() {
  const services = [
    {
      icon: Brain,
      title: "AI Symptom Analysis",
      description:
        "Advanced artificial intelligence analyzes your symptoms and provides comprehensive health insights within minutes.",
      features: [
        "Multi-symptom analysis",
        "Medical history integration",
        "Urgency level assessment",
      ],
    },
    {
      icon: Image,
      title: "Visual Diagnosis",
      description:
        "Upload images of skin conditions, rashes, or other visible symptoms for AI-powered visual analysis.",
      features: [
        "Image recognition",
        "Skin condition analysis",
        "Wound assessment",
      ],
    },
    {
      icon: Stethoscope,
      title: "Doctor Consultations",
      description:
        "Connect with qualified healthcare professionals through chat, phone, or video consultations.",
      features: [
        "Licensed doctors",
        "Flexible scheduling",
        "Multiple consultation types",
      ],
    },
    {
      icon: MessageSquare,
      title: "Audio Symptom Recording",
      description:
        "Describe your symptoms verbally and let our AI transcribe and analyze your audio description.",
      features: [
        "Voice recognition",
        "Natural language processing",
        "Detailed transcription",
      ],
    },
    {
      icon: Video,
      title: "Telemedicine Services",
      description:
        "Full-featured video consultations with doctors from the comfort of your home.",
      features: ["HD video quality", "Screen sharing", "Digital prescriptions"],
    },
    {
      icon: Shield,
      title: "Health Data Management",
      description:
        "Securely manage multiple patient profiles and track health history over time.",
      features: [
        "Multi-patient support",
        "Encrypted storage",
        "Export capabilities",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare solutions powered by cutting-edge AI
            technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all"
              >
                <CardHeader>
                  <div className="bg-gradient-to-br from-blue-100 to-yellow-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-900" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
