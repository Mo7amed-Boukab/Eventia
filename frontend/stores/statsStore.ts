import { create } from 'zustand';
import { statsService, AdminStats } from '@/lib/services/statsService';

interface StatsState {
    stats: AdminStats | null;
    isLoading: boolean;
    error: string;
    fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>()((set) => ({
    stats: null,
    isLoading: true,
    error: '',

    fetchStats: async () => {
        try {
            set({ isLoading: true, error: '' });
            const data = await statsService.getAdminStats();
            set({ stats: data, isLoading: false });
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
            set({ error: 'Impossible de charger les statistiques.', isLoading: false });
        }
    },
}));
