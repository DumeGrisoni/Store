/* eslint-disable no-var */

import { PrismaClient } from './generated/prisma';

declare global {
  var prismadb: PrismaClient | undefined;
}

const prismadb = new PrismaClient();

export default prismadb;

if (process.env.NODE_ENV !== 'production') globalThis.prismadb = prismadb;
