test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
  const bad = validPuzzle.replace('.', 'X');
  const res = solver.validate(bad);
  assert.equal(res, 'Invalid characters in puzzle');
});

test('Logic handles a valid region (3x3 grid) placement', function () {
  let puzzle = '.'.repeat(81).split('');
  puzzle[4 * 9 + 4] = '5';
  puzzle = puzzle.join('');
  const ok = solver.checkRegionPlacement(puzzle, 3, 3, '3');
  assert.isTrue(ok);
});

test('Logic handles an invalid region (3x3 grid) placement', function () {
  let puzzle = '.'.repeat(81).split('');
  puzzle[4 * 9 + 4] = '5';
  puzzle = puzzle.join('');
  const ok = solver.checkRegionPlacement(puzzle, 3, 3, '5');
  assert.isFalse(ok);
});
