import apiClient from '../api-client';

export interface CreateEventData {
    title: string;
    description: string;
    category: string;
    date: string;
    time: string;
    location: string;
    price: number;
    status: 'DRAFT' | 'PUBLISHED' | 'CANCELED';
    image?: string;
    maxParticipants?: number;
}

export const eventService = {
    getAll: async () => {
        const response = await apiClient.get('/events');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
    },

    create: async (data: CreateEventData) => {
        const response = await apiClient.post('/events', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateEventData>) => {
        const response = await apiClient.patch(`/events/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/events/${id}`);
        return response.data;
    },

    getUpcoming: async () => {
        const response = await apiClient.get('/events/upcoming');
        return response.data;
    }
};
