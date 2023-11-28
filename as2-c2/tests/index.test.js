const request = require("supertest");
const index = require("../index");
const { Firestore, Timestamp } = require('@google-cloud/firestore');

const requestData = {
    body: {
        email: "test@test.com",
        password: "test"
    }
};

jest.mock('@google-cloud/firestore', () => ({
    Firestore: jest.fn().mockImplementation(() => ({
        collection: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn()
            .mockReturnValueOnce({ empty: false, docs: [{ data: () => ({ Name: 'test', Email: 'test@test.com' }) }] })
            .mockReturnValueOnce({
                id: 1, empty: false, docs: [{
                    data: () => ({
                        Name: 'test', Email: 'test@test.com', state: "offline", timeStamp: ({
                            seconds: 1627776000,
                            nanoseconds: 0,
                        })
                    })
                }]
            })
            .mockReturnValueOnce({ empty: false, docs: [{ data: () => ({ Name: 'test', Email: 'test@test.com' }) }] })
            .mockReturnValueOnce({
                empty: true
            })
            .mockReturnValue({ empty: true, docs: [{ data: () => ({ }) }] }),
        add: jest.fn(),
        doc: jest.fn().mockReturnThis(),
        set: jest.fn(),
    })),
    Timestamp: {
        now: jest.fn(() => ({
          seconds: 1627776000,
          nanoseconds: 0,
        }))
      },
}));

describe("Test the /login path", () => {

    test("should authenticate a user successfully", async () => {

        const response = await request(index)
            .post('/login')
            .send(requestData.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            login: 'Successfull',
            Name: 'test',
            Email: 'test@test.com',
        });
    });

    test("should authenticate a user successfully and add new doc in state collection", async () => {

        const response = await request(index)
            .post('/login')
            .send(requestData.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            login: 'Successfull',
            Name: 'test',
            Email: 'test@test.com',
        });
    });

    test("should not authenticate a user", async () => {

        const response = await request(index)
            .post('/login')
            .send(requestData.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            login: "Authentication failed."
        });
    });
})