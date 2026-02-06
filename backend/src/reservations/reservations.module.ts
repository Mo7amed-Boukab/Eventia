import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reservation.name, schema: ReservationSchema },
            { name: Event.name, schema: EventSchema },
        ]),
    ],
    controllers: [ReservationsController],
    providers: [ReservationsService],
})
export class ReservationsModule { }
