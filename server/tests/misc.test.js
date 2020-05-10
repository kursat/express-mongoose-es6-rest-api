/* eslint-disable no-undef */
import chai from 'chai';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import app from '../../server';

const {expect} = chai;

chai.config.includeStack = true;

const authUser = {
    email: 'sample.user@domain.com',
    password: '123456',
};

let jwtToken;

before((done) => {
    request(app)
        .post('/api/auth/login')
        .send(authUser)
        .then((res) => {
            jwtToken = `Bearer ${res.body.token}`;
            done();
        })
        .catch(done);
});

describe('## Misc', () => {
    describe('# GET /api/health-check', () => {
        it('should return OK', (done) => {
            request(app)
                .get('/api/health-check')
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.text).to.equal('OK');
                    done();
                })
                .catch(done);
        });
    });

    describe('# GET /api/404', () => {
        it('should return 404 status', (done) => {
            request(app)
                .get('/api/404')
                .expect(httpStatus.NOT_FOUND)
                .then((res) => {
                    expect(res.body.message).to.equal('Not Found');
                    done();
                })
                .catch(done);
        });
    });

    describe('# Error Handling', () => {
        it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
            request(app)
                .get('/api/users/56z787zzz67fc')
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then((res) => {
                    expect(res.body.message).to.equal('Internal Server Error');
                    done();
                })
                .catch(done);
        });

        it('should handle express validation error - email is required', (done) => {
            request(app)
                .post('/api/users')
                .set('Authorization', jwtToken)
                .send({
                    password: '1234567890',
                })
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.message).to.equal('"email" is required');
                    done();
                })
                .catch(done);
        });
    });
});
