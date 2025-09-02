import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Manager' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User' },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'User' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'Manager' }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);
  private nextId = 6;

  constructor() { }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = { ...user, id: this.nextId++ };
    this.users.push(newUser);
    this.usersSubject.next([...this.users]);
    return newUser;
  }

  updateUser(id: number, updates: Partial<Omit<User, 'id'>>): User | null {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      this.usersSubject.next([...this.users]);
      return this.users[index];
    }
    return null;
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.usersSubject.next([...this.users]);
      return true;
    }
    return false;
  }

  getUserStats() {
    const total = this.users.length;
    const roleStats = this.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, roleStats };
  }
}
