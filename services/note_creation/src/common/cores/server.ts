import { InversifyExpressServer } from "inversify-express-utils";

import { container } from "@/common/cores/container";

export const server = new InversifyExpressServer(container);
