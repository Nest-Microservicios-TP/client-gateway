import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger'

async function bootstrap() {

  const logger = new Logger('Main-Gateway')
  const app = await NestFactory.create(AppModule);
  
     app.enableCors();


  


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))



  app.setGlobalPrefix('api')

  app.useGlobalFilters(new RpcCustomExceptionFilter())


  const config = new DocumentBuilder()
  .setTitle('ProductsMS - ClientGateway')
  .setDescription('Shows all the endpoints for the user')
  .setVersion('1.0')
  .addTag('products')
  .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // este nombre lo usás más adelante en el decorador
    )
  .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory)

  
 

  await app.listen(envs.port);



  logger.log(`Logger running on port ${envs.port}`)

}
bootstrap();
