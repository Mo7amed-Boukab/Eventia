import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsService } from './reservations.service';
import { PdfService } from './pdf.service';
import { ReservationsController } from './reservations.controller';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reservation.name, schema: ReservationSchema },
            { name: Event.name, schema: EventSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [ReservationsController],
    providers: [ReservationsService, PdfService],
})
export class ReservationsModule { }
