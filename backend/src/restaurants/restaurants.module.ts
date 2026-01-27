import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatingHours } from './entities/operating-hours.entity';
import { Restaurant } from './entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, OperatingHours])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
