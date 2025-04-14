import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { asc, count, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import type { EntityNotFound } from './errors/entity-not-found'

const getLinksInput = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(4),
})

type GetLinksInput = z.input<typeof getLinksInput>

type GetLinksOutput = {
  links: {
    id: string
    originalUrl: string
    shortUrl: string
    createdAt: Date
  }[]
  total: number
}

export async function getLinks(
  input: GetLinksInput
): Promise<Either<null, GetLinksOutput>> {
  const { page, pageSize } = getLinksInput.parse(input)

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .orderBy(fields => {
        return desc(fields.id)
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db.select({ total: count(schema.links.id) }).from(schema.links),
  ])

  return makeRight({ links, total })
}
