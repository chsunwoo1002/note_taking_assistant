import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../../../../src/common/models/serviceResponse";

describe("ServiceResponse", () => {
  describe("success", () => {
    it("should create a successful response with default status code", () => {
      const response = ServiceResponse.success("Operation successful", {
        id: 1,
      });

      expect(response.success).toBe(true);
      expect(response.message).toBe("Operation successful");
      expect(response.data).toEqual({ id: 1 });
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("should create a successful response with custom status code", () => {
      const response = ServiceResponse.success(
        "Created",
        { id: 2 },
        StatusCodes.CREATED,
      );

      expect(response.success).toBe(true);
      expect(response.message).toBe("Created");
      expect(response.data).toEqual({ id: 2 });
      expect(response.statusCode).toBe(StatusCodes.CREATED);
    });
  });

  describe("failure", () => {
    it("should create a failure response with default status code", () => {
      const response = ServiceResponse.failure("Operation failed", null);

      expect(response.success).toBe(false);
      expect(response.message).toBe("Operation failed");
      expect(response.data).toBeNull();
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should create a failure response with custom status code", () => {
      const response = ServiceResponse.failure(
        "Not Found",
        null,
        StatusCodes.NOT_FOUND,
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe("Not Found");
      expect(response.data).toBeNull();
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
