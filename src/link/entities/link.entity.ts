import { Message } from "src/message/entities/message.entity";
import { Request } from "src/request/entities/request.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Request, { onDelete: 'CASCADE' })
  @JoinColumn()
  request: Request

  @Column()
  url: string

  @OneToMany(() => Message, (message) => message.user)
  @JoinColumn()
  messages: Message[]
}