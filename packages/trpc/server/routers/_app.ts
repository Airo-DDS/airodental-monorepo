import { router, publicProcedure } from '../trpc.js';

// You can define your routers here
const exampleRouter = router({
  hello: publicProcedure.query(() => {
    return { greeting: 'hello from tRPC' };
  }),
});

export const appRouter = router({
  example: exampleRouter,
  // health: publicProcedure.query(() => "ok"), // Example health check
});

export type AppRouter = typeof appRouter;
