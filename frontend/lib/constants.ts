import { Event, Testimonial } from './types';

export const COLORS = {
  primary: '#C5A059', // Gold/Bronze
  dark: '#1A1A1A',
  light: '#F8F8F8',
};

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Masterclass Leadership & Management',
    location: 'Casablanca',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
    date: '12 Oct 2025',
    category: 'Training'
  },
  {
    id: '2',
    title: 'Atelier Design Thinking & Innovation',
    location: 'Rabat',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
    date: '05 Nov 2025',
    category: 'Workshop'
  },
  {
    id: '3',
    title: 'Conférence Tech & Future of Work',
    location: 'Marrakech',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
    date: '18 Dec 2025',
    category: 'Conference'
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sophia Alaoui',
    role: 'Chef de Projet',
    content: 'Eventia nous a permis de réserver rapidement des formations professionnelles. La plateforme est simple à utiliser et offre un large choix d\'événements business.',
    avatar: 'https://i.pravatar.cc/150?u=sophia',
    rating: 5
  },
  {
    id: '2',
    name: 'Hassan Benjelloun',
    role: 'Directeur Marketing',
    content: 'Grâce à Eventia, nous réservons facilement des séminaires et ateliers. Les informations sont claires, les réservations instantanées et le suivi très pratique.',
    avatar: 'https://i.pravatar.cc/150?u=hassan',
    rating: 5
  },
  {
    id: '3',
    name: 'Karima Aatar',
    role: 'Entrepreneuse',
    content: 'Eventia est devenu notre solution principale pour réserver des conférences. Le catalogue est professionnel et bien organisé. Je recommande vivement !',
    avatar: 'https://i.pravatar.cc/150?u=karima',
    rating: 5
  }
];
