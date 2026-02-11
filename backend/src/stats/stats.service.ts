import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Event,
    EventDocument,
    EventStatus,
} from '../events/schemas/event.schema';
import {
    Reservation,
    ReservationDocument,
    ReservationStatus,
} from '../reservations/schemas/reservation.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class StatsService {
    private readonly logger = new Logger(StatsService.name);

    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(Reservation.name)
        private reservationModel: Model<ReservationDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async getAdminStats() {
        try {
            const now = new Date();
            const { startOfCurrentMonth, endOfCurrentMonth, startOfLastMonth, endOfLastMonth } = this.getDateRanges();

            // 1. Total Revenue (Confirmed Reservations)
            const currentMonthRevenue = await this.calculateRevenue(
                startOfCurrentMonth,
                endOfCurrentMonth,
            );
            const lastMonthRevenue = await this.calculateRevenue(
                startOfLastMonth,
                endOfLastMonth,
            );
            const revenueTrend = this.calculateTrend(
                currentMonthRevenue,
                lastMonthRevenue,
            );

            // 2. Événements Actifs (Value: Published & Date >= Today)
            const activeEventsCount = await this.eventModel.countDocuments({
                status: EventStatus.PUBLISHED,
                date: { $gte: now },
            });

            // Trend: Compare volume of events scheduled for this month vs last month
            const currentMonthEventsVolume = await this.eventModel.countDocuments({
                status: EventStatus.PUBLISHED,
                date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
            });
            const lastMonthEventsVolume = await this.eventModel.countDocuments({
                status: EventStatus.PUBLISHED,
                date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            });
            const eventsTrend = this.calculateTrend(
                currentMonthEventsVolume,
                lastMonthEventsVolume,
            );

            // 3. Total Reservations (Confirmed only)
            const currentMonthReservations = await this.reservationModel.countDocuments({
                status: ReservationStatus.CONFIRMED,
                createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
            });
            const lastMonthReservations = await this.reservationModel.countDocuments({
                status: ReservationStatus.CONFIRMED,
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            });
            const reservationsTrend = this.calculateTrend(
                currentMonthReservations,
                lastMonthReservations,
            );

            // 4. Total Users (Value: Total, Trend: Growth base)
            const totalUsersNow = await this.userModel.countDocuments({});
            const usersCreatedCurrentMonth = await this.userModel.countDocuments({
                createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
            });
            const totalUsersLastMonthEnd = totalUsersNow - usersCreatedCurrentMonth;
            const usersTrend = this.calculateTrend(totalUsersNow, totalUsersLastMonthEnd);

            return {
                totalRevenue: currentMonthRevenue,
                revenueTrend,
                activeEvents: activeEventsCount,
                eventsTrend,
                totalReservations: currentMonthReservations,
                reservationsTrend,
                totalUsers: totalUsersNow,
                usersTrend,
            };

        } catch (error) {
            this.logger.error(`Error aggregating admin stats: ${error.message}`, error.stack);
            throw error;
        }
    }

    private getDateRanges() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Current Month: 1st 00:00:00 to Last Day 23:59:59.999
        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        // Last Month: 1st 00:00:00 to Last Day 23:59:59.999
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

        return { startOfCurrentMonth, endOfCurrentMonth, startOfLastMonth, endOfLastMonth };
    }

    private async calculateRevenue(
        startDate: Date,
        endDate: Date,
    ): Promise<number> {
        const confirmedReservations = await this.reservationModel
            .find({
                status: ReservationStatus.CONFIRMED,
                createdAt: { $gte: startDate, $lte: endDate },
            })
            .populate('eventId', 'price');

        return confirmedReservations.reduce((sum, res) => {
            const event = res.eventId as any;
            return sum + (event?.price || 0);
        }, 0);
    }

    private calculateTrend(current: number, previous: number): string {
        if (previous === 0) {
            if (current === 0) return '0%';
            return '+100%';
        }

        const percentChange = ((current - previous) / previous) * 100;
        const sign = percentChange > 0 ? '+' : '';
        const formatted = percentChange.toFixed(1);
        return `${sign}${formatted === '-0.0' ? '0.0' : formatted}%`;
    }
}
