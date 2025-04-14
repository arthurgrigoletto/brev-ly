import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { getLinks } from './get-links'

describe('get links', () => {
  it('should be able to get all links', async () => {
    for (let i = 0; i < 5; i++) {
      await makeLink()
    }

    const sut = await getLinks({})

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toHaveLength(4)
  })
})
