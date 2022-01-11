// During the test the env variable is set to test
process.env.NODE_ENV = "test";

// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");

const should = chai.should();

chai.use(chaiHttp);
// Our parent block
describe("TopPerformersModule API Test", () => {
  /*
   * Test the /GET route
   */
  describe("/GET ping", () => {
    it("it should GET 'pong'", (done) => {
      chai
        .request(server)
        .get("/api/topPerformers/ping")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST topFiveGainersAndLosers", () => {
    it("it POST a timeFrame and get five Gainer Instruments as results", (done) => {
      const timeFrame = {
        fromDate: "2021-11-01",
        toDate: "2021-11-07",
      };
      chai
        .request(server)
        .post("/api/topPerformers/topGainers")
        .send(timeFrame)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(5);
          console.log(res.body);
          done();
        });
    });

    it("it POST a timeFrame without 'fromDate' and gets error 400 and message 'Missing required fromDate or toDate fields.'", (done) => {
      const timeFrame = {
        toDate: "2021-11-07",
      };
      chai
        .request(server)
        .post("/api/topPerformers/topFiveGainersAndLosers")
        .send(timeFrame)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").equal("Missing required fromDate or toDate fields.")
          done();
        });
    });

    it("it POST a timeFrame and 'fromDate' is greater than 'toDate' and gets error 400 and message 'fromDate field should be less than or equal to toDate field.'", (done) => {
      const timeFrame = {
        fromDate: "2022-11-01",
        toDate: "2021-11-07",
      };
      chai
        .request(server)
        .post("/api/topPerformers/topFiveGainersAndLosers")
        .send(timeFrame)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").eql("fromDate field should be less than or equal to toDate field.");
          done();
        });
    });

    it("it POST a timeFrame and get five Gainer And Losers Instruments as results and should have 'Losers' and 'Gainers' properties.", (done) => {
      const timeFrame = {
        fromDate: "2021-11-07",
        toDate: "2021-11-20",
      };
      chai
        .request(server)
        .post("/api/topPerformers/topFiveGainersAndLosers")
        .send(timeFrame)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("losers");
          res.body.should.have.property("gainers");
          done();
        });
    });
  });
});
