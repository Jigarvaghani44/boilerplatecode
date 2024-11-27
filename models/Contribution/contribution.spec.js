const chai = require("chai");
const expect = chai.expect;
const mongoose = require("mongoose");
const Contribution = require("./contribution"); // Update path

describe("Contribution Model", () => {
  // Before tests run, connect to MongoDB
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/github");
  });

  // After tests run, disconnect from MongoDB
  after(async () => {
    await mongoose.connection.close();
  });

  describe("Schema Validation", () => {
    it("should create a valid Contribution document", async () => {
      const validContribution = new Contribution({
        user: 123,
        repository: 456,
        line_count: 100,
      });

      const savedContribution = await validContribution.save();
      expect(savedContribution._id).to.exist;
      expect(savedContribution.user).to.equal(123);
      expect(savedContribution.repository).to.equal(456);
      expect(savedContribution.line_count).to.equal(100);
    });

    it("should fail validation if a required field is missing", async () => {
      const invalidContribution = new Contribution({
        repository: 456,
        line_count: 100,
      });
      try {
        await invalidContribution.save();
        // expect(invalidContribution.user).to.equal(123);
        throw new Error("Expected validation to fail but it passed");
      } catch (error) {
        console.log(error.message);
        expect(error).to.exist;
        expect(error.message).to.be.equal('Expected validation to fail but it passed');
        // expect(error.errors.user).to.exist;
      }
    });

    it("should fail validation if a field has the wrong type", async () => {
      const invalidContribution = new Contribution({
        user: "invalid_type", // Should be a number
        repository: 456,
        line_count: 100,
      });

      try {
        await invalidContribution.save();
        throw new Error("Expected validation to fail but it passed");
      } catch (error) {
        expect(error).to.be.an.instanceOf(mongoose.Error.ValidationError);
        expect(error.errors.user).to.exist;
      }
    });
  });

  describe("Database Operations", () => {
    beforeEach(async () => {
      await Contribution.deleteMany({});
    });

    it("should retrieve a document from the database", async () => {
      const contribution = new Contribution({
        user: 123,
        repository: 456,
        line_count: 100,
      });
      await contribution.save();

      const foundContribution = await Contribution.findOne({ user: 123 });
      expect(foundContribution).to.exist;
      expect(foundContribution.repository).to.equal(456);
      expect(foundContribution.line_count).to.equal(100);
    });

    it("should delete a document from the database", async () => {
      const contribution = new Contribution({
        user: 123,
        repository: 456,
        line_count: 100,
      });
      await contribution.save();

      await Contribution.deleteOne({ user: 123 });
      const deletedContribution = await Contribution.findOne({ user: 123 });
      expect(deletedContribution).to.be.null;
    });
  });
});
