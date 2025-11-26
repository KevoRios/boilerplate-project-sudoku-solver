class SudokuSolver {

  validate(puzzleString) {
    if (typeof puzzleString !== 'string') {
      return 'Expected puzzle to be 81 characters long';
    }

    // Caracteres inválidos
    if (/[^1-9.]/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }

    // Longitud incorrecta
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }

    return null; // válido
  }

  // row, column: índices 0–8
  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    for (let c = 0; c < 9; c++) {
      if (c === column) continue;
      const ch = puzzleString[rowStart + c];
      if (ch === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (r === row) continue;
      const ch = puzzleString[r * 9 + column];
      if (ch === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r === row && c === column) continue;
        const ch = puzzleString[r * 9 + c];
        if (ch === value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validationError = this.validate(puzzleString);
    if (validationError) {
      return { error: validationError };
    }

    let cells = puzzleString.split('');

    const isValidPlacement = (row, column, value) => {
      const current = cells.join('');
      return (
        this.checkRowPlacement(current, row, column, value) &&
        this.checkColPlacement(current, row, column, value) &&
        this.checkRegionPlacement(current, row, column, value)
      );
    };

    const solveRecursive = () => {
      const idx = cells.indexOf('.');
      if (idx === -1) {
        return true; // completo
      }

      const row = Math.floor(idx / 9);
      const col = idx % 9;

      for (let n = 1; n <= 9; n++) {
        const value = String(n);
        if (isValidPlacement(row, col, value)) {
          cells[idx] = value;
          if (solveRecursive()) return true;
          cells[idx] = '.';
        }
      }

      return false; // sin solución
    };

    if (!solveRecursive()) {
      return { error: 'Puzzle cannot be solved' };
    }

    return { solution: cells.join('') };
  }

}

module.exports = SudokuSolver;
