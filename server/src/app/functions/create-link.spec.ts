import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { createLink } from './create-link'
import { InvalidShortUrl } from './errors/invalid-short-url'
import { UniqueEntityError } from './errors/unique-entity'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const sut = await createLink({
      originalUrl: faker.internet.url(),
      shortUrl: `test-${new Date().getTime()}`,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ linkId: expect.any(String) })
  })

  it('should not be able to create a link with an invalid short url', async () => {
    const sut = await createLink({
      originalUrl: faker.internet.url(),
      shortUrl: '&30#!!@',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidShortUrl)
  })

  it('should not be able to create a link with the same short url', async () => {
    const shortUrl = faker.string.sample()

    await makeLink({ shortUrl })

    const sut = await createLink({
      originalUrl: faker.internet.url(),
      shortUrl,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(UniqueEntityError)
  })
})
