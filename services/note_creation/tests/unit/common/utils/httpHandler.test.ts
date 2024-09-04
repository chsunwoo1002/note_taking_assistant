import { ServiceResponse } from "@/common/models/serviceResponse";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

describe("httpHandler", () => {
  describe("handleServiceResponse", () => {
    it("should send the service response with the correct status code", () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const serviceResponse = ServiceResponse.success(
        "Test data",
        StatusCodes.OK,
      );
      handleServiceResponse(serviceResponse, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(serviceResponse);
    });
  });

  describe("validateRequest", () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
      }),
    });

    it("should call next() when validation passes", () => {
      const req = { body: { name: "John" } };
      const res = {};
      const next = jest.fn();

      validateRequest(schema)(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return a failure response when validation fails", () => {
      const req = { body: { name: 123 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();

      validateRequest(schema)(req as any, res as any, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("Invalid input"),
        }),
      );
    });
  });
});
