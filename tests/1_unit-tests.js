const chai = require('chai');
let assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver = new SudokuSolver();

suite('Unit Tests', function () {

  const validPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solvedPuzzle =
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

  // 1) valid puzzle 81 chars
  test('Logic handles a valid puzzle string of 81 characters', function () {
    const res = solver.validate(validPuzzle);
    assert.isNull(res);
  });

  // 2) invalid characters
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
    const bad = validPuzzle.replace('.', 'X');
    const res = solver.validate(bad);
    assert.equal(res, 'Invalid characters in puzzle');
  });

  // 3) wrong length
  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    const short = validPuzzle.slice(0, 80);
    const res = solver.validate(short);
    assert.equal(res, 'Expected puzzle to be 81 characters long');
  });

  // 4) valid row placement
  test('Logic handles a valid row placement', function () {
    const ok = solver.checkRowPlacement(validPuzzle, 0, 1, '3');
    assert.isTrue(ok);
  });

  // 5) invalid row placement
  test('Logic handles an invalid row placement', function () {
    const ok = solver.checkRowPlacement(validPuzzle, 0, 1, '1'); // ya hay un "1" en esa fila
    assert.isFalse(ok);
  });

  // 6) valid column placement
  test('Logic handles a valid column placement', function () {
    const ok = solver.checkColPlacement(validPuzzle, 0, 1, '3');
    assert.isTrue(ok);
  });

  // 7) invalid column placement
  test('Logic handles an invalid column placement', function () {
    const ok = solver.checkColPlacement(validPuzzle, 0, 1, '6'); // 6 ya está en esa columna
    assert.isFalse(ok);
  });

  // 8) valid region placement
  test('Logic handles a valid region (3x3 grid) placement', function () {
    const ok = solver.checkRegionPlacement(validPuzzle, 0, 1, '3');
    assert.isTrue(ok);
  });

  // 9) invalid region placement
  test('Logic handles an invalid region (3x3 grid) placement', function () {
    const ok = solver.checkRegionPlacement(validPuzzle, 0, 1, '5'); // 5 ya está en esa región
    assert.isFalse(ok);
  });

  // 10) valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', function () {
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution.length, 81);
  });

  // 11) invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', function () {
    const invalid = '9' + validPuzzle.slice(1); // forzamos conflicto
    const result = solver.solve(invalid);
    assert.property(result, 'error');
    assert.equal(result.error, 'Puzzle cannot be solved');
  });

  // 12) solver returns expected solution
  test('Solver returns the expected solution for an incomplete puzzle', function () {
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution, solvedPuzzle);
  });

});

