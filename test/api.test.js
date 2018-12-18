let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

const app = require('../src/app');

chai.use(chaiHttp);

describe('Integration test example', function () {
    it('get /', (done) => {
        chai.request(app)
            .get('/')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
    it('get salute', (done) => {
        chai.request(app)
            .get('/')
            .end(function (err, res) {

                expect(res.body).to.have.property('hi').to.be.equal('there');

                expect(res).to.have.status(200);

                done();
            });
    });
});