const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('Solve a puzzle with valid puzzle string: POST /api/solve', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.solution,
          '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
        );
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST /api/solve', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST /api/solve', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({
        puzzle: '1.5..2.84..63.12.X.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST /api/solve', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'
      }) // 80 chars
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST /api/solve', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({
        puzzle:
          '5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A1',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A1',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A1',
        value: '2'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A1',
        value: '1'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        // falta coordinate y value
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.X.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A1',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37', // 80 chars
        coordinate: 'A1',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'J1', // fila inválida
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A1',
        value: 'X' // valor inválido
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});
