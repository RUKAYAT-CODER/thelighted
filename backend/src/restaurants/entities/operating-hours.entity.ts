import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('operating_hours')
export class OperatingHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  restaurantId: string;

  @Column({
    type: 'enum',
    enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  })
  dayOfWeek: string;

  @Column('time', { nullable: true })
  openTime: string;

  @Column('time', { nullable: true })
  closeTime: string;

  @Column({ default: false })
  isClosed: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.operatingHours, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
