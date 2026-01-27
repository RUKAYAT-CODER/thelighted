import {
  Controller,
  Post,
  UseGuards,
  Param,
  Body,
  Get,
  Put,
  Delete,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BulkOperationDto } from './dto/bulk-operation.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { MenuItemStatus } from './entities/menu-item.entity';
import { MenuService } from './menu.service';

@Controller('api')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Category endpoints
  @Post('restaurants/:restaurantId/categories')
  @UseGuards(AuthGuard)
  createCategory(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateCategoryDto,
    @Request() req,
  ) {
    return this.menuService.createCategory(restaurantId, dto, req.user.id);
  }

  @Get('restaurants/:restaurantId/categories')
  getCategories(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getCategories(restaurantId);
  }

  @Put('categories/:id')
  @UseGuards(AuthGuard)
  updateCategory(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCategoryDto>,
    @Request() req,
  ) {
    return this.menuService.updateCategory(id, dto, req.user.id);
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard)
  deleteCategory(@Param('id') id: string, @Request() req) {
    return this.menuService.deleteCategory(id, req.user.id);
  }

  @Patch('categories/reorder')
  @UseGuards(AuthGuard)
  reorderCategories(@Body() dto: ReorderCategoriesDto, @Request() req) {
    return this.menuService.reorderCategories(dto, req.user.id);
  }

  // Menu Item endpoints
  @Post('restaurants/:restaurantId/menu-items')
  @UseGuards(AuthGuard)
  createMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateMenuItemDto,
    @Request() req,
  ) {
    return this.menuService.createMenuItem(restaurantId, dto, req.user.id);
  }

  @Get('restaurants/:restaurantId/menu-items')
  getMenuItems(
    @Param('restaurantId') restaurantId: string,
    @Query('category') category: string,
    @Query('status') status: string,
    @Query('search') search: string,
    @Query('dietary') dietary: string,
    @Query('priceMin') priceMin: string,
    @Query('priceMax') priceMax: string,
    @Query('mood') mood: string,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const filters = {
      category,
      status,
      search,
      dietary: dietary ? dietary.split(',') : [],
      priceMin: priceMin ? +priceMin : undefined,
      priceMax: priceMax ? +priceMax : undefined,
      mood: mood ? mood.split(',') : [],
      sort,
      order,
    };

    return this.menuService.getMenuItems(
      restaurantId,
      filters,
      +page || 1,
      +limit || 20,
    );
  }

  @Get('menu-items/:id')
  getMenuItem(@Param('id') id: string) {
    return this.menuService.getMenuItem(id);
  }

  @Put('menu-items/:id')
  @UseGuards(AuthGuard)
  updateMenuItem(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMenuItemDto>,
    @Request() req,
  ) {
    return this.menuService.updateMenuItem(id, dto, req.user.id);
  }

  @Delete('menu-items/:id')
  @UseGuards(AuthGuard)
  deleteMenuItem(@Param('id') id: string, @Request() req) {
    return this.menuService.deleteMenuItem(id, req.user.id);
  }

  @Patch('menu-items/:id/status')
  @UseGuards(AuthGuard)
  updateItemStatus(
    @Param('id') id: string,
    @Body() body: { status: MenuItemStatus },
    @Request() req,
  ) {
    return this.menuService.updateItemStatus(id, body.status, req.user.id);
  }

  @Post('menu-items/bulk')
  @UseGuards(AuthGuard)
  bulkOperation(@Body() dto: BulkOperationDto, @Request() req) {
    return this.menuService.bulkOperation(dto, req.user.id);
  }

  // Size endpoints
  @Post('menu-items/:itemId/sizes')
  @UseGuards(AuthGuard)
  addSize(@Param('itemId') itemId: string, @Body() dto: any, @Request() req) {
    return this.menuService.addSize(itemId, dto, req.user.id);
  }

  @Put('sizes/:id')
  @UseGuards(AuthGuard)
  updateSize(@Param('id') id: string, @Body() dto: any, @Request() req) {
    return this.menuService.updateSize(id, dto, req.user.id);
  }

  @Delete('sizes/:id')
  @UseGuards(AuthGuard)
  deleteSize(@Param('id') id: string, @Request() req) {
    return this.menuService.deleteSize(id, req.user.id);
  }

  // Addon endpoints
  @Post('menu-items/:itemId/addons')
  @UseGuards(AuthGuard)
  addAddon(@Param('itemId') itemId: string, @Body() dto: any, @Request() req) {
    return this.menuService.addAddon(itemId, dto, req.user.id);
  }

  @Put('addons/:id')
  @UseGuards(AuthGuard)
  updateAddon(@Param('id') id: string, @Body() dto: any, @Request() req) {
    return this.menuService.updateAddon(id, dto, req.user.id);
  }

  @Delete('addons/:id')
  @UseGuards(AuthGuard)
  deleteAddon(@Param('id') id: string, @Request() req) {
    return this.menuService.deleteAddon(id, req.user.id);
  }
}
