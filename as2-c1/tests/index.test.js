const request = require("supertest");
const index = require("../index");
const { Firestore } = require('@google-cloud/firestore');

const requestData = {
    body: {
        name: "test",
        email: "test@test.com",
        password: "test",
        location: "halifax"
    }
}

jest.mock('@google-cloud/firestore', () => ({
    Firestore: jest.fn().mockImplementation(() => ({
      collection: jest.fn().mockReturnThis(),
      add: jest.fn(),
    })),
}));

describe("Test the /register path", () => {

    test("should register a user successfully", async () => {

        const response = await request(index)
          .post('/register')
          .send(requestData.body);
        
        expect(response.text).toBe("User registered successfully.");
    });
});