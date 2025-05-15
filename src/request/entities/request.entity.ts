import { Context } from 'src/context/entities/context.entity';
import { Link } from 'src/link/entities/link.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum ESocial {
  TELEGRAM = 'telegram'
} 

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @OneToMany(() => Link, (link) => link.request, { cascade: true, orphanedRowAction: 'delete' })
  links: Link[]

  @OneToMany(() => Context, (context) => context.request, { cascade: true, orphanedRowAction: 'delete' })
  contexts: Context[]

  @OneToMany(() => Message, (message) => message.request, { cascade: true })
  messages: Message[]

  @Column({ enum: ESocial })
  social: string;

  @Column()
  name: string;
}
