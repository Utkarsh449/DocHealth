import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  Home,
  Pill,
  Phone,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const urgencyConfig = {
  Immediate: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
    iconColor: "text-red-600",
  },
  Today: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Clock,
    iconColor: "text-orange-600",
  },
  "Within a Week": {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Calendar,
    iconColor: "text-yellow-600",
  },
  Optional: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
    iconColor: "text-green-600",
  },
};

export default function DiagnosisResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkId = searchParams.get("checkId");

  const { data: symptomCheck, isLoading } = useQuery({
    queryKey: ["symptomCheck", checkId],
    queryFn: async () => {
      const checks = await base44.entities.SymptomCheck.list();
      return checks.find((c) => c.id === checkId);
    },
    enabled: !!checkId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading diagnosis...</p>
        </div>
      </div>
    );
  }

  if (!symptomCheck || !symptomCheck.ai_diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Diagnosis Not Found</h3>
            <Button onClick={() => navigate(createPageUrl("PatientProfiles"))}>
              Back to Patients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const diagnosis = symptomCheck.ai_diagnosis;
  const urgency =
    urgencyConfig[diagnosis.urgency_level] || urgencyConfig["Optional"];
  const UrgencyIcon = urgency.icon;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("PatientProfiles"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Diagnosis Results
          </h1>
          <p className="text-gray-600">
            Analysis for:{" "}
            <span className="font-semibold text-blue-900">
              {symptomCheck.patient_name}
            </span>
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {diagnosis.possible_condition}
                  </CardTitle>
                  <p className="text-blue-100 text-sm">
                    Based on the symptoms you provided
                  </p>
                </div>
                <Badge
                  className={`${urgency.color} border-2 flex items-center gap-2 px-4 py-2`}
                >
                  <UrgencyIcon className={`w-4 h-4 ${urgency.iconColor}`} />
                  {diagnosis.urgency_level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                {diagnosis.description}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-yellow-200">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className={urgency.iconColor} />
                Urgency Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-white rounded-xl p-4 border-2 border-yellow-100">
                <p className="text-gray-700 leading-relaxed">
                  {diagnosis.urgency_reason}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Home className="w-5 h-5 text-green-600" />
                Home Remedies
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {diagnosis.home_remedies?.map((remedy, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-white rounded-lg p-4 border border-green-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{remedy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Pill className="w-5 h-5 text-blue-600" />
                Over-the-Counter Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {diagnosis.otc_medications?.map((medication, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-100"
                  >
                    <Pill className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{medication}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> Consult with a pharmacist or
                  healthcare provider before taking any medications, especially
                  if you have existing conditions or are taking other
                  medications.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Phone className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Need Professional Help?</h3>
                  <p className="text-blue-100">
                    Connect with a qualified doctor
                  </p>
                </div>
              </div>
              <Button
                onClick={() =>
                  navigate(
                    createPageUrl("ContactDoctor") + `?checkId=${checkId}`
                  )
                }
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold h-12"
              >
                <Phone className="w-5 h-5 mr-2" />
                Request Consultation
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-2 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-700">
                  <p className="font-bold mb-2 text-red-900">
                    Emergency Warning
                  </p>
                  <p>
                    This AI-powered analysis is for informational purposes only
                    and does not constitute medical advice. If you experience
                    severe symptoms, difficulty breathing, chest pain, loss of
                    consciousness, or other emergency signs, please call
                    emergency services immediately or visit the nearest
                    emergency room.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
