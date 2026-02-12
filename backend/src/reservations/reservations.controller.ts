import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    Patch,
    Param,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Roles(UserRole.PARTICIPANT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 reservations per minute
    @Post()
    create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.create(
            req.user.userId,
            createReservationDto,
        );
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll() {
        return this.reservationsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    findMyReservations(@Request() req) {
        return this.reservationsService.findByUser(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('status/:eventId')
    async getStatus(@Request() req, @Param('eventId') eventId: string) {
        const reservation = await this.reservationsService.findOneByUserAndEvent(
            req.user.userId,
            eventId,
        );
        return { isReserved: !!reservation, reservation };
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/confirm')
    confirm(@Param('id') id: string) {
        return this.reservationsService.confirm(id);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/reject')
    reject(@Param('id') id: string) {
        return this.reservationsService.reject(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/cancel')
    async cancel(@Request() req, @Param('id') id: string) {
        // If admin, they can cancel any reservation
        if (req.user.role === UserRole.ADMIN) {
            return this.reservationsService.cancel(id);
        }
        // If user, they can only cancel their own
        return this.reservationsService.cancelByUser(id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 PDF generations per minute
    @Get(':id/ticket')
    async getTicket(
        @Param('id') id: string,
        @Request() req,
        @Res() res: Response,
    ) {
        const buffer = await this.reservationsService.getTicket(id, req.user.userId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=ticket-${id}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
