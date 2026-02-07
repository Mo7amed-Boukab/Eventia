"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    MapPin,
    DollarSign,
    Users,
    ArrowLeft,
    Clock,
    Tag,
    ChevronRight,
    Loader2,
    AlertCircle,
    Info,
    CheckCircle2,
    XCircle,
    Share2,
    Heart,
    Map as MapIcon,
    Wifi,
    Coffee,
    Award,
    ShieldCheck
} from "lucide-react";
import { eventService } from "@/lib/services/eventService";
import { Event, EventStatus } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { reservationService } from "@/lib/services/reservationService";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function PublicEventDetails() {
    const router = useRouter();
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [scrolled, setScrolled] = useState(false);

    // Auth and Reservation State
    const { isAuthenticated, user } = useAuth();
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [userReservation, setUserReservation] = useState<any>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const STATIC_IMAGE = "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 200);
        window.addEventListener("scroll", handleScroll);
        if (id) {
            fetchEvent();
            if (isAuthenticated) {
                checkReservationStatus();
            }
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [id, isAuthenticated]);

    const checkReservationStatus = async () => {
        try {
            const data = await reservationService.getStatus(id as string);
            if (data.isReserved) {
                setUserReservation(data.reservation);
                setBookingSuccess(true);
            }
        } catch (err) {
            console.error("Error checking reservation status:", err);
        }
    };

    const fetchEvent = async () => {
        try {
            setIsLoading(true);
            const data = await eventService.getById(id as string);
            setEvent(data);
        } catch (err: any) {
            console.error("Error fetching event:", err);
            setError("Impossible de charger les détails de l'événement.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            // Encode the current URL to redirect back after login
            const returnUrl = encodeURIComponent(`/events/${id}`);
            router.push(`/login?redirect=${returnUrl}`);
            return;
        }

        try {
            setBookingLoading(true);
            setBookingError("");
            setBookingSuccess(false);

            const result = await reservationService.create({ eventId: id as string });
            setUserReservation(result);
            setBookingSuccess(true);
            fetchEvent(); // Refresh participant count
        } catch (err: any) {
            console.error("Booking failed:", err);
            const errorMessage = err.response?.data?.message || "La réservation a échoué. Veuillez réessayer.";
            setBookingError(errorMessage);
        } finally {
            setBookingLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!userReservation?._id) return;
        setShowCancelModal(true);
    };

    const confirmCancelBooking = async () => {
        try {
            setBookingLoading(true);
            setBookingError("");

            await reservationService.cancel(userReservation._id);
            setUserReservation(null);
            setBookingSuccess(false);
            fetchEvent(); // Refresh participant count
            setShowCancelModal(false);
        } catch (err: any) {
            console.error("Cancellation failed:", err);
            const errorMessage = err.response?.data?.message || "L'annulation a échoué. Veuillez réessayer.";
            setBookingError(errorMessage);
            setShowCancelModal(false);
        } finally {
            setBookingLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-[#C5A059]/10 rounded-full animate-pulse"></div>
                    <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin absolute top-6 left-6" />
                </div>
                <p className="text-gray-400 font-light mt-6 tracking-[0.2em] uppercase text-[10px]">Expérience Premium</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-[#FDFBF7]">
                <AlertCircle size={48} className="text-red-500 mb-4 opacity-20" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "serif" }}>Événement Introuvable</h2>
                <p className="text-gray-500 mb-8 max-w-md font-light">Cet événement n'est pas disponible ou a été déplacé.</p>
                <Link
                    href="/#events"
                    className="flex items-center gap-3 px-8 py-3.5 bg-[#1A1A1A] text-white rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all shadow-xl"
                >
                    <ArrowLeft size={14} /> Retour à l'accueil
                </Link>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            full: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date),
            day: date.getDate(),
            month: new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(date).toUpperCase().replace('.', '')
        };
    };

    const dateInfo = formatDate(event.date);

    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Minimal Header */}
            {/* <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/#events" className="flex items-center gap-2 text-[10px] font-bold text-gray-900 uppercase tracking-widest group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className={scrolled ? 'opacity-100 transition-opacity' : 'opacity-100'}>Retour</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-full hover:bg-white transition-colors text-gray-400 hover:text-[#C5A059]">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2.5 rounded-full hover:bg-white transition-colors text-gray-400 hover:text-red-500">
                            <Heart size={18} />
                        </button>
                    </div>
                </div>
            </header> */}

            {/* Hero Section */}
            <div className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F5F2EB]/50 -z-10 translate-x-1/4 skew-x-12"></div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#C5A059] w-8 h-[1px]"></span>
                                <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.4em]">{event.category}</span>
                            </div>

                            <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1]" style={{ fontFamily: "serif" }}>
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-sm border border-gray-100">
                                        <span className="text-xs font-bold text-[#C5A059] leading-none mb-0.5">{dateInfo.day}</span>
                                        <span className="text-[8px] font-black text-gray-400 leading-none">{dateInfo.month}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Calendrier</p>
                                        <p className="text-sm font-medium text-gray-900">{dateInfo.full}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                        <Clock size={20} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Timing</p>
                                        <p className="text-sm font-medium text-gray-900">{event.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                        <MapPin size={20} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Lieu</p>
                                        <p className="text-sm font-medium text-gray-900">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group animate-in fade-in zoom-in-95 duration-1000">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl relative z-10">
                                <img
                                    src={event.image || STATIC_IMAGE}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0"></div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/10 rounded-full -z-10 blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#C5A059]/5 rounded-full -z-10 blur-3xl"></div>

                            {/* Price Floating Badge */}
                            <div className="absolute -bottom-6 -right-6 lg:bottom-12 lg:-right-12 z-20 bg-[#1A1A1A] text-white p-8 shadow-2xl transform rotate-3">
                                <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-2">Accès Premium</p>
                                <p className="text-4xl font-black">
                                    {event.price === 0 ? "Offert" : `${event.price} MAD`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-7 space-y-20">
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "serif" }}>L'expérience <span className="text-[#C5A059] italic">Eventia</span></h2>
                                <div className="flex-1 h-[1px] bg-gray-100"></div>
                            </div>

                            <div className="prose prose-xl max-w-none">
                                <p className="text-xl text-gray-900 font-medium leading-relaxed mb-10 first-letter:text-5xl first-letter:font-bold first-letter:text-[#C5A059] first-letter:mr-3 first-letter:float-left first-letter:font-serif">
                                    {event.description.split('\n')[0]}
                                </p>
                                <div className="text-gray-500 font-light leading-loose text-justify space-y-6">
                                    {event.description.split('\n').slice(1).map((text, i) => (
                                        text.trim() && <p key={i}>{text}</p>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* What's included (Mocked for professional look) */}
                        <section className="space-y-10">
                            <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.4em]">Services Inclus</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex items-start gap-5 p-6 bg-white border border-gray-50 rounded group hover:border-[#C5A059]/30 transition-all">
                                    <div className="w-12 h-12 bg-[#FDFBF7] rounded flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Award size={24} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 mb-1">Certificat de Présence</p>
                                        <p className="text-xs text-gray-400 font-light italic">Reconnu par nos partenaires académiques.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 p-6 bg-white border border-gray-50 rounded group hover:border-[#C5A059]/30 transition-all">
                                    <div className="w-12 h-12 bg-[#FDFBF7] rounded flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Coffee size={24} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 mb-1">Buffet & Networking</p>
                                        <p className="text-xs text-gray-400 font-light italic">Moments privilégiés d'échanges relaxants.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 p-6 bg-white border border-gray-50 rounded group hover:border-[#C5A059]/30 transition-all">
                                    <div className="w-12 h-12 bg-[#FDFBF7] rounded flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Wifi size={24} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 mb-1">Accès Très Haut Débit</p>
                                        <p className="text-xs text-gray-400 font-light italic">Connectivité garantie durant toute la session.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 p-6 bg-white border border-gray-50 rounded group hover:border-[#C5A059]/30 transition-all">
                                    <div className="w-12 h-12 bg-[#FDFBF7] rounded flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={24} className="text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 mb-1">Accompagnement VIP</p>
                                        <p className="text-xs text-gray-400 font-light italic">Hôtes dédiés pour répondre à vos besoins.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Reservation Card */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-10 pb-10 border-b border-gray-50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Statut des places</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Inscriptions Ouvertes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-[#1A1A1A]">{event.participants || 0}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase ml-1 block">Réservés</span>
                                    </div>
                                </div>

                                <div className="space-y-8 mb-10">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-gray-400">Progression</span>
                                            <span className="text-[#C5A059]">{event.maxParticipants ? Math.round(((event.participants || 0) / event.maxParticipants) * 100) : 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[#C5A059] h-full duration-1000 ease-out transition-all"
                                                style={{ width: `${event.maxParticipants ? ((event.participants || 0) / event.maxParticipants) * 100 : 0}%` }}
                                            />
                                        </div>
                                        {event.maxParticipants && (
                                            <p className="text-[9px] text-gray-400 italic text-center">
                                                Plus que {event.maxParticipants - (event.participants || 0)} opportunités restantes sur cette session.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 bg-[#FDFBF7] p-4 rounded border border-[#C5A059]/10">
                                        <Info size={16} className="text-[#C5A059] flex-shrink-0" />
                                        <p className="text-[10px] text-gray-600 font-light leading-relaxed">
                                            Votre réservation inclut l'accès illimité aux ateliers et la documentation numérique.
                                        </p>
                                    </div>
                                </div>

                                {user?.role === 'ADMIN' ? (
                                    <div className="space-y-4">
                                        <div className="bg-[#F5F2EB] border border-[#C5A059]/20 text-[#1A1A1A] px-6 py-8 rounded-sm relative text-center" role="alert">
                                            <ShieldCheck size={32} className="mx-auto text-[#C5A059] mb-4 opacity-50" />
                                            <strong className="font-bold block text-[10px] uppercase tracking-[0.3em] mb-2 text-[#C5A059]">Accès Administrateur</strong>
                                            <p className="text-[11px] font-light text-gray-500 leading-relaxed mb-6">
                                                En tant qu'administrateur, vous avez un accès complet à la gestion. La réservation directe est réservée aux participants.
                                            </p>
                                            <button
                                                onClick={() => router.push('/admin/dashboard')}
                                                className="w-full bg-[#1A1A1A] text-white py-4 rounded-sm font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-[#C5A059] transition-all shadow-lg active:scale-95"
                                            >
                                                Tableau de bord
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Status Alert - Always show if we have a non-canceled reservation */}
                                        {bookingSuccess && userReservation && (
                                            <div className={`px-4 py-6 rounded-sm border text-center relative ${userReservation?.status === 'REJECTED'
                                                ? "bg-red-50 border-red-100 text-red-800"
                                                : "bg-green-50 border-green-100 text-green-800"
                                                }`} role="alert">
                                                {userReservation?.status === 'REJECTED' ? (
                                                    <>
                                                        <XCircle size={24} className="mx-auto mb-3 text-red-500 opacity-70" />
                                                        <strong className="font-bold block text-sm mb-1 uppercase tracking-wider">Réservation Refusée</strong>
                                                        <p className="text-[11px] font-light leading-relaxed">
                                                            Désolé, votre demande d'inscription a été refusée par l'organisateur.
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 size={24} className="mx-auto mb-3 text-green-500 opacity-70" />
                                                        <strong className="font-bold block text-sm mb-1 uppercase tracking-wider">
                                                            {userReservation?.status === 'CONFIRMED' ? "Place Confirmée" : "Demande Envoyée"}
                                                        </strong>
                                                        <p className="text-[11px] font-light leading-relaxed">
                                                            {userReservation?.status === 'CONFIRMED'
                                                                ? "Félicitations ! Votre présence est officiellement enregistrée."
                                                                : "Votre demande est en attente de confirmation par l'organisateur."}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Error Alert */}
                                        {bookingError && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-center text-xs">
                                                {bookingError}
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        {bookingSuccess && userReservation && userReservation.status !== 'REJECTED' ? (
                                            <button
                                                onClick={handleCancelBooking}
                                                disabled={bookingLoading}
                                                className="w-full bg-white text-gray-400 py-4 rounded-sm font-bold tracking-[0.2em] uppercase text-[10px] hover:text-red-600 hover:bg-red-50 transition-all border border-gray-100 hover:border-red-100 active:scale-95 disabled:opacity-70"
                                            >
                                                {bookingLoading ? (
                                                    <Loader2 className="animate-spin mx-auto" size={16} />
                                                ) : (
                                                    "Annuler ma réservation"
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleBooking}
                                                disabled={bookingLoading}
                                                className="w-full bg-[#1A1A1A] text-white py-5 rounded-sm font-bold tracking-[0.4em] uppercase text-xs hover:bg-[#C5A059] transition-all transform hover:scale-[1.02] shadow-2xl active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {bookingLoading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Loader2 className="animate-spin" size={16} /> Traitement...
                                                    </span>
                                                ) : (
                                                    <>
                                                        {userReservation?.status === 'REJECTED' ? "Réessayer la demande" : "Réserver mon ticket"}
                                                        <ChevronRight size={16} className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <p className="mt-8 text-center text-[9px] text-gray-400 font-medium uppercase tracking-[0.2em] italic">Garanti 100% sécurisé par Eventia</p>
                            </div>

                            {/* Organizer Profile */}
                            <div className="bg-[#1A1A1A] p-10 rounded-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl group-hover:bg-[#C5A059]/20 transition-colors"></div>

                                <h4 className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.4em] mb-8">Maître d'œuvre</h4>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-16 h-16 rounded-sm bg-[#C5A059] flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-[#C5A059]/20">
                                        E
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "serif" }}>Eventia Premium</p>
                                        <p className="text-[10px] text-gray-400 font-light italic">Expertise Événementielle Globale</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/50 font-light flex items-center">
                                    <div className="w-1 h-1 bg-[#C5A059] rounded-full"></div> Plus de 500 sessions organisées avec succès.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Mobile CTA */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-500 lg:hidden ${scrolled ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="bg-[#1A1A1A] p-4 flex items-center justify-between shadow-2xl rounded-sm border border-white/10">
                    <div className="px-2">
                        <p className="text-[8px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-0.5">Tarif d'accès</p>
                        <p className="text-xl font-bold text-white tracking-tight">{event.price === 0 ? "Offert" : `${event.price} MAD`}</p>
                    </div>
                    {user?.role === 'ADMIN' ? (
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="bg-white/10 text-white px-6 py-4 rounded-sm font-bold tracking-[0.2em] uppercase text-[10px] shadow-xl active:scale-95 transition-all border border-white/20"
                        >
                            Dashboard
                        </button>
                    ) : bookingSuccess ? (
                        <button
                            onClick={handleCancelBooking}
                            disabled={bookingLoading}
                            className="bg-red-500 text-white px-6 py-4 rounded-sm font-bold tracking-[0.2em] uppercase text-[10px] shadow-xl active:scale-95 transition-all disabled:opacity-70"
                        >
                            {bookingLoading ? <Loader2 className="animate-spin" size={16} /> : "Annuler"}
                        </button>
                    ) : (
                        <button
                            onClick={handleBooking}
                            disabled={bookingLoading}
                            className="bg-[#C5A059] text-white px-8 py-4 rounded-sm font-bold tracking-[0.2em] uppercase text-[10px] shadow-xl active:scale-95 transition-all disabled:opacity-70"
                        >
                            {bookingLoading ? <Loader2 className="animate-spin" size={16} /> : "Réserver"}
                        </button>
                    )}
                </div>
            </div>

            {/* Footer Placeholder for visual completeness */}
            <footer className="bg-white border-t border-gray-100 py-10 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-1.5 grayscale opacity-30">
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">EVENTIA</span>
                        <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.4em]">Excellence • Passion • Partage</p>
                </div>
            </footer>

            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={confirmCancelBooking}
                title="Annuler la réservation"
                message="Êtes-vous sûr de vouloir annuler votre réservation ? Cette action libérera votre place pour d'autres participants."
                confirmText="Oui, annuler"
                cancelText="Garder ma place"
                variant="premium"
                isLoading={bookingLoading}
            />
        </div>
    );
}
