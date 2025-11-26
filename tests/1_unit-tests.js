const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver = new SudokuSolver();

suite('Unit Tests', () => {

  test('Logic handles a valid puzzle string of 81 characters', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validate(puzzleString);
    assert.isTrue(result.valid);
  });

  test('Logic handles a puzzle string with invalid characters', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....X..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validate(puzzleString);
    assert.deepEqual(result, {
      valid: false,
      error: 'Invalid characters in puzzle'
    });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'; // 80 chars
    const result = solver.validate(puzzleString);
    assert.deepEqual(result, {
      valid: false,
      error: 'Expected puzzle to be 81 characters long'
    });
  });

  test('Logic handles a valid row placement', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const ok = solver.checkRowPlacement(puzzleString, 0, 1, '3'); // fila 0, col 1, valor 3
    assert.isTrue(ok);
  });

  test('Logic handles an invalid row placement', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const ok = solver.checkRowPlacement(puzzleString, 0, 1, '5');
    assert.isFalse(ok);
  });

  test('Logic handles a valid column placement', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const ok = solver.checkColPlacement(puzzleString, 0, 1, '3');
    assert.isTrue(ok);
  });

  test('Logic handles an invalid column placement', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const ok = solver.checkColPlacement(puzzleString, 0, 1, '6');
    assert.isFalse(ok);
  });

  test('Logic handles a valid region (3x3 grid) placement', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const ok = solver.checkRegionPlacement(puzzleString, 0, 1, '3');
    assert.isTrue(ok);
  });

  test('Logic handles an invalid region (3x3 grid) placement', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const ok = solver.checkRegionPlacement(puzzleString, 0, 1, '5');
    assert.isFalse(ok);
  });

  test('Valid puzzle strings pass the solver', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(puzzleString);
    assert.equal(
      solution,
      '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    );
  });

  test('Invalid puzzle strings fail the solver', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....X..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(puzzleString);
    assert.equal(solution, 'No solution exists');
  });

  test('Solver returns the expected solution for an incomplete puzzle', function () {
    const puzzleString =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const expectedSolution =
      '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    const solution = solver.solve(puzzleString);
    assert.equal(solution, expectedSolution);
  });

});

