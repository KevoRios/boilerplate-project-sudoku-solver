const chai = require('chai');
let assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver = new SudokuSolver();

suite('Unit Tests', function () {

  const validPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3....9..2.....9.5..7.3.18..5.2.4.9.';
  const solvedPuzzle =
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

  test('Logic handles a valid puzzle string of 81 characters', function () {
    const res = solver.validate(validPuzzle);
    assert.isNull(res);
  });

  test('Logic handles a puzzle string with invalid characters', function () {
    const bad = validPuzzle.replace('.', 'X');
    const res = solver.validate(bad);
    assert.equal(res, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    const short = '12345';
    const res = solver.validate(short);
    assert.equal(res, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', function () {
    let puzzle = '.'.repeat(81).split('');
    // poner un 5 en fila 0, col 4
    puzzle[0 * 9 + 4] = '5';
    puzzle = puzzle.join('');
    const ok = solver.checkRowPlacement(puzzle, 0, 0, '3');
    assert.isTrue(ok);
  });

  test('Logic handles an invalid row placement', function () {
    let puzzle = '.'.repeat(81).split('');
    // 5 ya está en la fila 0, columna 4
    puzzle[0 * 9 + 4] = '5';
    puzzle = puzzle.join('');
    const ok = solver.checkRowPlacement(puzzle, 0, 0, '5');
    assert.isFalse(ok);
  });

  test('Logic handles a valid column placement', function () {
    let puzzle = '.'.repeat(81).split('');
    // 5 en fila 4, col 0
    puzzle[4 * 9 + 0] = '5';
    puzzle = puzzle.join('');
    const ok = solver.checkColPlacement(puzzle, 0, 0, '3');
    assert.isTrue(ok);
  });

  test('Logic handles an invalid column placement', function () {
    let puzzle = '.'.repeat(81).split('');
    // 5 en fila 4, col 0
    puzzle[4 * 9 + 0] = '5';
    puzzle = puzzle.join('');
    const ok = solver.checkColPlacement(puzzle, 0, 0, '5');
    assert.isFalse(ok);
  });

  test('Logic handles a valid region (3x3) placement', function () {
    let puzzle = '.'.repeat(81).split('');
    // 5 en región central (fila 4, col 4)
    puzzle[4 * 9 + 4] = '5';
    puzzle = puzzle.join('');
    const ok = solver.checkRegionPlacement(puzzle, 3, 3, '3'); // otra celda de la región
    assert.isTrue(ok);
  });

  test('Logic handles an invalid region (3x3) placement', function () {
    let puzzle = '.'.repeat(81).split('');
    // 5 en región central (fila 4, col 4)
    puzzle[4 * 9 + 4] = '5';
    puzzle = puzzle.join('');
    const ok = solver.checkRegionPlacement(puzzle, 3, 3, '5');
    assert.isFalse(ok);
  });

  test('Valid puzzle strings pass the solver', function () {
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution.length, 81);
  });

  test('Invalid puzzle strings fail the solver', function () {
    const invalid = '9' + validPuzzle.slice(1); // forzamos conflicto
    const result = solver.solve(invalid);
    assert.property(result, 'error');
    assert.equal(result.error, 'Puzzle cannot be solved');
  });

  test('Solver returns the expected solution for an incomplete puzzle', function () {
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution, solvedPuzzle);
  });

});
