import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChessGame } from './chess-game/chess-game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ChessGame],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  vsComputer = false;
  computerColor: 'white' | 'black' = 'black';
}
