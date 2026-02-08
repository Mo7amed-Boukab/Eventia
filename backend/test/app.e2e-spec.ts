import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { User, UserDocument, UserRole } from '../src/users/schemas/user.schema';

describe('Eventia API - E2E Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let createdEventId: string;
  let createdReservationId: string;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userModel = moduleFixture.get<Model<UserDocument>>(
      getModelToken(User.name),
    );
  }, 30000); // 30 secondes timeout pour la connexion MongoDB

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('1. Authentication Flow', () => {
    const testUser = {
      email: `participant.${Date.now()}@test.com`,
      password: 'Test123!',
      first_name: 'John',
      last_name: 'Doe',
    };

    // Test 1 : Inscription réussie d'un participant
    it('should register a participant', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.role).toBe('PARTICIPANT');
          userToken = res.body.access_token;
        });
    });

    // Test 2 : Rejet d'email en double
    it('should reject duplicate email registration', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    });

    // Test 3 : Inscription d'un admin
    it('should register an admin', async () => {
      const adminEmail = `admin.${Date.now()}@test.com`;
      const adminPassword = 'Admin123!';

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: adminEmail,
          password: adminPassword,
          first_name: 'Admin',
          last_name: 'User',
        })
        .expect(201);

      await userModel.findOneAndUpdate(
        { email: adminEmail },
        { role: UserRole.ADMIN },
        { new: true },
      );

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: adminEmail,
          password: adminPassword,
        })
        .expect(200);

      expect(loginRes.body.user.role).toBe('ADMIN');
      adminToken = loginRes.body.access_token;
    });

    // Test 4 : Connexion réussie
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user.email).toBe(testUser.email);
        });
    });

    // Test 5 : Rejet d'identifiants invalides
    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword',
        })
        .expect(401);
    });

    // Test 6 : Récupération du profil authentifié
    it('should return user profile when authenticated', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(testUser.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    // Test 7 : Rejet d'accès non authentifié
    it('should reject unauthorized access', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });
  });

  describe('2. Events Flow', () => {
    // Test 8 : Création d'événement par admin
    it('should allow admin to create an event', () => {
      return request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: `Test Event ${Date.now()}`,
          description: 'Une soiree de test',
          date: '2026-12-31T18:00:00.000Z',
          time: '18:00',
          location: 'Paris',
          category: 'Workshop',
          maxParticipants: 50,
          price: 25,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.event).toHaveProperty('_id');
          createdEventId = res.body.event._id;
        });
    });

    // Test 9 : Blocage de création par participant
    it('should deny participant from creating an event', () => {
      return request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Unauthorized',
          description: 'Should fail',
          date: '2026-12-01T10:00:00.000Z',
          time: '10:00',
          location: 'Paris',
          category: 'Workshop',
          maxParticipants: 10,
          price: 10,
        })
        .expect(403);
    });

    // Test 10 : Liste publique des événements
    it('should return all events (public access)', () => {
      return request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // Test 11 : Filtrage par catégorie
    it('should filter events by category', () => {
      return request(app.getHttpServer())
        .get('/events?category=Workshop')
        .expect(200)
        .expect((res) => {
          expect(res.body.every((e: any) => e.category === 'Workshop')).toBe(true);
        });
    });

    // Test 12 : Détails d'un événement
    it('should return a single event by ID', () => {
      return request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(200);
    });

    // Test 13 : 404 pour ID inexistant
    it('should return 404 for non-existent event', () => {
      return request(app.getHttpServer())
        .get('/events/507f1f77bcf86cd799439011')
        .expect(404);
    });

    // Test 14 : Mise à jour par admin
    it('should allow admin to update an event', () => {
      return request(app.getHttpServer())
        .patch(`/events/${createdEventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 30 })
        .expect(200);
    });
  });

  describe('3. Reservations Flow', () => {
    // Test 16 : Création de réservation
    it('should allow participant to create a reservation', () => {
      return request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ eventId: createdEventId })
        .expect(201)
        .then((res) => {
          expect(res.body.status).toBe('PENDING');
          expect(res.body).toHaveProperty('ticketNumber');
          createdReservationId = res.body._id;
        });
    });

    // Test 17 : Blocage de doublon
    it('should prevent duplicate reservation for the same event', () => {
      return request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ eventId: createdEventId })
        .expect(400);
    });

    // Test 18 : Mes réservations
    it('should return user reservations', () => {
      return request(app.getHttpServer())
        .get('/reservations/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // Test 19 : Statut de réservation pour un événement
    it('should return reservation status for an event', () => {
      return request(app.getHttpServer())
        .get(`/reservations/status/${createdEventId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.reservation.status).toBe('PENDING');
        });
    });

    // Test 20 : Confirmation par admin
    it('should allow admin to confirm a reservation', () => {
      return request(app.getHttpServer())
        .patch(`/reservations/${createdReservationId}/confirm`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('CONFIRMED');
        });
    });

    // Test 21 : Incrémentation des participants
    it('should increment event participants count', () => {
      return request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.participants).toBe(1);
        });
    });

    // Test 22 : Téléchargement de ticket PDF
    it('should allow user to download their confirmed ticket', () => {
      return request(app.getHttpServer())
        .get(`/reservations/${createdReservationId}/ticket`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect('Content-Type', /pdf/);
    });

    // Extra: Admin view all reservations
    it('should allow admin to view all reservations', () => {
      return request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    // Extra: Deny participant view all reservations
    it('should deny participant view all reservations', () => {
      return request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    // Test 23 : Annulation par l'utilisateur
    it('should allow user to cancel their own reservation', () => {
      return request(app.getHttpServer())
        .patch(`/reservations/${createdReservationId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('CANCELED');
        });
    });

    // Test 24 : Décrémentation des participants
    it('should decrement event participants count after cancellation', () => {
      return request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.participants).toBe(0);
        });
    });

    // Test 15 : Suppression par admin
    it('should allow admin to delete an event', () => {
      return request(app.getHttpServer())
        .delete(`/events/${createdEventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });
  });
});
