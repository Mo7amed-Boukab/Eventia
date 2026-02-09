"use client";

import React from "react";

export default function ContactForm() {
    return (
        <div className="bg-white p-8 rounded transition-all">
            <h3
                className="text-xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "serif" }}
            >
                Envoyez-nous un message
            </h3>
            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                            placeholder="Votre nom"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                            placeholder="votre@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Téléphone
                    </label>
                    <input
                        type="tel"
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
                        className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                        placeholder="Sujet de votre message"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Message
                    </label>
                    <textarea
                        rows={4}
                        className="w-full px-4 py-2.5 text-sm placeholder:text-gray-300 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
                        placeholder="Votre message..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#C5A059] text-white px-8 py-3.5 rounded-sm font-bold tracking-[0.2em] hover:bg-[#B08D45] transition-all hover:shadow-xl uppercase text-xs"
                >
                    Envoyer le message
                </button>
            </form>
        </div>
    );
}
