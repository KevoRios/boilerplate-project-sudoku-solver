const chai = require('chai');
let assert = chai.assert;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  this.timeout(5000);

  const validPuzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3....9..2.....9.5..7.3.18..5.2.4.9.';
  const solvedPuzzle =
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

  // 1) Solve valid puzzle
  test('Solve a puzzle with valid puzzle string: POST /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, solvedPuzzle);
        done();
      });
  });

  // 2) Missing puzzle string
  test('Solve a puzzle with missing puzzle string: POST /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  // 3) Invalid characters
  test('Solve a puzzle with invalid characters: POST /api/solve', function (done) {
    const bad = validPuzzle.replace('.', 'X');
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: bad })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  // 4) Incorrect length
  test('Solve a puzzle with incorrect length: POST /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '12345' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  // 5) Puzzle cannot be solved
  test('Solve a puzzle that cannot be solved: POST /api/solve', function (done) {
    const invalid = '9' + validPuzzle.slice(1);
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: invalid })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  // 6) Check with all fields (valid placement)
  test('Check a puzzle placement with all fields: POST /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  // 7) Single placement conflict
  test('Check a puzzle placement with single placement conflict: POST /api/check', function (done) {
    // conflicto de fila solamente
    let puzzle = '.'.repeat(81).split('');
    puzzle[0 * 9 + 4] = '5'; // A5 = 5
    puzzle = puzzle.join('');

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle,
        coordinate: 'A2', // misma fila, región distinta
        value: '5'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.deepEqual(res.body.conflict, ['row']);
        done();
      });
  });

  // 8) Multiple placement conflicts
  test('Check a puzzle placement with multiple placement conflicts: POST /api/check', function (done) {
    // conflicto fila + columna
    let puzzle = '.'.repeat(81).split('');
    puzzle[0 * 9 + 4] = '5'; // A5
    puzzle[3 * 9 + 1] = '5'; // D2
    puzzle = puzzle.join('');

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle,
        coordinate: 'A2', // A2
        value: '5'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.includeMembers(res.body.conflict, ['row', 'column']);
        done();
      });
  });

  // 9) All placement conflicts (row, column, region)
  test('Check a puzzle placement with all placement conflicts: POST /api/check', function (done) {
    let puzzle = '.'.repeat(81).split('');
    puzzle[0 * 9 + 4] = '5'; // A5 (misma fila)
    puzzle[3 * 9 + 1] = '5'; // D2 (misma columna)
    puzzle[1 * 9 + 1] = '5'; // B2 (misma región)
    puzzle = puzzle.join('');

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle,
        coordinate: 'A2',
        value: '5'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

  // 10) Missing required fields
  test('Check a puzzle placement with missing required fields: POST /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        // falta coordinate y/o value
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  // 11) Invalid characters in puzzle
  test('Check a puzzle placement with invalid characters: POST /api/check', function (done) {
    const bad = validPuzzle.replace('.', 'X');
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: bad,
        coordinate: 'A2',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  // 12) Incorrect length
  test('Check a puzzle placement with incorrect length: POST /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '12345',
        coordinate: 'A2',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  // 13) Invalid placement coordinate
  test('Check a puzzle placement with invalid placement coordinate: POST /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'Z9',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  // 14) Invalid placement value
  test('Check a puzzle placement with invalid placement value: POST /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '0'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });

});
