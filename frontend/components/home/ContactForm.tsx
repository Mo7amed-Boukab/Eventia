"use client";

import React, { useState } from "react";
import { contactSchema } from "@/lib/validations";
import { validateForm } from "@/lib/utils/validateForm";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);

        // Validation avec Zod
        const result = validateForm(contactSchema, formData);
        if (!result.success) {
            setErrors(result.errors);
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (err) {
            setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded transition-all">
            <h3
                className="text-xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "serif" }}
            >
                Envoyez-nous un message
            </h3>

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-600 text-sm font-medium">Message envoyé avec succès !</p>
                </div>
            )}

            {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600 text-sm font-medium">{errors.general}</p>
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border ${errors.name ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors`}
                            placeholder="Votre nom"
                        />
                        {errors.name && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border ${errors.email ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors`}
                            placeholder="votre@email.com"
                        />
                        {errors.email && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.email}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Téléphone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                        placeholder="+212 6 XX XX XX XX"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Sujet
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border ${errors.subject ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors`}
                        placeholder="Sujet de votre message"
                    />
                    {errors.subject && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.subject}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Message
                    </label>
                    <textarea
                        rows={4}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border ${errors.message ? 'border-red-500 bg-red-50/10' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors resize-none`}
                        placeholder="Votre message..."
                    ></textarea>
                    {errors.message && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C5A059] text-white px-8 py-3.5 rounded-sm font-bold tracking-[0.2em] hover:bg-[#B08D45] transition-all hover:shadow-xl uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </button>
            </form>
        </div>
    );
}
