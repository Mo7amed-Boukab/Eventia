import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactSection from '@/components/home/ContactSection';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/context/AuthContext');
jest.mock('next/navigation');

describe('Common Components', () => {
    beforeEach(() => {
        (usePathname as jest.Mock).mockReturnValue('/');
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            user: null,
            logout: jest.fn(),
        });
    });

    describe('Header', () => {
        it('renders the logo and main navigation links', () => {
            render(<Header />);
            expect(screen.getByText(/Ev/i)).toBeInTheDocument();
            expect(screen.getByText(/entia/i)).toBeInTheDocument();
            expect(screen.getByText(/Accueil/i)).toBeInTheDocument();
            expect(screen.getByText(/Nos événements/i)).toBeInTheDocument();
        });

        it('shows login and register buttons when not authenticated', () => {
            render(<Header />);
            expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
            expect(screen.getByText(/s'inscrire/i)).toBeInTheDocument();
        });

        it('shows user name and dashboard link when authenticated', () => {
            (useAuth as jest.Mock).mockReturnValue({
                isAuthenticated: true,
                user: { first_name: 'John', role: 'USER' },
                logout: jest.fn(),
            });

            render(<Header />);
            expect(screen.getByText(/Bienvenue,/i)).toBeInTheDocument();
            expect(screen.getByText(/John/i)).toBeInTheDocument();
            expect(screen.getByText(/Mes Réservations/i)).toBeInTheDocument();
        });
    });

    describe('Footer', () => {
        it('renders footer with contact information', () => {
            render(<Footer />);
            expect(screen.getByText(/Tanger, Maroc/i)).toBeInTheDocument();
            expect(screen.getByText(/contact@eventia.com/i)).toBeInTheDocument();
        });

        it('renders social media links', () => {
            render(<Footer />);
            const footer = screen.getByRole('contentinfo');
            expect(footer).toBeInTheDocument();
        });
    });

    describe('ContactSection', () => {
        it('renders the contact form and information', () => {
            render(<ContactSection />);
            expect(screen.getByText(/Parlons de votre prochain projet/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Votre nom/i)).toBeInTheDocument();
            expect(screen.getByText(/Envoyer le message/i)).toBeInTheDocument();
        });
    });
});
