const request = require("supertest");
const index = require("../index");
const { Firestore, Timestamp } = require('@google-cloud/firestore');

const requestData = {
    body: {
        email: "test@test.com",
        name: "test"
    }
};

jest.mock('@google-cloud/firestore', () => ({
    Firestore: jest.fn().mockImplementation(() => ({
        collection: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn()
            .mockReturnValueOnce([{ empty: false, data: () => ({ Name: "test", Email: "test@test.com" })} ])
            .mockReturnValueOnce({empty: true, data: [] })
            .mockReturnValueOnce({
                id: 1, empty: false, docs: [{
                    data: () => ({
                        Name: 'test', Email: 'test@test.com', state: "online", timeStamp: ({
                            seconds: 1627776000,
                            nanoseconds: 0,
                        })
                    })
                }]
            })
            .mockReturnValue({ empty: true, docs: [{ data: () => ({}) }] })
        ,
        add: jest.fn(),
        doc: jest.fn().mockReturnThis(),
        set: jest.fn(),
        update: jest.fn(),
    })),
    Timestamp: {
        now: jest.fn(() => ({
            seconds: 1627776000,
            nanoseconds: 0,
        }))
    },
}));

describe("Test for /users route", () => {

    test("Should return array of users", async () => {

        const response = await request(index)
            .get("/users");

        expect(response.status).toBe(200);
        expect(response.body.users.length).toEqual(1);
    })

    test("Should return empty array of users", async () => {

        const response = await request(index)
            .get("/users");

        expect(response.status).toBe(200);
        expect(response.body.users.length).toEqual(0);
    })
});

describe("Test for /logout route", () => {

    test("Should return logout successfull", async () => {

        const response = await request(index)
            .post('/logout')
            .send(requestData.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            logout: "Successfull"
        });

    })

})