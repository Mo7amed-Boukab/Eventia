"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Upload,
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  ChevronDown,
  Save,
  Trash2,
  Info,
  FileText,
  Send,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  XCircle,
  Loader2,
  Users,
} from "lucide-react";
import { eventService } from "@/lib/services/eventService";
import { EventStatus, EventCategory } from "@/lib/types";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { eventSchema } from "@/lib/validations";
import { validateForm } from "@/lib/utils/validateForm";

// Custom Select Component
interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      id={label?.toLowerCase()}
    >
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2.5 bg-white border ${error ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded text-sm font-medium text-gray-700 hover:border-[#C5A059] transition-all focus:outline-none`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {error && (
        <p className="text-[10px] text-red-500 mt-1 font-medium">{error}</p>
      )}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C5A059] transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EditEventForm() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    price: "",
    status: "" as EventStatus,
    maxParticipants: "",
    imagePreview:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const event = await eventService.getById(id as string);

      // Format date for input type="date" (YYYY-MM-DD)
      let formattedDate = "";
      if (event.date) {
        const dateObj = new Date(event.date);
        formattedDate = dateObj.toISOString().split("T")[0];
      }

      setFormData({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "",
        date: formattedDate,
        time: event.time || "",
        location: event.location || "",
        price: event.price?.toString() || "0",
        status: event.status || "DRAFT",
        maxParticipants: event.maxParticipants?.toString() || "0",
        imagePreview:
          event.image ||
          "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
      });
    } catch (err: any) {
      console.error("Error fetching event:", err);
      setGeneralError("Impossible de charger les détails de l'événement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const result = validateForm(eventSchema, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      price: formData.price,
      maxParticipants: formData.maxParticipants,
    });

    if (!result.success) {
      setErrors(result.errors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleUpdateStatus = async (newStatus: EventStatus) => {
    if (newStatus === "CANCELED") {
      setIsConfirmModalOpen(true);
      return;
    }

    executeStatusUpdate(newStatus);
  };

  const executeStatusUpdate = async (newStatus: EventStatus) => {
    if (!validate()) return;

    if (newStatus === EventStatus.CANCELED) setIsCancelling(true);
    else if (
      newStatus === EventStatus.PUBLISHED &&
      formData.status === EventStatus.DRAFT
    )
      setIsPublishing(true);
    else setIsUpdating(true);

    setGeneralError("");

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        price: Number(formData.price),
        status: newStatus,
        maxParticipants: Number(formData.maxParticipants),
      };

      await eventService.update(id as string, updateData);

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/events");
      }, 2000);
    } catch (err: any) {
      console.error("Error updating event:", err);
      setGeneralError(
        err.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour.",
      );
    } finally {
      setIsUpdating(false);
      setIsPublishing(false);
      setIsCancelling(false);
      setIsConfirmModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin mb-4" />
        <p className="text-gray-500 font-medium italic">
          Chargement des données de l'événement...
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "serif" }}
          >
            Événement Mis à jour !
          </h2>
          <p className="text-gray-500">
            Les modifications ont été enregistrées avec succès.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-7xl mx-auto">
      {/* Header with Title and Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1A1A1A] mb-1"
            style={{ fontFamily: "serif" }}
          >
            Modifier l'Événement
          </h1>
          <p className="text-gray-500 text-sm font-light">
            Statut actuel:
            <span
              className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${formData.status === "PUBLISHED"
                ? "bg-green-50 text-green-600"
                : formData.status === "DRAFT"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-red-50 text-red-600"
                }`}
            >
              {formData.status}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botton 1: Retour */}
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold rounded text-gray-500 bg-white border border-gray-200 uppercase tracking-widest hover:bg-gray-50 transition-all hover:text-gray-700"
          >
            <ArrowLeft size={14} /> Retour
          </button>

          {/* Botton 2: Annuler événement */}
          {formData.status !== EventStatus.CANCELED && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(EventStatus.CANCELED)}
              disabled={isUpdating || isCancelling}
              className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold rounded text-red-500 bg-white border border-red-100 uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
            >
              {isCancelling ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <XCircle size={14} />
              )}
              Annuler l'événement
            </button>
          )}

          {/* Button 3: Save as Draft (Only if current status is DRAFT) */}
          {formData.status === EventStatus.DRAFT && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(EventStatus.DRAFT)}
              disabled={isUpdating || isPublishing || isCancelling}
              className="flex items-center gap-2 bg-black/55 rounded text-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-black/60 transition-all hover:shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Save size={14} /> Enregistrer
                </>
              )}
            </button>
          )}

          {/* Button 4: Publier / Enregistrer */}
          <button
            type="button"
            onClick={() =>
              handleUpdateStatus(
                formData.status === EventStatus.DRAFT
                  ? EventStatus.PUBLISHED
                  : formData.status,
              )
            }
            disabled={isUpdating || isPublishing || isCancelling}
            className="flex items-center gap-2 bg-[#C5A059] rounded text-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-[#b08d4a] transition-all hover:shadow-xl shadow-[#C5A059]/20 disabled:opacity-50"
          >
            {formData.status === EventStatus.DRAFT ? (
              isPublishing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Send size={14} /> Publier l'événement
                </>
              )
            ) : isUpdating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Save size={14} /> Enregistrer
              </>
            )}
          </button>
        </div>
      </div>

      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500" />
          <p className="text-red-600 text-sm font-medium italic">
            {generalError}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* General Information */}
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Info size={14} className="text-[#C5A059]" /> Informations Générales
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Titre de l'événement
              </label>
              <input
                type="text"
                name="title"
                required
                className={`w-full px-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.title ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <p className="text-[10px] text-red-500 mt-1 font-medium">
                  {errors.title}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={5}
                className={`w-full px-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.description ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded focus:outline-none focus:border-[#C5A059] transition-colors resize-none`}
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && (
                <p className="text-[10px] text-red-500 mt-1 font-medium">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Date & Location */}
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <CalendarIcon size={14} className="text-[#C5A059]" /> Date & Lieu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Date
              </label>
              <div className="relative">
                <CalendarIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  type="date"
                  name="date"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.date ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                  value={formData.date}
                  onChange={handleInputChange}
                />
                {errors.date && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {errors.date}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Heure
              </label>
              <input
                type="time"
                name="time"
                required
                className={`w-full px-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.time ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                value={formData.time}
                onChange={handleInputChange}
              />
              {errors.time && (
                <p className="text-[10px] text-red-500 mt-1 font-medium">
                  {errors.time}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Localisation
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  type="text"
                  name="location"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.location ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <DollarSign size={14} className="text-[#C5A059]" /> Catégorie & Prix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CustomSelect
              label="Catégorie"
              options={["Formation", "Workshop", "Conférence", "Networking"]}
              value={formData.category}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, category: val }))
              }
              placeholder="Sélectionner une catégorie"
              error={errors.category}
            />

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Prix (MAD)
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  type="number"
                  name="price"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.price ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {errors.price && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {errors.price}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Nombre maximum de places
            </label>
            <div className="relative">
              <Users
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                size={16}
              />
              <input
                type="number"
                name="maxParticipants"
                required
                className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.maxParticipants ? "border-red-500 bg-red-50/10" : "border-gray-200"} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                value={formData.maxParticipants}
                onChange={handleInputChange}
              />
              {errors.maxParticipants && (
                <p className="text-[10px] text-red-500 mt-1 font-medium">
                  {errors.maxParticipants}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => executeStatusUpdate(EventStatus.CANCELED)}
        title="Annuler l'événement"
        message={`Êtes-vous sûr de vouloir annuler l'événement "${formData.title}" ? Cette action est irréversible.`}
        confirmText="Oui, annuler"
        cancelText="Non, garder"
        variant="danger"
        isLoading={isCancelling}
      />
    </form>
  );
}
