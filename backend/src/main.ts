import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();


  app.use(express.json({limit: '50mb'}));
  
  
app.use(express.static('./images'));


  await app.listen(3000);



  
}



bootstrap();
