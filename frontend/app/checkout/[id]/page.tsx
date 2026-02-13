"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    X,
    CreditCard,
    ShieldCheck,
    Calendar,
    MapPin,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Lock,
    Info,
    ArrowLeft,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { eventService } from "@/lib/services/eventService";
import { reservationService } from "@/lib/services/reservationService";
import { Event } from "@/lib/types";

export default function CheckoutPage() {
    const router = useRouter();
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [error, setError] = useState("");

    const [paymentData, setPaymentData] = useState({
        cardholder: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
    });
    const [paymentErrors, setPaymentErrors] = useState({
        cardholder: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
    });

    const fetchEvent = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await eventService.getById(id as string);
            setEvent(data);
        } catch (err) {
            console.error("Error fetching event:", err);
            setError("Impossible de charger les détails de l'événement.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchEvent();
    }, [id, fetchEvent]);

    const validatePayment = () => {
        const errors = {
            cardholder: "",
            cardNumber: "",
            expiry: "",
            cvc: ""
        };
        let isValid = true;

        if (!paymentData.cardholder.trim()) {
            errors.cardholder = "Le nom du titulaire est requis.";
            isValid = false;
        }

        const cleanCardNumber = paymentData.cardNumber.replace(/\s+/g, '');
        if (!/^\d{16}$/.test(cleanCardNumber)) {
            errors.cardNumber = "Numéro de carte invalide (16 chiffres requis).";
            isValid = false;
        }

        if (!/^\d{2}\s*\/\s*\d{2}$/.test(paymentData.expiry)) {
            errors.expiry = "Format invalide (MM/AA).";
            isValid = false;
        } else {
            const [month, year] = paymentData.expiry.split('/').map(s => parseInt(s.trim()));
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = parseInt(now.getFullYear().toString().slice(-2));

            if (month < 1 || month > 12) {
                errors.expiry = "Mois invalide.";
                isValid = false;
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                errors.expiry = "Date d'expiration dépassée.";
                isValid = false;
            }
        }

        if (!/^\d{3}$/.test(paymentData.cvc)) {
            errors.cvc = "CVC invalide (3 chiffres).";
            isValid = false;
        }

        setPaymentErrors(errors);
        return isValid;
    };

    const handleNextStep = () => {
        if (step === 1) setStep(2);
        else if (step === 2) {
            if (validatePayment()) {
                simulatePayment();
            }
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(' ');
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length > 2) {
            return `${v.substring(0, 2)} / ${v.substring(2, 4)}`;
        }
        return v;
    };

    const simulatePayment = async () => {
        setIsProcessing(true);
        setError(""); // Clear any general error
        // Simulate premium processing
        setTimeout(async () => {
            try {
                // Actual backend call (if simulation is meant to actually reserve)
                await reservationService.create({ eventId: id as string });
                setIsProcessing(false);
                setStep(3);
                // Success redirect after a short delay
                setTimeout(() => {
                    router.push(`/events/${id}`);
                }, 5000);
            } catch (err: any) {
                console.error("Booking failed:", err);
                setError(err.response?.data?.message || "La transaction a échoué.");
                setIsProcessing(false);
                setStep(2);
            }
        }, 3000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
            </div>
        );
    }

    if (!event) return null;

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(event.date));

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Header / Navbar Simulation */}
            <div className="bg-white border-b border-gray-100 py-6 mb-12">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href={`/events/${id}`} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-[#C5A059] transition-colors uppercase tracking-[0.2em]">
                        <ArrowLeft size={16} /> Retour à l&apos;événement
                    </Link>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">EVENTIA</span>
                        <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-1.5"></div>
                    </div>
                    <div className="w-24"></div> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Centralized Progress & Header */}
                <div className="flex flex-col items-center text-center space-y-10 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="max-w-md w-full">
                        <div className="flex items-center justify-between relative px-2">
                            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-100 -translate-y-1/2 -z-10" />
                            {[1, 2, 3].map((s, idx) => (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${step >= s
                                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xl shadow-black/10"
                                            : "bg-white text-gray-300 border-gray-100"
                                            } relative`}
                                    >
                                        {step > s ? <Check size={20} /> : s}
                                    </div>
                                    {idx < 2 && (
                                        <div className={`flex-1 h-[2px] mx-2 ${step > s ? "bg-[#1A1A1A]" : "bg-gray-100"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {step === 1 && (
                            <div key="title1" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight" style={{ fontFamily: "serif" }}>Vérifiez vos informations</h2>
                                <p className="text-gray-400 font-bold text-[10px] tracking-[0.4em] uppercase mt-1">Récapitulatif — Étape 01</p>
                            </div>
                        )}
                        {step === 2 && (
                            <div key="title2" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight" style={{ fontFamily: "serif" }}>Détails de paiement</h2>
                                <p className="text-gray-400 font-bold text-[10px] tracking-[0.4em] uppercase mt-1">Paiement sécurisé — Étape 02</p>
                            </div>
                        )}
                        {step === 3 && (
                            <div key="title3" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight" style={{ fontFamily: "serif" }}>Paiement Réussi</h2>
                                <p className="text-green-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-1">Confirmation — Étape 03</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* Main Flow (Steps) */}
                    <div className="lg:col-span-7 space-y-12">

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white p-6 lg:p-8 rounded-lg space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-[0.2em]">{event.category}</span>
                                                    <h4 className="text-lg font-bold text-gray-900">{event.title}</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                                                        <Calendar size={12} className="text-[#C5A059]" />
                                                        {formattedDate} à {event.time}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                                                        <MapPin size={12} className="text-[#C5A059]" />
                                                        {event.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ticket</p>
                                                <p className="text-xl font-black text-[#1A1A1A]">x 01</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-50 flex items-center gap-3 text-gray-400">
                                            <Info size={14} className="text-[#C5A059]" />
                                            <p className="text-[10px] italic">Votre ticket numérique vous sera envoyé immédiatement après confirmation.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-6 rounded border border-gray-100 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#FDFBF7] rounded flex items-center justify-center">
                                                <ShieldCheck size={20} className="text-[#C5A059]" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest block">Accès VIP</span>
                                                <span className="text-[9px] text-gray-400 uppercase font-medium">Services Inclus</span>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded border border-gray-100 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#FDFBF7] rounded flex items-center justify-center">
                                                <Lock size={20} className="text-[#C5A059]" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest block">Sécurisé</span>
                                                <span className="text-[9px] text-gray-400 uppercase font-medium">Cryptage SSL 256bits</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNextStep}
                                        className="w-full bg-[#1A1A1A] text-white py-4.5 rounded font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-[#C5A059] transition-all transform active:scale-[0.99] shadow-lg group flex items-center justify-center gap-2"
                                    >
                                        Continuer vers le paiement <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-12"
                                >
                                    <div className="bg-white p-6 lg:p-8 rounded space-y-8 border border-gray-50">
                                        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white rounded border border-[#C5A059]/20">
                                                    <CreditCard className="text-[#C5A059]" size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Carte Bancaire</p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Transaction sécurisée</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Nom du titulaire</label>
                                                <input
                                                    type="text"
                                                    className={`w-full border ${paymentErrors.cardholder ? 'border-red-300 bg-red-50/10' : 'border-gray-200'} p-3.5 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all rounded placeholder:text-gray-300 font-medium`}
                                                    placeholder="E.X. MOHAMMED BOUKAB"
                                                    value={paymentData.cardholder}
                                                    onChange={(e) => setPaymentData({ ...paymentData, cardholder: e.target.value.toUpperCase() })}
                                                />
                                                {paymentErrors.cardholder && <p className="text-[10px] text-red-500 font-bold ml-1">{paymentErrors.cardholder}</p>}
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Numéro de Carte</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        maxLength={19}
                                                        className={`w-full border ${paymentErrors.cardNumber ? 'border-red-300 bg-red-50/10' : 'border-gray-200'} p-3.5 pl-10 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all rounded placeholder:text-gray-300 tracking-[0.1em] font-medium`}
                                                        placeholder="0000 0000 0000 0000"
                                                        value={paymentData.cardNumber}
                                                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                                                    />
                                                    <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                                {paymentErrors.cardNumber && <p className="text-[10px] text-red-500 font-bold ml-1">{paymentErrors.cardNumber}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Expiration</label>
                                                <input
                                                    type="text"
                                                    maxLength={7}
                                                    className={`w-full border ${paymentErrors.expiry ? 'border-red-300 bg-red-50/10' : 'border-gray-200'} p-3.5 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all rounded placeholder:text-gray-300 text-center font-medium`}
                                                    placeholder="MM / AA"
                                                    value={paymentData.expiry}
                                                    onChange={(e) => setPaymentData({ ...paymentData, expiry: formatExpiry(e.target.value) })}
                                                />
                                                {paymentErrors.expiry && <p className="text-[10px] text-red-500 font-bold ml-1">{paymentErrors.expiry}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">CVC</label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        maxLength={3}
                                                        className={`w-full border ${paymentErrors.cvc ? 'border-red-300 bg-red-50/10' : 'border-gray-200'} p-3.5 pl-10 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all rounded placeholder:text-gray-300 font-medium`}
                                                        placeholder="123"
                                                        value={paymentData.cvc}
                                                        onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value.replace(/[^0-9]/g, '') })}
                                                    />
                                                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                                {paymentErrors.cvc && <p className="text-[10px] text-red-500 font-bold ml-1">{paymentErrors.cvc}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center rounded">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full md:w-1/3 bg-white border border-gray-200 text-[#1A1A1A] py-4 rounded tracking-[0.2em] uppercase text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Retour
                                        </button>
                                        <button
                                            onClick={handleNextStep}
                                            disabled={isProcessing}
                                            className="w-full md:w-2/3 bg-[#1A1A1A] text-white py-4 rounded font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-[#C5A059] transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="animate-spin" size={14} /> Traitement...
                                                </span>
                                            ) : (
                                                `Payer ${event.price} MAD`
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-12 lg:p-20 rounded border border-gray-100 text-center space-y-12"
                                >
                                    <div className="relative inline-block">
                                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-[#C5A059] animate-bounce">
                                            <Check size={24} className="stroke-[3]" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "serif" }}>Paiement Réussi</h3>
                                        <p className="text-gray-500 font-light leading-relaxed max-w-sm mx-auto text-sm">
                                            Votre place pour <span className="font-bold text-gray-900">{event.title}</span> est confirmée. Vous allez être redirigé vers l&apos;événement...
                                        </p>
                                    </div>
                                    <div className="pt-10 border-t border-gray-50 max-w-sm mx-auto">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Redirection automatique</p>
                                            <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 3 }}
                                                    className="bg-[#C5A059] h-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Order Summary */}
                    <div className="lg:col-span-5 sticky top-32">
                        <div className="bg-white rounded overflow-hidden">
                            <div className="p-8 space-y-16">
                                <h4 className="text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.3em] border-b border-gray-200 pb-8">Sommaire</h4>

                                <div className="space-y-10">
                                    <div className="flex justify-between items-center text-[12px]">
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900 uppercase tracking-widest">Premium Access (x1)</p>
                                            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest leading-none">Entrée Nominale</p>
                                        </div>
                                        <span className="font-medium tracking-widest text-gray-900 text-sm">{event.price} MAD</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[12px]">
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900 uppercase tracking-widest">Services Fees</p>
                                            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest leading-none">Gestion de réservation</p>
                                        </div>
                                        <span className="font-medium text-green-500 tracking-wider">OFFERT</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1A1A1A] p-8 mt-2 relative overflow-hidden">
                                <div className="flex justify-between items-end relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-bold text-[#C5A059] uppercase tracking-widest leading-none mb-2">Total TTC</p>
                                        <p className="text-[10px] text-white/80 font-medium uppercase tracking-[0.1em]">Confirmation Immédiate</p>
                                    </div>
                                    <div className="text-right flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-white tracking-tighter tabular-nums">{event.price}</span>
                                        <span className="text-[12px] font-bold text-[#C5A059] uppercase tracking-wider">MAD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Branding Signature */}
                <div className="mt-40 mb-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center justify-center gap-2 opacity-20">
                        <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">EVENTIA</span>
                        <div className="w-2 h-2 bg-[#C5A059] rounded-full mt-2"></div>
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.5em] opacity-30 px-4">
                        EXCELLENCE • PASSION • PARTAGE
                    </div>
                </div>
            </div >
        </div >
    );
}
