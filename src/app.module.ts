import { join } from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    ProductModule,

    ProductsModule,

  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
