import request from 'supertest';

import app from "../src/app";
import moment from "moment/moment";

describe("test index routes", () => {
    test("GET /api", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({message: "API is working!"});
            });
    });
});

jest.mock('crypto-secure-random-digit');
const mockedRandomDigits = jest.fn(() => [1, 2, 3, 4, 5, 6]);
require('crypto-secure-random-digit').randomDigits.mockImplementation(mockedRandomDigits);

describe("test login routes", () => {

    const invalidEmail : string = 'invalid@';
    const validEmail : string = 'test@test.ts';

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("POST /api/login with invalid email", () => {
        return request(app)
            .post("/api/login")
            .send({email: invalidEmail})
            .expect(422)
            .then(response => {
                expect(response.body).toEqual({message: "Invalid email"});
            });
    });

    test("POST /api/login with valid email", () => {
        return request(app)
            .post("/api/login")
            .send({email: validEmail})
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({message: "Please confirm otp"});
            });
    });

    test("POST /api/login/confirm with invalid email", () => {
        return request(app)
            .post("/api/login/confirm")
            .send({email: invalidEmail})
            .expect(422)
            .then(response => {
                expect(response.body).toEqual({message: "Invalid email"});
            });
    });

    test("POST /api/login/confirm with invalid otp length", () => {
        return request(app)
            .post("/api/login/confirm")
            .send({email: validEmail, otp: '123'})
            .expect(422)
            .then(response => {
                expect(response.body).toEqual({message: "Invalid otp"});
            });
    });

    test("POST /api/login/confirm with invalid otp", () => {
        return request(app)
            .post("/api/login/confirm")
            .send({email: validEmail, otp: '123123'})
            .expect(400)
            .then(response => {
                expect(response.body).toEqual({message: "Invalid otp"});
            });
    });

    test("POST /api/login/confirm with non-existing user and valid otp", () => {
        return request(app)
            .post("/api/login/confirm")
            .send({email: 'test999@test.ts', otp: '123456'})
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({message: "Not found"});
            });
    });

    test("POST /api/login/confirm with expired otp", () => {
        const specificDate = moment().add(4, 'minutes');
        jest.spyOn(moment, 'now').mockImplementation(() => specificDate.valueOf());

        return request(app)
            .post("/api/login/confirm")
            .send({email: validEmail, otp: '123456'})
            .expect(400)
            .then(response => {
                expect(response.body).toEqual({message: "Expired otp"});
            });
    });

    test("POST /api/login/confirm with valid otp", () => {
        return request(app)
            .post("/api/login/confirm")
            .send({email: validEmail, otp: '123456'})
            .expect(200)
            .then(response => {
                expect(response.body).toHaveProperty('token');
                (global as any).sharedUserEmail = validEmail;
                (global as any).sharedToken = response.body.token;
            });
    });
});

