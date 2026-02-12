import { Module, Global, Logger } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const logger = new Logger('MailModule');
                const host = configService.get<string>('MAIL_HOST');
                const port = configService.get<number>('MAIL_PORT');
                const user = configService.get<string>('MAIL_USER');

                logger.log(`Mail config: host=${host}, port=${port}, user=${user}`);

                return {
                    transport: {
                        host,
                        port,
                        secure: false, 
                        auth: {
                            user,
                            pass: configService.get<string>('MAIL_PASSWORD'),
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    },
                    defaults: {
                        from: configService.get<string>('MAIL_FROM'),
                    },
                    template: {
                        dir: join(__dirname, 'templates'),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
