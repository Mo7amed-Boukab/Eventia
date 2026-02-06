import apiClient from '../api-client';

export interface CreateReservationData {
    eventId: string;
}

export interface Reservation {
    _id: string;
    userId: string | any;
    eventId: string | any;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'REJECTED';
    ticketNumber?: string;
    createdAt: string;
}

export const reservationService = {
    create: async (data: CreateReservationData) => {
        const response = await apiClient.post('/reservations', data);
        return response.data;
    },

    getAll: async () => {
        const response = await apiClient.get('/reservations');
        return response.data;
    },

    getMyReservations: async () => {
        const response = await apiClient.get('/reservations/me');
        return response.data;
    },

    confirm: async (id: string) => {
        const response = await apiClient.patch(`/reservations/${id}/confirm`);
        return response.data;
    },

    reject: async (id: string) => {
        const response = await apiClient.patch(`/reservations/${id}/reject`);
        return response.data;
    },

    cancel: async (id: string) => {
        const response = await apiClient.patch(`/reservations/${id}/cancel`);
        return response.data;
    }
};
