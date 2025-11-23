import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  User,
  Calendar,
  Ruler,
  Weight,
  FileText,
  Stethoscope,
  X,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function PatientProfiles() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    medical_history: "",
    phone: "",
    email: "",
  });

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-last_accessed"),
  });

  useEffect(() => {
    const initialData = localStorage.getItem("initialPatientData");
    if (initialData) {
      const data = JSON.parse(initialData);
      setFormData((prev) => ({
        ...prev,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        medical_history: data.message,
      }));
      setShowForm(true);
      localStorage.removeItem("initialPatientData");
    }
  }, []);

  const createPatientMutation = useMutation({
    mutationFn: async (data) => {
      const patientId = `P${Date.now().toString().slice(-8)}`;
      return base44.entities.Patient.create({
        ...data,
        patient_id: patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      toast.success("Patient profile created successfully!");
      setShowForm(false);
      setFormData({
        full_name: "",
        age: "",
        gender: "",
        height_cm: "",
        weight_kg: "",
        medical_history: "",
        phone: "",
        email: "",
      });
    },
    onError: () => {
      toast.error("Failed to create patient profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPatientMutation.mutate({
      ...formData,
      age: parseFloat(formData.age),
      height_cm: parseFloat(formData.height_cm),
      weight_kg: parseFloat(formData.weight_kg),
    });
  };

  const handleCheckSymptoms = async (patient) => {
    // Update last accessed time
    await base44.entities.Patient.update(patient.id, {
      last_accessed: new Date().toISOString(),
    });
    queryClient.invalidateQueries(["patients"]);
    navigate(createPageUrl("SymptomInput") + `?patientId=${patient.id}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Patient Profiles
              </h1>
              <p className="text-gray-600">
                Manage multiple patient profiles for your family
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold flex items-center gap-2 h-12 px-8 shadow-lg"
          >
            {showForm ? (
              <X className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {showForm ? "Cancel" : "Add New Patient"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 shadow-lg border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50">
              <CardTitle className="text-2xl text-blue-900">
                Create New Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="Enter full name"
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Age *
                    </label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      placeholder="Enter age"
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Gender *
                    </label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                      required
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Height (cm)
                    </label>
                    <Input
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) =>
                        setFormData({ ...formData, height_cm: e.target.value })
                      }
                      placeholder="Height in cm"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) =>
                        setFormData({ ...formData, weight_kg: e.target.value })
                      }
                      placeholder="Weight in kg"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 234 567 8900"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Medical History
                  </label>
                  <Textarea
                    value={formData.medical_history}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical_history: e.target.value,
                      })
                    }
                    placeholder="Previous conditions, allergies, current medications..."
                    className="min-h-32 rounded-xl resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createPatientMutation.isPending}
                  className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold rounded-xl"
                >
                  {createPatientMutation.isPending
                    ? "Creating..."
                    : "Create Patient Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No patient profiles yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first patient profile to start using DocHealth
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-900 hover:bg-blue-800"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Patient
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Card
                key={patient.id}
                className="hover:shadow-xl transition-shadow border-2 border-gray-100 hover:border-blue-200"
              >
                <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-900 p-3 rounded-full">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">
                          {patient.full_name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          ID: {patient.patient_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      {patient.age} years old • {patient.gender}
                    </span>
                  </div>
                  {patient.height_cm && patient.weight_kg && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Ruler className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        {patient.height_cm}cm • {patient.weight_kg}kg
                      </span>
                    </div>
                  )}
                  {patient.medical_history && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm line-clamp-2">
                        {patient.medical_history}
                      </span>
                    </div>
                  )}
                  {patient.last_accessed && (
                    <div className="flex items-center gap-2 text-gray-600 text-xs pt-2 border-t">
                      <Clock className="w-3 h-3" />
                      <span>
                        Last accessed:{" "}
                        {formatDistanceToNow(new Date(patient.last_accessed), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  )}
                  {patient.last_symptom_check && (
                    <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg">
                      <span className="font-semibold">Last symptom:</span>{" "}
                      {patient.last_symptom_check}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      onClick={() => handleCheckSymptoms(patient)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold"
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Symptoms
                    </Button>
                    <Button
                      onClick={() => navigate(createPageUrl("BookAppointment"))}
                      variant="outline"
                      className="border-blue-900 text-blue-900 hover:bg-blue-50"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book
                    </Button>
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
