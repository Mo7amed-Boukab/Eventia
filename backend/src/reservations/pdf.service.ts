import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');
import * as QRCode from 'qrcode';
import { ReservationDocument } from './schemas/reservation.schema';
import { Event } from '../events/schemas/event.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PdfService {
    async generateTicket(reservation: ReservationDocument, event: Event, user: User): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 0,
                });

                const buffers: Buffer[] = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));

                // Colors
                const primaryColor = '#C5A059'; // Gold
                const secondaryColor = '#1A1A1A'; // Black
                const textColor = '#333333';
                const lightGray = '#F5F5F5';

                // Background
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FDFBF7');

                // Header Section
                doc.rect(0, 0, doc.page.width, 150).fill(secondaryColor);

                // Logo / Title
                doc.fillColor(primaryColor)
                    .font('Helvetica-Bold')
                    .fontSize(32)
                    .text('EVENTIA', 50, 60, { characterSpacing: 2 });

                doc.fillColor('#FFFFFF')
                    .font('Helvetica')
                    .fontSize(10)
                    .text('BILLET PRÉMIUM • ACCÈS EXCLUSIF', 50, 95, { characterSpacing: 1 });

                // Main Card
                const cardWidth = 500;
                const cardHeight = 550;
                const cardX = (doc.page.width - cardWidth) / 2;
                const cardY = 180;

                doc.rect(cardX, cardY, cardWidth, cardHeight)
                    .fill('#FFFFFF');

                // Shadow effect
                doc.rect(cardX, cardY, cardWidth, 4)
                    .fill(primaryColor);

                // Event Title
                doc.fillColor(secondaryColor)
                    .font('Helvetica-Bold')
                    .fontSize(24)
                    .text(event.title.toUpperCase(), cardX + 40, cardY + 40, { width: cardWidth - 80, align: 'left' });

                // Divider
                doc.moveTo(cardX + 40, cardY + 90)
                    .lineTo(cardX + cardWidth - 40, cardY + 90)
                    .lineWidth(0.5)
                    .strokeColor('#E0E0E0')
                    .stroke();

                // Details Section
                const detailsY = cardY + 110;

                // Date
                doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('DATE', cardX + 40, detailsY);
                doc.fillColor(textColor).font('Helvetica').fontSize(12).text(new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), cardX + 40, detailsY + 15);

                // Location
                doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('LIEU', cardX + 250, detailsY);
                doc.fillColor(textColor).font('Helvetica').fontSize(12).text(event.location, cardX + 250, detailsY + 15, { width: 210 });

                // Time
                doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('HEURE', cardX + 40, detailsY + 60);
                doc.fillColor(textColor).font('Helvetica').fontSize(12).text(event.time || '20:00', cardX + 40, detailsY + 75);

                // Category
                doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('CATÉGORIE', cardX + 250, detailsY + 60);
                doc.fillColor(textColor).font('Helvetica').fontSize(12).text(event.category || 'Événement', cardX + 250, detailsY + 75);

                // Participant Section
                const participantY = detailsY + 140;
                doc.rect(cardX + 40, participantY, cardWidth - 80, 80)
                    .fill(lightGray);

                doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10).text('DÉTENTEUR DU BILLET', cardX + 60, participantY + 20);
                doc.fillColor(secondaryColor).font('Helvetica-Bold').fontSize(16).text(`${user.first_name} ${user.last_name}`, cardX + 60, participantY + 40);

                // QR Code and Ticket Number
                const bottomY = cardY + 360;

                // Generate QR Code
                const qrData = JSON.stringify({
                    id: reservation._id,
                    ticket: reservation.ticketNumber,
                    event: event.title,
                    user: `${user.first_name} ${user.last_name}`
                });

                const qrImageUrl = await QRCode.toDataURL(qrData);
                doc.image(qrImageUrl, cardX + cardWidth / 2 - 60, bottomY, { width: 120 });

                doc.fillColor(secondaryColor)
                    .font('Helvetica-Bold')
                    .fontSize(14)
                    .text(reservation.ticketNumber, cardX, bottomY + 130, { width: cardWidth, align: 'center' });

                doc.fillColor('#999999')
                    .font('Helvetica')
                    .fontSize(8)
                    .text('PRÉSENTEZ CE QR CODE À L\'ENTRÉE', cardX, bottomY + 155, { width: cardWidth, align: 'center', characterSpacing: 1 });

                // Footer Section
                doc.fillColor('#999999')
                    .font('Helvetica')
                    .fontSize(9)
                    .text('© EVENTIA. TOUS DROITS RÉSERVÉS.', 0, doc.page.height - 40, { align: 'center' });

                doc.end();
            } catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
}
