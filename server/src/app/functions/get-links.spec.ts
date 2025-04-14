import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { getLinks } from './get-links'

describe('get links', () => {
  it('should be able to get all links', async () => {
    await db.delete(schema.links)

    const link1 = await makeLink({
      shortUrl: `short-url-1-${new Date().getTime()}`,
    })
    const link2 = await makeLink({
      shortUrl: `short-url-2-${new Date().getTime()}`,
    })
    const link3 = await makeLink({
      shortUrl: `short-url-3-${new Date().getTime()}`,
    })
    const link4 = await makeLink({
      shortUrl: `short-url-4-${new Date().getTime()}`,
    })
    const link5 = await makeLink({
      shortUrl: `short-url-5-${new Date().getTime()}`,
    })

    let sut = await getLinks({})

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
    ])

    sut = await getLinks({
      page: 2,
    })

    expect(unwrapEither(sut).links).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: link1.id })])
    )
  })
})
