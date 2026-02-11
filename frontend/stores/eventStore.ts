import { create } from 'zustand';
import { eventService } from '@/lib/services/eventService';
import { Event, EventStatus } from '@/lib/types';

interface EventState {
    events: Event[];
    currentEvent: Event | null;
    isLoading: boolean;
    error: string;

    // Actions
    fetchPublishedEvents: () => Promise<void>;
    fetchAllEvents: () => Promise<void>;
    fetchEventById: (id: string) => Promise<void>;
    clearCurrentEvent: () => void;
    reset: () => void;
}

export const useEventStore = create<EventState>()((set, get) => ({
    events: [],
    currentEvent: null,
    isLoading: false,
    error: '',

    fetchPublishedEvents: async () => {
        try {
            set({ isLoading: true, error: '' });
            const allEvents = await eventService.getAll();
            const published = allEvents.filter(
                (e: Event) => e.status === EventStatus.PUBLISHED
            );
            set({ events: published, isLoading: false });
        } catch (err) {
            console.error('Failed to fetch published events:', err);
            set({ error: 'Impossible de charger les événements.', isLoading: false });
        }
    },

    fetchAllEvents: async () => {
        try {
            set({ isLoading: true, error: '' });
            const allEvents = await eventService.getAll();
            set({ events: allEvents, isLoading: false });
        } catch (err) {
            console.error('Failed to fetch events:', err);
            set({ error: 'Impossible de charger les événements.', isLoading: false });
        }
    },

    fetchEventById: async (id: string) => {
        // Check cache first
        const cached = get().events.find((e) => e._id === id);
        if (cached) {
            set({ currentEvent: cached });
            return;
        }

        try {
            set({ isLoading: true, error: '' });
            const event = await eventService.getById(id);
            set({ currentEvent: event, isLoading: false });
        } catch (err) {
            console.error('Failed to fetch event:', err);
            set({ error: 'Impossible de charger l\'événement.', isLoading: false });
        }
    },

    clearCurrentEvent: () => set({ currentEvent: null }),

    reset: () => set({ events: [], currentEvent: null, isLoading: false, error: '' }),
}));
