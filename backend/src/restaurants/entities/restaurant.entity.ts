import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Point } from 'geojson';
import { Category } from '../../menu/entities/category.entity';
import { OperatingHours } from './operating-hours.entity';
import { MenuItem } from 'src/menu/entities/menu-item.entity';

export enum PriceRange {
  BUDGET = '$',
  MODERATE = '$$',
  UPSCALE = '$$$',
  FINE_DINING = '$$$$',
}

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @Index()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  cuisineType: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column('jsonb')
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @Column({ length: 20 })
  phone: string;

  @Column()
  email: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviewCount: number;

  @Column({
    type: 'enum',
    enum: PriceRange,
    default: PriceRange.MODERATE,
  })
  priceRange: PriceRange;

  @Column({ default: true })
  isActive: boolean;

  @Column('uuid')
  ownerId: string;

  @OneToMany(() => OperatingHours, (hours) => hours.restaurant, {
    cascade: true,
  })
  operatingHours: OperatingHours[];

  @OneToMany(() => Category, (category) => category.restaurant)
  categories: Category[];

  @OneToMany(() => MenuItem, (item) => item.restaurant)
  menuItems: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
