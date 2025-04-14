import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { EntityNotFound } from './errors/entity-not-found'
import { getOriginalUrl } from './get-original-url'

describe('get original url', () => {
  it('should be able to get original url of a link and increment access count', async () => {
    const linkId = randomUUID()

    const link = await makeLink({
      id: linkId,
      accessCount: 0,
    })

    const sut = await getOriginalUrl({
      linkId,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      originalUrl: link.originalUrl,
    })

    const [linkAfter] = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, linkId))
      .limit(1)

    expect(linkAfter.accessCount).toBe(1)
  })

  it('should not be able to get original url of a link that does not exist', async () => {
    const sut = await getOriginalUrl({
      linkId: randomUUID(),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(EntityNotFound)
  })
})
