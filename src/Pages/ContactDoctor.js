import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Phone,
  Video,
  Upload,
  Send,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactDoctor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkId = searchParams.get("checkId");

  const [consultationType, setConsultationType] = useState("");
  const [description, setDescription] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [reportFiles, setReportFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: symptomCheck } = useQuery({
    queryKey: ["symptomCheck", checkId],
    queryFn: async () => {
      if (!checkId) return null;
      const checks = await base44.entities.SymptomCheck.list();
      return checks.find((c) => c.id === checkId);
    },
    enabled: !!checkId,
  });

  const createConsultationMutation = useMutation({
    mutationFn: async (data) => {
      const consultation = await base44.entities.DoctorConsultation.create(
        data
      );

      // Also create an appointment if preferred time is provided
      if (data.preferred_time) {
        await base44.entities.DoctorAppointment.create({
          patient_id: data.patient_id,
          patient_name: data.patient_name,
          appointment_type: data.consultation_type,
          appointment_date: data.preferred_time,
          reason: data.description,
          consultation_id: consultation.id,
          symptom_check_id: data.symptom_check_id,
          doctor_name: "To Be Assigned",
          specialty: "General Practitioner",
          status: "scheduled",
          duration_minutes: 30,
        });
      }

      return consultation;
    },
    onSuccess: () => {
      toast.success(
        "Consultation request and appointment created successfully!"
      );
      navigate(createPageUrl("MyAppointments"));
    },
    onError: () => {
      toast.error("Failed to submit consultation request");
    },
  });

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.file_url);
      setReportFiles([...reportFiles, ...urls]);
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!consultationType) {
      toast.error("Please select a consultation type");
      return;
    }

    if (!symptomCheck) {
      toast.error("Patient information not found");
      return;
    }

    createConsultationMutation.mutate({
      patient_id: symptomCheck.patient_id,
      patient_name: symptomCheck.patient_name,
      symptom_check_id: checkId,
      description,
      report_urls: reportFiles,
      preferred_time: preferredTime,
      consultation_type: consultationType,
    });
  };

  const consultationTypes = [
    {
      value: "chat",
      label: "Chat Consultation",
      icon: MessageSquare,
      color: "blue",
    },
    { value: "call", label: "Phone Call", icon: Phone, color: "green" },
    { value: "video", label: "Video Call", icon: Video, color: "purple" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Request Consultation
          </h1>
          <p className="text-gray-600">
            Connect with a qualified healthcare professional
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-lg border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle>Select Consultation Type</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {consultationTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = consultationType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setConsultationType(type.value)}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-600" />
                      )}
                      <Icon
                        className={`w-8 h-8 mx-auto mb-3 ${
                          isSelected
                            ? `text-${type.color}-600`
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`font-semibold text-center ${
                          isSelected
                            ? `text-${type.color}-900`
                            : "text-gray-700"
                        }`}
                      >
                        {type.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description / Reason for Consultation *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe your concerns and what you'd like to discuss with the doctor..."
                  className="min-h-32 rounded-xl resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Preferred Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="h-12 rounded-xl"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll try to match your preferred time or suggest alternatives
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Medical Reports (Optional)
                </label>
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer transition-colors group">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <span className="text-gray-600 group-hover:text-blue-600">
                    {isUploading
                      ? "Uploading..."
                      : reportFiles.length > 0
                      ? `${reportFiles.length} file(s) uploaded`
                      : "Click to upload reports, lab results, or prescriptions"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files);
                      }
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                What to expect:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    A qualified doctor will review your request within 24 hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    You'll receive a confirmation email with appointment details
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Consultations typically last 15-30 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    You'll receive a consultation summary and recommendations
                    afterward
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={
              createConsultationMutation.isPending ||
              !consultationType ||
              !description
            }
            className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg"
          >
            {createConsultationMutation.isPending ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Consultation Request
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
