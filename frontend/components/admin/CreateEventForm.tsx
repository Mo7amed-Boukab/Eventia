"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    Users
} from "lucide-react";
import { eventService } from "@/lib/services/eventService";
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

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, label, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef} id={label?.toLowerCase()}>
            {label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-2.5 bg-white border ${error ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded text-sm font-medium text-gray-700 hover:border-[#C5A059] transition-all focus:outline-none`}
            >
                <span className={value ? "text-gray-900" : "text-gray-400"}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {error && <p className="text-[10px] text-red-500 mt-1 font-medium">{error}</p>}
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

export default function CreateEventForm() {
    const router = useRouter();
    const [isDraftLoading, setIsDraftLoading] = useState(false);
    const [isPublishLoading, setIsPublishLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        location: "",
        price: "",
        status: "DRAFT",
        imagePreview: "",
        maxParticipants: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSave = async (e: React.FormEvent, status: "DRAFT" | "PUBLISHED") => {
        e.preventDefault();

        // Validation avec Zod
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
            // Scroll to the first error
            const firstErrorKey = Object.keys(result.errors)[0];
            const element = document.getElementsByName(firstErrorKey)[0] || document.getElementById(firstErrorKey);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setErrors({});
        setGeneralError("");

        if (status === "DRAFT") setIsDraftLoading(true);
        else setIsPublishLoading(true);

        try {
            // Data preparation for backend
            const eventData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: formData.date,
                time: formData.time,
                location: formData.location,
                price: Number(formData.price),
                status: status as 'DRAFT' | 'PUBLISHED' | 'CANCELED',
                maxParticipants: Number(formData.maxParticipants)
                // image: formData.imagePreview // Image handled later 
            };

            console.log("Sending data to backend:", eventData);

            await eventService.create(eventData);

            setIsDraftLoading(false);
            setIsPublishLoading(false);
            setSuccess(true);

            setTimeout(() => {
                router.push("/admin/events");
            }, 2000);
        } catch (err: any) {
            console.error("Error creating event:", err);
            setIsDraftLoading(false);
            setIsPublishLoading(false);

            if (err.response?.data?.message) {
                setGeneralError(err.response.data.message);
            } else {
                setGeneralError("Une erreur est survenue lors de la création de l'événement.");
            }
        }
    };

    if (success) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <div className="text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "serif" }}>Événement Créé !</h2>
                    <p className="text-gray-500">Votre événement a été enregistré avec succès.</p>
                </div>
            </div>
        );
    }

    return (
        <form>
            {/* Header with Title and Buttons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "serif" }}>
                        Nouveau Événement
                    </h1>
                    <p className="text-gray-500 text-sm font-light">
                        Remplissez les détails ci-dessous pour publier un événement.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/events")}
                        className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold rounded text-gray-500 bg-white border border-gray-200 uppercase tracking-widest hover:bg-gray-50 transition-all hover:text-gray-700"
                    >
                        <ArrowLeft size={14} /> Retour
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSave(e, "DRAFT")}
                        disabled={isDraftLoading || isPublishLoading}
                        className="flex items-center gap-2 bg-black/55 rounded text-white px-6 py-3 text-[11px] font-semibold uppercase tracking-widest hover:bg-black/60 hover:cursor-pointer transition-all hover:shadow-xl shadow-black/10 disabled:opacity-50"
                    >
                        {isDraftLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <><FileText size={14} /> Enregistrer en Brouillon</>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSave(e, "PUBLISHED")}
                        disabled={isDraftLoading || isPublishLoading}
                        className="flex items-center gap-2 bg-[#C5A059] rounded text-white px-6 py-3 text-[11px] font-semibold uppercase tracking-widest hover:bg-[#b08d4a] hover:cursor-pointer transition-all hover:shadow-xl shadow-[#C5A059]/20 disabled:opacity-50"
                    >
                        {isPublishLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <><Send size={14} /> Publier l'événement</>
                        )}
                    </button>
                </div>
            </div>

            {generalError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
                    <AlertCircle size={18} className="text-red-500" />
                    <p className="text-red-600 text-sm font-medium italic">{generalError}</p>
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
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Titre de l'événement</label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="Ex: Masterclass Leadership 2026"
                                className={`w-full px-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.title ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                            {errors.title && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={5}
                                placeholder="Décrivez votre événement en détail..."
                                className={`w-full px-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.description ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded focus:outline-none focus:border-[#C5A059] transition-colors resize-none`}
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                            {errors.description && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.description}</p>}
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
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.date ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                                {errors.date && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.date}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Heure</label>
                            <input
                                type="time"
                                name="time"
                                required
                                className={`w-full px-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.time ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                                value={formData.time}
                                onChange={handleInputChange}
                            />
                            {errors.time && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.time}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Localisation</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="Ex: Hotel Sofitel, Casablanca"
                                    className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.location ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                                {errors.location && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.location}</p>}
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
                            onChange={(val) => {
                                setFormData(prev => ({ ...prev, category: val }));
                                if (errors.category) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.category;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder="Sélectionner une catégorie"
                            error={errors.category}
                        />

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Prix (MAD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    placeholder="0.00"
                                    className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.price ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                                {errors.price && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.price}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre maximum de places</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type="number"
                                name="maxParticipants"
                                required
                                placeholder="0"
                                className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border ${errors.maxParticipants ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded focus:outline-none focus:border-[#C5A059] transition-colors`}
                                value={formData.maxParticipants}
                                onChange={handleInputChange}
                            />
                            {errors.maxParticipants && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.maxParticipants}</p>}
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="bg-white p-8 border border-gray-200">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Upload size={14} className="text-[#C5A059]" /> Image de couverture
                    </h3>
                    <div className="w-full">
                        <div className="relative group">
                            {formData.imagePreview ? (
                                <div className="relative aspect-video md:aspect-[21/7] rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imagePreview: "" }))}
                                            className="bg-white text-red-500 p-3 rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-all hover:bg-red-50 mb-3"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                        <p className="text-white text-[11px] font-bold uppercase tracking-widest">Supprimer l'image</p>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-md cursor-pointer hover:border-[#C5A059] hover:bg-gray-50/50 transition-all group/upload bg-gray-50/30">
                                    <div className="bg-white p-5 rounded-full shadow-sm mb-5 group-hover/upload:shadow-md transform group-hover/upload:-translate-y-1 transition-all duration-300">
                                        <Upload size={28} className="text-gray-400 group-hover/upload:text-[#C5A059] transition-colors" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Cliquer pour uploader l'image</p>
                                    <p className="text-[11px] text-gray-400 tracking-wide mb-6">Format recommandé 16:9 • JPG, PNG ou WebP (Max 5Mo)</p>
                                    <div className="px-6 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover/upload:border-[#C5A059] group-hover/upload:text-[#C5A059] transition-all">
                                        Parcourir les fichiers
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
