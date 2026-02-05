"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Upload,
    Calendar as CalendarIcon,
    MapPin,
    DollarSign,
    ChevronDown,
    Save,
    X,
    Trash2,
    Info,
    CheckCircle2
} from "lucide-react";

// Custom Select Component
interface CustomSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, label }) => {
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
        <div className="relative w-full" ref={containerRef}>
            {label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 hover:border-[#C5A059] transition-all focus:outline-none"
            >
                <span className={value ? "text-gray-900" : "text-gray-400"}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
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

export default function CreateEventPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        location: "",
        price: "",
        status: "Planifié",
        imagePreview: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/events");
            }, 2000);
        }, 1500);
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
        <div className="px-8 py-6 max-w-7xl mx-auto">
            <form onSubmit={handleSubmit}>
                {/* Header with Title and Buttons ALIGNED */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "serif" }}>
                            Nouveau Événement
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Remplissez les détails ci-dessous pour publier un événement.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/events")}
                            className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Save size={14} /> Publier l'événement</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* General Information */}
                    <div className="bg-white p-6 rounded border border-gray-200">
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
                                    className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    placeholder="Décrivez votre événement en détail..."
                                    className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Location */}
                    <div className="bg-white p-6 rounded border border-gray-200">
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
                                        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Heure</label>
                                <input
                                    type="time"
                                    name="time"
                                    required
                                    className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                />
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
                                        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="bg-white p-6 rounded border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <DollarSign size={14} className="text-[#C5A059]" /> Paramètres & Catégorie
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomSelect
                                label="Catégorie"
                                options={["Formation", "Workshop", "Conférence", "Networking"]}
                                value={formData.category}
                                onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                                placeholder="Sélectionner une catégorie"
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
                                        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#C5A059] transition-colors"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <CustomSelect
                                    label="Statut de l'événement"
                                    options={["Planifié", "Confirmé", "Brouillon"]}
                                    value={formData.status}
                                    onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                                    placeholder="Choisir le statut"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="bg-white p-8 rounded border border-gray-200">
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
                                    <label className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#C5A059] hover:bg-gray-50/50 transition-all group/upload bg-gray-50/30">
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
        </div>
    );
}
