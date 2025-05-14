import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/index.js'; // Path to your AppRouter type, with .js extension

export const trpc = createTRPCReact<AppRouter>();
