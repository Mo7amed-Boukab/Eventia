import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument, ReservationStatus } from './schemas/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Event, EventDocument } from '../events/schemas/event.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { PdfService } from './pdf.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly pdfService: PdfService,
        private readonly mailService: MailService,
    ) { }

    async create(userId: string, createReservationDto: CreateReservationDto): Promise<Reservation> {
        const { eventId } = createReservationDto;

        // Check if event exists
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new NotFoundException('Événement non trouvé');
        }

        // Vérifier la capacité maximale
        if (event.maxParticipants && event.participants >= event.maxParticipants) {
            throw new BadRequestException('Les places de cet événement sont toutes prises');
        }

        // Check if user already booked this event
        const existingReservation = await this.reservationModel.findOne({
            userId: userId as any,
            eventId: eventId as any,
            status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] }
        });

        if (existingReservation) {
            throw new BadRequestException('Vous avez déjà réservé cet événement');
        }

        // Generate a random ticket number
        const ticketNumber = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const newReservation = new this.reservationModel({
            userId,
            eventId,
            ticketNumber,
            status: ReservationStatus.PENDING
        });

        const savedReservation = await newReservation.save();

        // Fetch user data for email
        const user = await this.userModel.findById(userId);

        // Send reservation pending email (fire-and-forget)
        if (user) {
            this.mailService.sendReservationPending(
                {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                {
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    location: event.location,
                    price: event.price,
                },
                ticketNumber
            ).catch(err => {
                // Already logged in MailService
            });
        }

        return savedReservation;
    }

    async findAll(): Promise<Reservation[]> {
        return this.reservationModel
            .find()
            .populate('userId', 'first_name last_name email')
            .populate('eventId', 'title date location price')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findByUser(userId: string): Promise<Reservation[]> {
        return this.reservationModel
            .find({ userId: userId as any })
            .populate('eventId', 'title date location price image')
            .sort({ createdAt: -1 })
            .exec();
    }

    async confirm(id: string): Promise<Reservation> {
        const reservation = await this.reservationModel.findById(id);
        if (!reservation) {
            throw new NotFoundException('Réservation non trouvée');
        }

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Seules les réservations en attente peuvent être confirmées');
        }

        // Increment participants
        await this.eventModel.findByIdAndUpdate(reservation.eventId, { $inc: { participants: 1 } });

        reservation.status = ReservationStatus.CONFIRMED;
        const savedReservation = await reservation.save();

        // Fetch user and event data for email
        const user = await this.userModel.findById(reservation.userId);
        const event = await this.eventModel.findById(reservation.eventId);

        // Send reservation confirmed email with PDF ticket
        if (user && event) {
            try {
                // Generate PDF ticket
                const pdfBuffer = await this.pdfService.generateTicket(
                    reservation,
                    event,
                    user
                );

                await this.mailService.sendReservationConfirmed(
                    {
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                    },
                    {
                        title: event.title,
                        date: event.date,
                        time: event.time,
                        location: event.location,
                        price: event.price,
                    },
                    reservation.ticketNumber,
                    pdfBuffer
                );
            } catch (err) {
                // Already logged in services
            }
        }

        return savedReservation;
    }

    async reject(id: string): Promise<Reservation> {
        const reservation = await this.reservationModel.findById(id);
        if (!reservation) {
            throw new NotFoundException('Réservation non trouvée');
        }

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Seules les réservations en attente peuvent être rejetées');
        }

        reservation.status = ReservationStatus.REJECTED;
        const savedReservation = await reservation.save();

        // Fetch user and event data for email
        const user = await this.userModel.findById(reservation.userId);
        const event = await this.eventModel.findById(reservation.eventId);

        // Send reservation rejected email (fire-and-forget)
        if (user && event) {
            this.mailService.sendReservationRejected(
                {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                {
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    location: event.location,
                    price: event.price,
                }
            ).catch(err => {
                // Already logged in MailService
            });
        }

        return savedReservation;
    }

    async findOneByUserAndEvent(userId: string, eventId: string): Promise<Reservation | null> {
        return this.reservationModel.findOne({
            userId: userId as any,
            eventId: eventId as any,
            status: { $ne: ReservationStatus.CANCELED }
        }).sort({ createdAt: -1 }).exec();
    }

    async cancelByUser(id: string, userId: string): Promise<Reservation> {
        const reservation = await this.reservationModel.findOne({ _id: id, userId: userId as any });
        if (!reservation) {
            throw new NotFoundException('Réservation non trouvée ou vous n\'avez pas les droits');
        }

        if (reservation.status === ReservationStatus.CANCELED || reservation.status === ReservationStatus.REJECTED) {
            throw new BadRequestException('Cette réservation est déjà annulée ou rejetée');
        }

        // If it was confirmed, decrement participants
        if (reservation.status === ReservationStatus.CONFIRMED) {
            await this.eventModel.findByIdAndUpdate(reservation.eventId, { $inc: { participants: -1 } });
        }

        reservation.status = ReservationStatus.CANCELED;
        const savedReservation = await reservation.save();

        // Fetch user and event data for email
        const user = await this.userModel.findById(reservation.userId);
        const event = await this.eventModel.findById(reservation.eventId);

        // Send reservation canceled email (fire-and-forget)
        if (user && event) {
            this.mailService.sendReservationCanceled(
                {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                {
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    location: event.location,
                    price: event.price,
                }
            ).catch(err => {
                // Already logged in MailService
            });
        }

        return savedReservation;
    }

    async cancel(id: string): Promise<Reservation> {
        const reservation = await this.reservationModel.findById(id);
        if (!reservation) {
            throw new NotFoundException('Réservation non trouvée');
        }

        if (reservation.status === ReservationStatus.CANCELED || reservation.status === ReservationStatus.REJECTED) {
            throw new BadRequestException('Cette réservation est déjà annulée ou rejetée');
        }

        // If it was confirmed, decrement participants
        if (reservation.status === ReservationStatus.CONFIRMED) {
            await this.eventModel.findByIdAndUpdate(reservation.eventId, { $inc: { participants: -1 } });
        }

        reservation.status = ReservationStatus.CANCELED;
        const savedReservation = await reservation.save();

        // Fetch user and event data for email
        const user = await this.userModel.findById(reservation.userId);
        const event = await this.eventModel.findById(reservation.eventId);

        // Send reservation canceled email (fire-and-forget)
        if (user && event) {
            this.mailService.sendReservationCanceled(
                {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                {
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    location: event.location,
                    price: event.price,
                }
            ).catch(err => {
                // Already logged in MailService
            });
        }

        return savedReservation;
    }

    async getTicket(id: string, userId: string): Promise<Buffer> {
        const reservation = await this.reservationModel.findById(id)
            .populate('eventId')
            .populate('userId');

        if (!reservation) {
            throw new NotFoundException('Réservation non trouvée');
        }

        // Check ownership
        if (reservation.userId['_id'].toString() !== userId) {
            throw new BadRequestException('Vous n\'avez pas accès à ce billet');
        }

        if (reservation.status !== ReservationStatus.CONFIRMED) {
            throw new BadRequestException('Seules les réservations confirmées disposent d\'un billet');
        }

        return this.pdfService.generateTicket(
            reservation,
            reservation.eventId as any,
            reservation.userId as any
        );
    }
}
