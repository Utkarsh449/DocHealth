import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function SymptomHistory() {
  const navigate = useNavigate();

  const { data: symptomChecks = [], isLoading } = useQuery({
    queryKey: ["symptomChecks"],
    queryFn: () => base44.entities.SymptomCheck.list("-created_date"),
  });

  const statusColors = {
    analyzing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Symptom Check History
          </h1>
          <p className="text-gray-600">View all past symptom analyses</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
          </div>
        ) : symptomChecks.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No symptom checks yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by checking symptoms for one of your patients
              </p>
              <Button
                onClick={() => navigate(createPageUrl("PatientProfiles"))}
                className="bg-blue-900 hover:bg-blue-800"
              >
                Go to Patients
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {symptomChecks.map((check) => (
              <Card
                key={check.id}
                className="hover:shadow-lg transition-shadow border-2 border-gray-100"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-900 mb-2">
                        {check.patient_name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {format(
                          new Date(check.created_date),
                          "MMM d, yyyy h:mm a"
                        )}
                      </div>
                    </div>
                    <Badge
                      className={`${
                        statusColors[check.status]
                      } border flex items-center gap-1`}
                    >
                      {check.status === "analyzing" && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {check.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {check.symptoms_text && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Symptoms:
                        </p>
                        <p className="text-gray-600 line-clamp-2">
                          {check.symptoms_text}
                        </p>
                      </div>
                    )}

                    {check.ai_diagnosis && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Diagnosis:
                        </p>
                        <p className="text-gray-600 line-clamp-2">
                          {check.ai_diagnosis.possible_condition}
                        </p>
                      </div>
                    )}

                    {check.status === "completed" && check.ai_diagnosis ? (
                      <Button
                        onClick={() =>
                          navigate(
                            createPageUrl("DiagnosisResult") +
                              `?checkId=${check.id}`
                          )
                        }
                        className="w-full bg-blue-900 hover:bg-blue-800"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Results
                      </Button>
                    ) : (
                      <div className="text-center py-4 bg-yellow-50 rounded-lg">
                        <Loader2 className="w-6 h-6 animate-spin text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-yellow-700">
                          Analysis in progress...
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
