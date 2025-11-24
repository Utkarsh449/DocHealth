import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MessageSquare,
  Phone,
  Video,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_type: "",
    appointment_date: "",
    reason: "",
    notes: "",
    specialty: "",
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-created_date"),
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data) => base44.entities.DoctorAppointment.create(data),
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      navigate(createPageUrl("MyAppointments"));
    },
    onError: () => {
      toast.error("Failed to book appointment");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.patient_id ||
      !formData.appointment_type ||
      !formData.appointment_date ||
      !formData.reason
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedPatient = patients.find((p) => p.id === formData.patient_id);

    createAppointmentMutation.mutate({
      patient_id: formData.patient_id,
      patient_name: selectedPatient.full_name,
      appointment_type: formData.appointment_type,
      appointment_date: formData.appointment_date,
      reason: formData.reason,
      notes: formData.notes,
      specialty: formData.specialty || "General Practitioner",
      doctor_name: "To Be Assigned",
      status: "scheduled",
      duration_minutes: 30,
    });
  };

  const appointmentTypes = [
    {
      value: "chat",
      label: "Chat Consultation",
      icon: MessageSquare,
      description: "Text-based consultation",
    },
    {
      value: "call",
      label: "Phone Call",
      icon: Phone,
      description: "Voice call with doctor",
    },
    {
      value: "video",
      label: "Video Call",
      icon: Video,
      description: "Face-to-face video consultation",
    },
    {
      value: "in-person",
      label: "In-Person",
      icon: MapPin,
      description: "Visit clinic in person",
    },
  ];

  const specialties = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedist",
    "Neurologist",
    "Psychiatrist",
    "Gynecologist",
    "ENT Specialist",
    "Ophthalmologist",
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Book Appointment
          </h1>
          <p className="text-gray-600">
            Schedule a consultation with our medical professionals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-lg border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Patient *
                </label>
                <Select
                  value={formData.patient_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, patient_id: value })
                  }
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name} - {patient.age} yrs,{" "}
                        {patient.gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Medical Specialty
                </label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) =>
                    setFormData({ ...formData, specialty: value })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Appointment Type *
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {appointmentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.appointment_type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            appointment_type: type.value,
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 mb-2 ${
                            isSelected ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`font-semibold mb-1 ${
                            isSelected ? "text-blue-900" : "text-gray-700"
                          }`}
                        >
                          {type.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Preferred Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.appointment_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointment_date: e.target.value,
                    })
                  }
                  className="h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Reason for Appointment *
                </label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Please describe your symptoms or reason for consultation..."
                  className="min-h-32 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any additional information for the doctor..."
                  className="min-h-24 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-600" />
                Appointment Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • A doctor will be assigned to your appointment within 24
                  hours
                </li>
                <li>
                  • You'll receive a confirmation email with appointment details
                </li>
                <li>
                  • You can reschedule or cancel from "My Appointments" page
                </li>
                <li>
                  • Please arrive/log in 5 minutes before your scheduled time
                </li>
              </ul>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={createAppointmentMutation.isPending}
            className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white text-lg font-semibold"
          >
            {createAppointmentMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Booking Appointment...
              </>
            ) : (
              <>
                Book Appointment
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
