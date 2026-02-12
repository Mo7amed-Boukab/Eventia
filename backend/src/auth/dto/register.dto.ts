import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Le prénom ne doit pas dépasser 20 caractères' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Le nom ne doit pas dépasser 20 caractères' })
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    { message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' }
  )
  password: string;
}
