import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
    @IsNotEmpty()
    @IsMongoId()
    eventId: string;
}
