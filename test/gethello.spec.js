const chai = require("chai");
const chaiHttp = require("chai-http");
const { init } = require("../index");

const { expect } = chai;
chai.use(chaiHttp);

describe("Hapi.js Server Tests", () => {
  let server;

  // Initialize the server before tests
  beforeEach(async () => {
   
    
    server = await init();
  });
  afterEach(async () => {
   
    await server.stop() 
  });
  
  it("should return a success message on GET /", async () => {
    const res = await chai.request(server.listener).get("/hello");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("message", "Hello, Hapi!");
  });
  it("check runing port", async () => {
    let port = server.info.port;
    expect(port).to.be.equal(3000)
  });
});

