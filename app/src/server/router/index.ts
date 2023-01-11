// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { registerRouter } from "./register";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("auth.", registerRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
