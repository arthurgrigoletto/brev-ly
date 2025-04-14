import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const result = await db
    .insert(schema.links)
    .values({
      originalUrl: faker.internet.url(),
      shortUrl: faker.internet.url(),
      createdAt: new Date(),
      ...overrides,
    })
    .returning()

  return result[0]
}
