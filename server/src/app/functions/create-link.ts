import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { cleanString } from '@/shared/utils'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { InvalidShortUrl } from './errors/invalid-short-url'
import { UniqueEntityError } from './errors/unique-entity'

const createLinkInput = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<UniqueEntityError | InvalidShortUrl, { linkId: string }>> {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  if (!cleanString(shortUrl)) {
    return makeLeft(new InvalidShortUrl())
  }

  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .limit(1)

  if (link) {
    return makeLeft(new UniqueEntityError('Link'))
  }

  const [{ linkId }] = await db
    .insert(schema.links)
    .values({
      originalUrl,
      shortUrl,
    })
    .returning({ linkId: schema.links.id })

  return makeRight({ linkId })
}
