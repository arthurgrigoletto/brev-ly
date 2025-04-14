import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { EntityNotFound } from './errors/entity-not-found'

const deleteLinkInput = z.object({
  linkId: z.string().uuid(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<EntityNotFound, null>> {
  const { linkId } = deleteLinkInput.parse(input)

  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.id, linkId))
    .limit(1)

  if (!link) {
    return makeLeft(new EntityNotFound('Link'))
  }

  await db.delete(schema.links).where(eq(schema.links.id, linkId))

  return makeRight(null)
}
