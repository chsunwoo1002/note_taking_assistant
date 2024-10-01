import { z } from "zod";

const contentIdsSchema = z.tuple([z.string().uuid()]).rest(z.string().uuid());

export { contentIdsSchema };
