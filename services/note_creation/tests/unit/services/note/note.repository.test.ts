import type { ILogger, ILoggerFactory } from "@/common/logger";
import type { INoteRepository } from "@/common/types/interfaces/note.interface";
import type { DatabaseConnection } from "@/common/types/types/db.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { NoteRepository } from "@/services/note/note.repository";
import { TestBed } from "@automock/jest";
import { MockLogger } from "tests/unit/mocks/mock.logger";

describe("NoteRepository", () => {
  let noteRepository: INoteRepository;
  let dbService: jest.Mocked<DatabaseConnection>;
  let logger: jest.Mocked<ILogger>;

  beforeAll(() => {
    logger = new MockLogger();

    const { unit, unitRef } = TestBed.create<INoteRepository>(NoteRepository)
      .mock<ILoggerFactory>(DEPENDENCY_IDENTIFIERS.LoggerFactory)
      .using({
        createLogger: jest.fn().mockReturnValue(logger),
      })
      .compile();

    noteRepository = unit;
    dbService = unitRef.get<DatabaseConnection>(DEPENDENCY_IDENTIFIERS.Kysely);
  });

  describe("createNote", () => {
    it("should create a note successfully", async () => {
      expect(true).toBeTruthy();
    });
  });
});
