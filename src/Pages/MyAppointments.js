import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  X,
  Edit,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format, isPast, isFuture, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MyAppointments() {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => base44.entities.DoctorAppointment.list("-appointment_date"),
  });

  const rescheduleAppointmentMutation = useMutation({
    mutationFn: ({ id, data }) =>
      base44.entities.DoctorAppointment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Appointment rescheduled successfully!");
      setShowRescheduleDialog(false);
      setSelectedAppointment(null);
      setNewDate("");
    },
    onError: () => {
      toast.error("Failed to reschedule appointment");
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, data }) =>
      base44.entities.DoctorAppointment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Appointment cancelled successfully");
      setShowCancelDialog(false);
      setSelectedAppointment(null);
      setCancellationReason("");
    },
    onError: () => {
      toast.error("Failed to cancel appointment");
    },
  });

  const handleReschedule = () => {
    if (!newDate) {
      toast.error("Please select a new date and time");
      return;
    }

    rescheduleAppointmentMutation.mutate({
      id: selectedAppointment.id,
      data: {
        appointment_date: newDate,
        status: "rescheduled",
      },
    });
  };

  const handleCancel = () => {
    if (!cancellationReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    cancelAppointmentMutation.mutate({
      id: selectedAppointment.id,
      data: {
        status: "cancelled",
        cancellation_reason: cancellationReason,
      },
    });
  };

  const statusConfig = {
    scheduled: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Calendar,
      label: "Scheduled",
    },
    rescheduled: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      label: "Rescheduled",
    },
    completed: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      label: "Completed",
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: X,
      label: "Cancelled",
    },
  };

  const typeIcons = {
    chat: MessageSquare,
    call: Phone,
    video: Video,
    "in-person": MapPin,
  };

  const upcomingAppointments = appointments.filter(
    (apt) =>
      ["scheduled", "rescheduled"].includes(apt.status) &&
      isFuture(parseISO(apt.appointment_date))
  );

  const pastAppointments = appointments.filter(
    (apt) =>
      apt.status === "completed" ||
      apt.status === "cancelled" ||
      isPast(parseISO(apt.appointment_date))
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            Manage your upcoming and past medical appointments
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
          </div>
        ) : appointments.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No appointments yet
              </h3>
              <p className="text-gray-500">
                Your scheduled appointments will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Upcoming Appointments
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {upcomingAppointments.map((appointment) => {
                    const StatusIcon = statusConfig[appointment.status].icon;
                    const TypeIcon = typeIcons[appointment.appointment_type];

                    return (
                      <Card
                        key={appointment.id}
                        className="border-2 border-blue-100 hover:shadow-xl transition-shadow"
                      >
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                          <div className="flex items-start justify-between mb-3">
                            <Badge
                              className={`${
                                statusConfig[appointment.status].color
                              } border flex items-center gap-1`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[appointment.status].label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <TypeIcon className="w-3 h-3" />
                              {appointment.appointment_type}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl text-gray-900">
                            {appointment.doctor_name || "Dr. Assigned Soon"}
                          </CardTitle>
                          {appointment.specialty && (
                            <p className="text-sm text-gray-600">
                              {appointment.specialty}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-center gap-3 text-gray-700">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">
                              Patient: {appointment.patient_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span>
                              {format(
                                parseISO(appointment.appointment_date),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span>
                              {format(
                                parseISO(appointment.appointment_date),
                                "h:mm a"
                              )}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({appointment.duration_minutes || 30} min)
                            </span>
                          </div>

                          {appointment.reason && (
                            <div className="pt-2 border-t">
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Reason:
                              </p>
                              <p className="text-sm text-gray-600">
                                {appointment.reason}
                              </p>
                            </div>
                          )}

                          {appointment.notes && (
                            <div className="pt-2 border-t">
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Notes:
                              </p>
                              <p className="text-sm text-gray-600">
                                {appointment.notes}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setNewDate(appointment.appointment_date);
                                setShowRescheduleDialog(true);
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Reschedule
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowCancelDialog(true);
                              }}
                              variant="outline"
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-gray-600" />
                  Past Appointments
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {pastAppointments.map((appointment) => {
                    const StatusIcon = statusConfig[appointment.status].icon;
                    const TypeIcon = typeIcons[appointment.appointment_type];

                    return (
                      <Card
                        key={appointment.id}
                        className="border-2 border-gray-100 opacity-75"
                      >
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                          <div className="flex items-start justify-between mb-3">
                            <Badge
                              className={`${
                                statusConfig[appointment.status].color
                              } border flex items-center gap-1`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[appointment.status].label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <TypeIcon className="w-3 h-3" />
                              {appointment.appointment_type}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg text-gray-900">
                            {appointment.doctor_name || "Dr. Assigned Soon"}
                          </CardTitle>
                          {appointment.specialty && (
                            <p className="text-sm text-gray-600">
                              {appointment.specialty}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                          <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <User className="w-4 h-4" />
                            <span>{appointment.patient_name}</span>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(
                                parseISO(appointment.appointment_date),
                                "MMM d, yyyy h:mm a"
                              )}
                            </span>
                          </div>

                          {appointment.cancellation_reason && (
                            <div className="pt-2 border-t">
                              <p className="text-xs font-semibold text-red-700 mb-1">
                                Cancellation Reason:
                              </p>
                              <p className="text-xs text-gray-600">
                                {appointment.cancellation_reason}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reschedule Dialog */}
        <Dialog
          open={showRescheduleDialog}
          onOpenChange={setShowRescheduleDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Appointment</DialogTitle>
              <DialogDescription>
                Select a new date and time for your appointment
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Date & Time
              </label>
              <Input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRescheduleDialog(false);
                  setSelectedAppointment(null);
                  setNewDate("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                disabled={rescheduleAppointmentMutation.isPending}
                className="bg-blue-900 hover:bg-blue-800"
              >
                {rescheduleAppointmentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rescheduling...
                  </>
                ) : (
                  "Confirm Reschedule"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription>
                Please provide a reason for cancelling this appointment
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please explain why you need to cancel..."
                className="w-full min-h-24"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelDialog(false);
                  setSelectedAppointment(null);
                  setCancellationReason("");
                }}
              >
                Keep Appointment
              </Button>
              <Button
                onClick={handleCancel}
                disabled={cancelAppointmentMutation.isPending}
                variant="destructive"
              >
                {cancelAppointmentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
