import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { asc, count, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { EntityNotFound } from './errors/entity-not-found'

const getOriginalUrlInput = z.object({
  linkId: z.string(),
})

type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>

export async function getOriginalUrl(
  input: GetOriginalUrlInput
): Promise<Either<EntityNotFound, { originalUrl: string }>> {
  const { linkId } = getOriginalUrlInput.parse(input)

  const [link] = await db
    .select({
      originalUrl: schema.links.originalUrl,
      accessCount: schema.links.accessCount,
    })
    .from(schema.links)
    .where(eq(schema.links.shortUrl, linkId))
    .limit(1)

  if (!link) {
    return makeLeft(new EntityNotFound('Link'))
  }

  await db
    .update(schema.links)
    .set({
      accessCount: link.accessCount + 1,
    })
    .where(eq(schema.links.shortUrl, linkId))

  return makeRight({ originalUrl: link.originalUrl })
}
