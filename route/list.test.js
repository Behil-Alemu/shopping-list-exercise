process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");

let olives = {name:"olives",price:1.87 };

beforeEach(function () {
  items.push(olives);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [olives] })
  })
})

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${olives.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ list: olives })
  })
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/soup`);
    expect(res.statusCode).toBe(404)
  })
})

describe("POST /items", () => {
  test("Adding in item", async () => {
    const res = await request(app).post("/items").send({ name: "coffee", price:6.99});
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ list: { name: "coffee" , price:6.99} });
  })
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  })
})

describe("/PATCH /items/:name", () => {
  test("Editing a item name", async () => {
    const res = await request(app).patch(`/items/${olives.name}`).send({ name: "olives", price: 2.87 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ list: { name: "olives", price: 2.87 } });
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/rice`).send({ name: "candy" });
    expect(res.statusCode).toBe(404);
  })
})

describe("/DELETE /items/:name", () => {
  test("Deleting a item", async () => {
    const res = await request(app).delete(`/items/${olives.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted item' })
  })
  test("Responds with 404 for removing invalid item", async () => {
    const res = await request(app).delete(`/items/turkey`);
    expect(res.statusCode).toBe(404);
  })
})



