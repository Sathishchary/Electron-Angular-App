import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export type Piece = 'r'|'n'|'b'|'q'|'k'|'p'|'R'|'N'|'B'|'Q'|'K'|'P'|'';
export interface Position { x: number; y: number; }
export interface Move { from: Position; to: Position; piece: Piece; capture?: Piece; }

@Component({
  selector: 'chess-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chess-game.html',
  styleUrls: ['./chess-game.css']
})
export class ChessGame {
  board: Piece[][] = [];
  selected: Position | null = null;
  currentPlayer: 'white' | 'black' = 'white';
  vsComputer = false;
  computerColor: 'white' | 'black' = 'black';

  ngOnInit() {
    this.resetBoard();
  }

  resetBoard() {
    this.board = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ];
    this.currentPlayer = 'white';
    this.selected = null;
  }

  isWhite(piece: Piece) { return piece !== '' && piece === piece.toUpperCase(); }
  isBlack(piece: Piece) { return piece !== '' && piece === piece.toLowerCase(); }

  getPieceSymbol(piece: Piece): string {
    return {
      'r': '♜',
      'n': '♞',
      'b': '♝',
      'q': '♛',
      'k': '♚',
      'p': '♟',
      'R': '♖',
      'N': '♘',
      'B': '♗',
      'Q': '♕',
      'K': '♔',
      'P': '♙',
      '': ''
    }[piece];
  }

  onSquareClick(x: number, y: number) {
    const piece = this.board[y][x];
    if (this.selected) {
      if (this.selected.x === x && this.selected.y === y) {
        this.selected = null;
        return;
      }
      const moves = this.getMoves(this.selected.x, this.selected.y);
      if (moves.some(m => m.to.x === x && m.to.y === y)) {
        this.makeMove(this.selected, {x, y});
        this.selected = null;
        if (this.vsComputer && this.currentPlayer === this.computerColor) {
          this.makeComputerMove();
        }
        return;
      }
    }

    if ((this.currentPlayer === 'white' && this.isWhite(piece)) ||
        (this.currentPlayer === 'black' && this.isBlack(piece))) {
      this.selected = {x, y};
    }
  }

  makeMove(from: Position, to: Position) {
    const piece = this.board[from.y][from.x];
    this.board[to.y][to.x] = piece;
    this.board[from.y][from.x] = '';
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
  }

  makeComputerMove() {
    const moves = this.getAllMoves(this.computerColor);
    if (moves.length === 0) return;
    const move = moves[Math.floor(Math.random() * moves.length)];
    this.makeMove(move.from, move.to);
  }

  getAllMoves(color: 'white' | 'black'): Move[] {
    const moves: Move[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const p = this.board[y][x];
        if (p === '') continue;
        if (color === 'white' && this.isWhite(p) ||
            color === 'black' && this.isBlack(p)) {
          moves.push(...this.getMoves(x, y));
        }
      }
    }
    return moves;
  }

  getMoves(x: number, y: number): Move[] {
    const piece = this.board[y][x];
    if (!piece) return [];
    const moves: Move[] = [];
    const color = this.isWhite(piece) ? 'white' : 'black';
    const dir = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    const enemyCheck = color === 'white' ? this.isBlack.bind(this) : this.isWhite.bind(this);

    const addMove = (nx: number, ny: number) => {
      if (nx < 0 || nx > 7 || ny < 0 || ny > 7) return;
      const target = this.board[ny][nx];
      if (target === '' || enemyCheck(target)) {
        moves.push({from: {x, y}, to: {x: nx, y: ny}, piece, capture: target || undefined});
      }
    };

    switch (piece.toLowerCase()) {
      case 'p':
        if (this.board[y + dir]?.[x] === '') {
          addMove(x, y + dir);
          if (y === startRow && this.board[y + dir*2]?.[x] === '') {
            addMove(x, y + dir*2);
          }
        }
        [x-1, x+1].forEach(nx => {
          if (enemyCheck(this.board[y + dir]?.[nx])) {
            addMove(nx, y + dir);
          }
        });
        break;
      case 'r':
        this.rayMoves(x, y, [[1,0],[-1,0],[0,1],[0,-1]], addMove, enemyCheck);
        break;
      case 'b':
        this.rayMoves(x, y, [[1,1],[-1,1],[1,-1],[-1,-1]], addMove, enemyCheck);
        break;
      case 'q':
        this.rayMoves(x, y, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]], addMove, enemyCheck);
        break;
      case 'n':
        [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]].forEach(([dx,dy]) => {
          const nx = x + dx, ny = y + dy;
          const target = this.board[ny]?.[nx];
          if (target !== undefined && (target === '' || enemyCheck(target))) {
            addMove(nx, ny);
          }
        });
        break;
      case 'k':
        [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([dx,dy]) => {
          const nx = x + dx, ny = y + dy;
          const target = this.board[ny]?.[nx];
          if (target !== undefined && (target === '' || enemyCheck(target))) {
            addMove(nx, ny);
          }
        });
        break;
    }
    return moves;
  }

  rayMoves(x: number, y: number, dirs: number[][], add: (nx: number, ny: number) => void, enemyCheck: (p: Piece) => boolean) {
    for (const [dx,dy] of dirs) {
      let nx = x + dx, ny = y + dy;
      while (nx >=0 && nx < 8 && ny >=0 && ny <8) {
        const target = this.board[ny][nx];
        if (target === '') {
          add(nx, ny);
        } else {
          if (enemyCheck(target)) add(nx, ny);
          break;
        }
        nx += dx; ny += dy;
      }
    }
  }
}

