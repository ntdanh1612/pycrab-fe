import pkg from '@prisma/client'
type PrismaClient = pkg.PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}
