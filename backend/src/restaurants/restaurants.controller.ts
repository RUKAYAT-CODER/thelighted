import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { OperatingHours } from './entities/operating-hours.entity';
import { RestaurantsService } from './restaurants.service';

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDto: CreateRestaurantDto, @Request() req) {
    return this.restaurantsService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.restaurantsService.findAll(+page || 1, +limit || 20);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantDto,
    @Request() req,
  ) {
    return this.restaurantsService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.restaurantsService.remove(id, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
    @Request() req,
  ) {
    return this.restaurantsService.updateStatus(id, body.isActive, req.user.id);
  }

  @Get(':id/hours')
  getHours(@Param('id') id: string) {
    return this.restaurantsService.getHours(id);
  }

  @Put(':id/hours')
  @UseGuards(AuthGuard)
  updateHours(
    @Param('id') id: string,
    @Body() hours: Partial<OperatingHours>[],
    @Request() req,
  ) {
    return this.restaurantsService.updateHours(id, hours, req.user.id);
  }
}
