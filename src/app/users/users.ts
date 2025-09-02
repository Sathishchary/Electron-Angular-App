import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../services/users';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showModal = false;
  editingUser: User | null = null;
  formUser: Partial<User> = { name: '', email: '', role: 'User' };

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openAddModal(): void {
    this.editingUser = null;
    this.formUser = { name: '', email: '', role: 'User' };
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.formUser = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.formUser = { name: '', email: '', role: 'User' };
  }

  saveUser(): void {
    if (!this.formUser.name || !this.formUser.email || !this.formUser.role) {
      alert('Please fill in all fields');
      return;
    }

    if (this.editingUser) {
      this.usersService.updateUser(this.editingUser.id, this.formUser);
    } else {
      this.usersService.addUser(this.formUser as Omit<User, 'id'>);
    }
    
    this.closeModal();
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.usersService.deleteUser(user.id);
    }
  }
}
