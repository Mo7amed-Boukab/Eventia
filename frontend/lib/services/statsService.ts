import apiClient from "../api-client";

export interface AdminStats {
  totalRevenue: number;
  revenueTrend: string;
  activeEvents: number;
  eventsTrend: string;
  totalReservations: number;
  reservationsTrend: string;
  totalUsers: number;
  usersTrend: string;
}

export const statsService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get("/stats/admin");
    return response.data;
  },
};
