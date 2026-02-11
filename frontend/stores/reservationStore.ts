import { create } from 'zustand';
import { reservationService, Reservation } from '@/lib/services/reservationService';

interface ReservationState {
    // User reservations (my-reservations page)
    myReservations: Reservation[];
    isMyLoading: boolean;
    myError: string;

    // Admin reservations (admin panel)
    allReservations: Reservation[];
    isAdminLoading: boolean;
    adminError: string;

    // Action loading (confirm/reject/cancel)
    actionLoading: string | null;

    // Actions — User
    fetchMyReservations: () => Promise<void>;
    cancelReservation: (id: string) => Promise<void>;
    downloadTicket: (id: string, ticketNum: string) => Promise<void>;

    // Actions — Admin
    fetchAllReservations: () => Promise<void>;
    confirmReservation: (id: string) => Promise<void>;
    rejectReservation: (id: string) => Promise<void>;
    adminCancelReservation: (id: string) => Promise<void>;

    // Actions — Event detail (booking)
    createReservation: (eventId: string) => Promise<Reservation>;
    checkReservationStatus: (eventId: string) => Promise<{ isReserved: boolean; reservation?: any }>;
}

export const useReservationStore = create<ReservationState>()((set, get) => ({
    myReservations: [],
    isMyLoading: false,
    myError: '',

    allReservations: [],
    isAdminLoading: false,
    adminError: '',

    actionLoading: null,

    // ─── User Actions ───────────────────────────────────────

    fetchMyReservations: async () => {
        try {
            set({ isMyLoading: true, myError: '' });
            const data = await reservationService.getMyReservations();
            set({ myReservations: data, isMyLoading: false });
        } catch (err) {
            console.error('Failed to fetch my reservations:', err);
            set({ myError: 'Impossible de charger vos réservations.', isMyLoading: false });
        }
    },

    cancelReservation: async (id: string) => {
        try {
            set({ actionLoading: id });
            await reservationService.cancel(id);

            // Update local state — set status to CANCELED
            set((state) => ({
                myReservations: state.myReservations.map((r) =>
                    r._id === id ? { ...r, status: 'CANCELED' as const } : r
                ),
                allReservations: state.allReservations.map((r) =>
                    r._id === id ? { ...r, status: 'CANCELED' as const } : r
                ),
            }));
        } finally {
            set({ actionLoading: null });
        }
    },

    downloadTicket: async (id: string, ticketNum: string) => {
        set({ actionLoading: id });
        try {
            const blob = await reservationService.downloadTicket(id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Ticket-Eventia-${ticketNum}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } finally {
            set({ actionLoading: null });
        }
    },

    // ─── Admin Actions ──────────────────────────────────────

    fetchAllReservations: async () => {
        try {
            set({ isAdminLoading: true, adminError: '' });
            const data = await reservationService.getAll();
            set({ allReservations: data, isAdminLoading: false });
        } catch (err) {
            console.error('Failed to fetch all reservations:', err);
            set({ adminError: 'Impossible de charger les réservations.', isAdminLoading: false });
        }
    },

    confirmReservation: async (id: string) => {
        try {
            set({ actionLoading: id });
            await reservationService.confirm(id);

            set((state) => ({
                allReservations: state.allReservations.map((r) =>
                    r._id === id ? { ...r, status: 'CONFIRMED' as const } : r
                ),
            }));
        } finally {
            set({ actionLoading: null });
        }
    },

    rejectReservation: async (id: string) => {
        try {
            set({ actionLoading: id });
            await reservationService.reject(id);

            set((state) => ({
                allReservations: state.allReservations.map((r) =>
                    r._id === id ? { ...r, status: 'REJECTED' as const } : r
                ),
            }));
        } finally {
            set({ actionLoading: null });
        }
    },

    adminCancelReservation: async (id: string) => {
        try {
            set({ actionLoading: id });
            await reservationService.cancel(id);

            set((state) => ({
                allReservations: state.allReservations.map((r) =>
                    r._id === id ? { ...r, status: 'CANCELED' as const } : r
                ),
            }));
        } finally {
            set({ actionLoading: null });
        }
    },

    // ─── Event Detail Actions ───────────────────────────────

    createReservation: async (eventId: string) => {
        const result = await reservationService.create({ eventId });
        return result;
    },

    checkReservationStatus: async (eventId: string) => {
        const data = await reservationService.getStatus(eventId);
        return data;
    },
}));
