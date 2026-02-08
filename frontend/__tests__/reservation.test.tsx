import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PublicEventDetails from '@/app/events/[id]/page';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { eventService } from '@/lib/services/eventService';
import { reservationService } from '@/lib/services/reservationService';

// Mock dependencies
jest.mock('@/context/AuthContext');
jest.mock('next/navigation');
jest.mock('@/lib/services/eventService');
jest.mock('@/lib/services/reservationService');

describe('Reservation Flow', () => {
    const mockEvent = {
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

    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ id: '123' });
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (eventService.getById as jest.Mock).mockResolvedValue(mockEvent);
        (reservationService.getStatus as jest.Mock).mockResolvedValue({ isReserved: false });
    });

    it('should allow a participant to book an event', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { role: 'PARTICIPANT' } });
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
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        render(<PublicEventDetails />);

        await waitFor(() => screen.getByText('Test Event'));

        const reserveButton = screen.getByRole('button', { name: /Réserver mon ticket/i });
        fireEvent.click(reserveButton);

        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/login'));
    });
});
