import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PublicEventDetails from '@/app/events/[id]/page';
import { useAuthStore } from '@/stores/authStore';
import { useParams, useRouter } from 'next/navigation';
import { eventService } from '@/lib/services/eventService';
import { reservationService } from '@/lib/services/reservationService';

// Mock dependencies
jest.mock('@/stores/authStore');
jest.mock('next/navigation');
jest.mock('@/lib/services/eventService');
jest.mock('@/lib/services/reservationService');

describe('Reservation Flow', () => {
    const mockPaidEvent = {
        _id: '123',
        title: 'Test Event',
        description: 'Test Description',
        date: '2026-12-31T00:00:00.000Z',
        location: 'Test Location',
        price: 100,
        category: 'Gala',
        participants: 0,
        maxParticipants: 100,
    };

    const mockFreeEvent = {
        ...mockPaidEvent,
        price: 0,
    };

    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ id: '123' });
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (reservationService.getStatus as jest.Mock).mockResolvedValue({ isReserved: false });
    });

    it('should redirect to checkout for paid events', async () => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { role: 'PARTICIPANT' } });
        (eventService.getById as jest.Mock).mockResolvedValue(mockPaidEvent);

        render(<PublicEventDetails />);

        // Wait for event to load
        await waitFor(() => expect(screen.getByText('Test Event')).toBeInTheDocument());

        const reserveButton = screen.getByRole('button', { name: /Réserver mon ticket/i });
        fireEvent.click(reserveButton);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/checkout/123');
        });
    });

    it('should allow a participant to book a free event directly', async () => {
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { role: 'PARTICIPANT' } });
        (eventService.getById as jest.Mock).mockResolvedValue(mockFreeEvent);
        (reservationService.create as jest.Mock).mockResolvedValue({ _id: 'res123', status: 'PENDING' });

        render(<PublicEventDetails />);

        // Wait for event to load
        await waitFor(() => expect(screen.getByText('Test Event')).toBeInTheDocument());

        const reserveButton = screen.getByRole('button', { name: /Réserver mon ticket/i });
        fireEvent.click(reserveButton);

        await waitFor(() => {
            expect(reservationService.create).toHaveBeenCalledWith({ eventId: '123' });
            expect(screen.getByText(/Demande Envoyée/i)).toBeInTheDocument();
        });
    });

    it('should redirect to login if not authenticated', async () => {
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ isAuthenticated: false });
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (eventService.getById as jest.Mock).mockResolvedValue(mockFreeEvent);

        render(<PublicEventDetails />);

        await waitFor(() => screen.getByText('Test Event'));

        const reserveButton = screen.getByRole('button', { name: /Réserver mon ticket/i });
        fireEvent.click(reserveButton);

        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/login'));
    });
});
