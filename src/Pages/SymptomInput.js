import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Keyboard,
  Mic,
  Image as ImageIcon,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SymptomInput() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [symptomsText, setSymptomsText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const patients = await base44.entities.Patient.list();
      return patients.find((p) => p.id === patientId);
    },
    enabled: !!patientId,
  });

  const handleFileUpload = async (file, type) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (type === "audio") {
        setAudioFile(file_url);
        toast.success("Audio uploaded successfully");
      } else if (type === "image") {
        setImageFile(file_url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleSubmit = async () => {
    if (!symptomsText && !audioFile && !imageFile) {
      toast.error("Please provide symptoms in at least one format");
      return;
    }

    if (!patient) {
      toast.error("Patient not found");
      return;
    }

    setIsProcessing(true);

    try {
      // Create symptom check record
      const symptomCheck = await base44.entities.SymptomCheck.create({
        patient_id: patient.id,
        patient_name: patient.full_name,
        symptoms_text: symptomsText,
        audio_url: audioFile,
        image_url: imageFile,
        status: "analyzing",
      });

      // Build context for AI
      let aiPrompt = `You are a medical AI assistant. Analyze the following patient information and symptoms:

Patient Information:
- Name: ${patient.full_name}
- Age: ${patient.age} years
- Gender: ${patient.gender}
- Medical History: ${patient.medical_history || "None provided"}

Symptoms Provided:
${symptomsText ? `Text Description: ${symptomsText}` : ""}
${audioFile ? "Audio description was provided (transcribe if needed)" : ""}
${imageFile ? "Visual symptom image was provided (describe what you see)" : ""}

Provide a comprehensive medical analysis including possible conditions, home remedies, OTC medications, and urgency level.`;

      const fileUrls = [];
      if (audioFile) fileUrls.push(audioFile);
      if (imageFile) fileUrls.push(imageFile);

      // Get AI diagnosis
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: aiPrompt,
        file_urls: fileUrls.length > 0 ? fileUrls : undefined,
        response_json_schema: {
          type: "object",
          properties: {
            possible_condition: { type: "string" },
            description: { type: "string" },
            home_remedies: {
              type: "array",
              items: { type: "string" },
            },
            otc_medications: {
              type: "array",
              items: { type: "string" },
            },
            urgency_level: {
              type: "string",
              enum: ["Immediate", "Today", "Within a Week", "Optional"],
            },
            urgency_reason: { type: "string" },
          },
        },
      });

      // Update symptom check with diagnosis
      await base44.entities.SymptomCheck.update(symptomCheck.id, {
        ai_diagnosis: aiResponse,
        status: "completed",
      });

      // Update patient's last symptom check
      await base44.entities.Patient.update(patient.id, {
        last_symptom_check: symptomsText.substring(0, 100),
        last_accessed: new Date().toISOString(),
      });

      toast.success("Analysis complete!");
      navigate(
        createPageUrl("DiagnosisResult") + `?checkId=${symptomCheck.id}`
      );
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error(
        "Failed to analyze symptoms: " + (error.message || "Unknown error")
      );
      setIsProcessing(false);
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Patient Not Found</h3>
            <p className="text-gray-600 mb-4">
              Please select a patient profile first
            </p>
            <Button onClick={() => navigate(createPageUrl("PatientProfiles"))}>
              Go to Patient Profiles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Symptom Analysis
          </h1>
          <p className="text-gray-600">
            For patient:{" "}
            <span className="font-semibold text-blue-900">
              {patient.full_name}
            </span>
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                Describe Your Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                placeholder="Please describe your symptoms in detail. Include when they started, severity, and any other relevant information..."
                className="min-h-40 rounded-xl resize-none text-base"
              />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-colors">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-white">
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-yellow-600" />
                  Record Audio
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-yellow-500 cursor-pointer transition-colors group">
                  <Upload className="w-10 h-10 text-gray-400 group-hover:text-yellow-600 mb-2" />
                  <span className="text-gray-600 group-hover:text-yellow-600">
                    {audioFile ? "Audio uploaded ✓" : "Upload audio file"}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "audio");
                      }
                    }}
                  />
                </label>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-colors">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer transition-colors group">
                  <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <span className="text-gray-600 group-hover:text-blue-600">
                    {imageFile ? "Image uploaded ✓" : "Upload symptom image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "image");
                      }
                    }}
                  />
                </label>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-yellow-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-700 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Medical Disclaimer</p>
                  <p>
                    This AI analysis is for informational purposes only and
                    should not replace professional medical advice. For serious
                    symptoms or emergencies, please seek immediate medical
                    attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={
              isProcessing || (!symptomsText && !audioFile && !imageFile)
            }
            className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              "Analyze Symptoms"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
