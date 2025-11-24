import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            About DocHealth™
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing healthcare with AI-powered symptom analysis and
            personalized medical guidance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: Heart,
              title: "Our Mission",
              description:
                "Making quality healthcare accessible to everyone through intelligent technology and compassionate care.",
              color: "blue",
            },
            {
              icon: Users,
              title: "Patient-Centered",
              description:
                "We put patients first, providing personalized insights and connecting them with qualified professionals.",
              color: "yellow",
            },
            {
              icon: Award,
              title: "Medical Excellence",
              description:
                "Our AI is trained on extensive medical data and constantly updated with the latest healthcare knowledge.",
              color: "blue",
            },
            {
              icon: Shield,
              title: "Privacy & Security",
              description:
                "Your health data is protected with enterprise-grade security and strict privacy protocols.",
              color: "yellow",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-6">
                  <div
                    className={`inline-flex p-4 rounded-2xl mb-4 ${
                      item.color === "yellow" ? "bg-yellow-100" : "bg-blue-100"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        item.color === "yellow"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Thousands of Satisfied Users
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Experience the future of healthcare with DocHealth's intelligent
            symptom analysis and personalized medical recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
