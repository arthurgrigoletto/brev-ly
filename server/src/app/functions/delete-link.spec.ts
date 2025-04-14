import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { deleteLink } from './delete-link'
import { EntityNotFound } from './errors/entity-not-found'

describe('delete link', () => {
  it('should be able to delete a link', async () => {
    const linkId = randomUUID()

    await makeLink({
      id: linkId,
    })

    const sut = await deleteLink({
      linkId,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeNull()
  })

  it('should not be able to delete a link that does not exist', async () => {
    const sut = await deleteLink({
      linkId: randomUUID(),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(EntityNotFound)
  })
})
