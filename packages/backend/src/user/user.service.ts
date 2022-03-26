import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Richard Roe' },
  ];

  findOneById(id: number): User | undefined {
    return this.users.find((user) => user.id === Number(id));
  }

  findAll(): User[] {
    return this.users;
  }

  changeNameById(id: number, name: string): User {
    this.users.forEach((user) => {
      if (user.id === Number(id)) user.name = name;
    });
    return this.users[id - 1];
  }
}
