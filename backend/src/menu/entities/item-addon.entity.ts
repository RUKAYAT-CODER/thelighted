import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('item_addons')
export class ItemAddon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  menuItemId: string;

  @Column({ length: 100 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column('int', { default: 0 })
  displayOrder: number;

  @ManyToOne(() => MenuItem, (item) => item.addons, { onDelete: 'CASCADE' })
  menuItem: MenuItem;
}
