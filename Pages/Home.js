import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  ArrowRight,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (!isAuthenticated) {
        navigate(createPageUrl("Landing"));
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-last_accessed", 2),
  });

  const { data: symptomChecks = [] } = useQuery({
    queryKey: ["recentSymptomChecks"],
    queryFn: () => base44.entities.SymptomCheck.list("-created_date", 2),
  });

  const { data: allSymptomChecks = [] } = useQuery({
    queryKey: ["allSymptomChecks"],
    queryFn: () => base44.entities.SymptomCheck.list(),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["upcomingAppointments"],
    queryFn: async () => {
      const allAppointments = await base44.entities.DoctorAppointment.list(
        "-appointment_date"
      );
      return allAppointments
        .filter((apt) => ["scheduled", "rescheduled"].includes(apt.status))
        .slice(0, 2);
    },
  });

  const { data: allPatients = [] } = useQuery({
    queryKey: ["allPatients"],
    queryFn: () => base44.entities.Patient.list(),
  });

  const totalPatients = allPatients.length;
  const totalChecks = allSymptomChecks.length;
  const upcomingAppointmentsCount = appointments.length;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name || "User"}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your health dashboard overview
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="border-2 border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(createPageUrl("PatientProfiles"))}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalPatients}
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-yellow-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(createPageUrl("SymptomHistory"))}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Symptom Checks</p>
              <p className="text-3xl font-bold text-gray-900">{totalChecks}</p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-green-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(createPageUrl("MyAppointments"))}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">
                Upcoming Appointments
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {upcomingAppointmentsCount}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border-2 border-gray-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Recent Patients
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(createPageUrl("PatientProfiles"))}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {patients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No patients yet</p>
                  <Button
                    onClick={() => navigate(createPageUrl("PatientProfiles"))}
                    className="bg-blue-900 hover:bg-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Patient
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-start justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(createPageUrl("PatientProfiles"))}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {patient.full_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {patient.patient_id}
                          </p>
                          {patient.last_symptom_check && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                              Last check: {patient.last_symptom_check}
                            </p>
                          )}
                          {patient.last_accessed && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3" />
                              Accessed{" "}
                              {formatDistanceToNow(
                                new Date(patient.last_accessed),
                                { addSuffix: true }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {patient.age} yrs
                      </Badge>
                    </div>
                  ))}
                  <Button
                    onClick={() => navigate(createPageUrl("PatientProfiles"))}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Patient
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-gray-100">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-yellow-600" />
                  Recent Checkups
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(createPageUrl("SymptomHistory"))}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {symptomChecks.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No symptom checks yet</p>
                  <Button
                    onClick={() => navigate(createPageUrl("PatientProfiles"))}
                    className="bg-yellow-500 hover:bg-yellow-600 text-blue-900"
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Check Symptoms
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {symptomChecks.map((check) => (
                    <div
                      key={check.id}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {check.patient_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(check.created_date),
                              "MMM d, yyyy h:mm a"
                            )}
                          </p>
                        </div>
                        <Badge
                          className={
                            check.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {check.status}
                        </Badge>
                      </div>
                      {check.symptoms_text && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {check.symptoms_text}
                        </p>
                      )}
                      {check.ai_diagnosis && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-700 font-medium line-clamp-1">
                            {check.ai_diagnosis.possible_condition}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(
                                createPageUrl("DiagnosisResult") +
                                  `?checkId=${check.id}`
                              )
                            }
                            className="text-blue-600"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {appointments.length > 0 && (
          <Card className="shadow-lg border-2 border-green-100 mb-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Upcoming Appointments
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(createPageUrl("MyAppointments"))}
                  className="text-green-600 hover:text-green-700"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(createPageUrl("MyAppointments"))}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {apt.patient_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {apt.doctor_name || "Doctor TBA"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {format(
                            new Date(apt.appointment_date),
                            "MMM d, yyyy h:mm a"
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {apt.appointment_type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Need Medical Assistance?
                </h3>
                <p className="text-blue-100 mb-4">
                  Check symptoms or book an appointment with our doctors
                </p>
              </div>
              <AlertCircle className="w-16 h-16 text-yellow-400 opacity-50" />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(createPageUrl("PatientProfiles"))}
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Check Symptoms
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("BookAppointment"))}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
