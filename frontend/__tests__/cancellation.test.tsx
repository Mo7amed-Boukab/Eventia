import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyReservationsPage from '@/app/my-reservations/page';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { reservationService } from '@/lib/services/reservationService';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/stores/authStore');
jest.mock('@/stores/toastStore');
jest.mock('@/lib/services/reservationService');
jest.mock('next/navigation');

describe('Cancellation Flow', () => {
    const mockReservations = [
        {
            _id: 'res123',
            ticketNumber: 'TKT-123',
            status: 'CONFIRMED',
            createdAt: new Date().toISOString(),
            eventId: {
                _id: 'event123',
                title: 'Event to Cancel',
                date: '2026-12-31',
                location: 'Paris',
                category: 'Gala',
            },
        },
    ];

    const mockToast = {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        toasts: [],
        removeToast: jest.fn(),
    };

    beforeEach(() => {
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ isAuthenticated: true, isLoading: false, user: { id: 'user1' } });
        (useToastStore as unknown as jest.Mock).mockReturnValue(mockToast);
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (reservationService.getMyReservations as jest.Mock).mockResolvedValue(mockReservations);
    });

    it('should allow a user to cancel a reservation', async () => {
        (reservationService.cancel as jest.Mock).mockResolvedValue({});

        render(<MyReservationsPage />);

        // Wait for reservations to load
        await waitFor(() => expect(screen.getByText('Event to Cancel')).toBeInTheDocument());

        const cancelButton = screen.getByText(/Annuler la place/i);
        fireEvent.click(cancelButton);

        // Confirm in modal
        const confirmButton = screen.getByText(/Oui, annuler/i);
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(reservationService.cancel).toHaveBeenCalledWith('res123');
            expect(mockToast.success).toHaveBeenCalledWith(expect.stringContaining('succès'));
        });
    });
});
