import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  
  try {
    const adminEmail = 'admin@eventia.com';
    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const admin = new userModel({
        first_name: 'Admin',
        last_name: 'Eventia',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await admin.save();
      console.log('Admin user created successfully!');
      console.log('Email: admin@eventia.com');
      console.log('Password: Admin123!');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
