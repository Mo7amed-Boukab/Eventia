import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface UserInfo {
    email: string;
    first_name: string;
    last_name: string;
}

interface EventInfo {
    title: string;
    date: Date;
    time: string;
    location: string;
    price: number;
}

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Send welcome email to new users
     */
    async sendWelcomeEmail(user: UserInfo): Promise<void> {
        try {
            const frontendUrl = this.configService.get<string>('FRONTEND_URL');
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Bienvenue chez Eventia',
                template: 'welcome',
                context: {
                    firstName: user.first_name,
                    frontendUrl,
                },
            });
            this.logger.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
            this.logger.error(`Failed to send welcome email to ${user.email}`, error.stack);
        }
    }

    /**
     * Send reservation pending notification
     */
    async sendReservationPending(user: UserInfo, event: EventInfo, ticketNumber: string): Promise<void> {
        try {
            const frontendUrl = this.configService.get<string>('FRONTEND_URL');
            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date(event.date));

            await this.mailerService.sendMail({
                to: user.email,
                subject: `Réservation en attente - ${event.title}`,
                template: 'reservation-pending',
                context: {
                    firstName: user.first_name,
                    eventTitle: event.title,
                    eventDate: formattedDate,
                    eventTime: event.time,
                    eventLocation: event.location,
                    eventPrice: event.price === 0 ? 'Gratuit' : `${event.price} MAD`,
                    ticketNumber,
                    frontendUrl,
                },
            });
            this.logger.log(`Reservation pending email sent to ${user.email}`);
        } catch (error) {
            this.logger.error(`Failed to send reservation pending email to ${user.email}`, error.stack);
        }
    }

    /**
     * Send reservation confirmed notification with ticket
     */
    async sendReservationConfirmed(user: UserInfo, event: EventInfo, ticketNumber: string, pdfBuffer?: Buffer): Promise<void> {
        try {
            const frontendUrl = this.configService.get<string>('FRONTEND_URL');
            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date(event.date));

            const mailOptions: any = {
                to: user.email,
                subject: `Réservation confirmée - ${event.title}`,
                template: 'reservation-confirmed',
                context: {
                    firstName: user.first_name,
                    eventTitle: event.title,
                    eventDate: formattedDate,
                    eventTime: event.time,
                    eventLocation: event.location,
                    eventPrice: event.price === 0 ? 'Gratuit' : `${event.price} MAD`,
                    ticketNumber,
                    frontendUrl,
                },
            };

            if (pdfBuffer) {
                mailOptions.attachments = [
                    {
                        filename: `Ticket-${ticketNumber}.pdf`,
                        content: pdfBuffer,
                    }
                ];
            }

            await this.mailerService.sendMail(mailOptions);
            this.logger.log(`Reservation confirmed email sent to ${user.email}`);
        } catch (error) {
            this.logger.error(`Failed to send reservation confirmed email to ${user.email}`, error.stack);
        }
    }

    /**
     * Send reservation rejected notification
     */
    async sendReservationRejected(user: UserInfo, event: EventInfo): Promise<void> {
        try {
            const frontendUrl = this.configService.get<string>('FRONTEND_URL');
            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date(event.date));

            await this.mailerService.sendMail({
                to: user.email,
                subject: `Réservation non retenue - ${event.title}`,
                template: 'reservation-rejected',
                context: {
                    firstName: user.first_name,
                    eventTitle: event.title,
                    eventDate: formattedDate,
                    frontendUrl,
                },
            });
            this.logger.log(`Reservation rejected email sent to ${user.email}`);
        } catch (error) {
            this.logger.error(`Failed to send reservation rejected email to ${user.email}`, error.stack);
        }
    }

    /**
     * Send reservation canceled notification
     */
    async sendReservationCanceled(user: UserInfo, event: EventInfo): Promise<void> {
        try {
            const frontendUrl = this.configService.get<string>('FRONTEND_URL');
            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date(event.date));

            await this.mailerService.sendMail({
                to: user.email,
                subject: `Réservation annulée - ${event.title}`,
                template: 'reservation-canceled',
                context: {
                    firstName: user.first_name,
                    eventTitle: event.title,
                    eventDate: formattedDate,
                    frontendUrl,
                },
            });
            this.logger.log(`Reservation canceled email sent to ${user.email}`);
        } catch (error) {
            this.logger.error(`Failed to send reservation canceled email to ${user.email}`, error.stack);
        }
    }
}
