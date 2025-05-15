import { Message } from 'src/message/entities/message.entity';
import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Request, (request) => request.user)
  @JoinColumn()
  requests: Request[]

  @OneToMany(() => Message, (message) => message.user)
  @JoinColumn()
  message: Message[]
}
