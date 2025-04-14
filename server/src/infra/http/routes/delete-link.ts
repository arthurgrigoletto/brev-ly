import { deleteLink } from '@/app/functions/delete-link'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/links/:linkId',
    {
      schema: {
        summary: 'Create a new link',
        tags: ['links'],
        params: z.object({
          linkId: z.string().uuid(),
        }),
        response: {
          204: z.null().describe('Link deleted successfully'),
          404: z.object({ message: z.string() }).describe('Link not found'),
        },
      },
    },
    async (request, reply) => {
      const { linkId } = request.params

      const result = await deleteLink({
        linkId,
      })

      if (isRight(result)) {
        return reply.status(204).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'EntityNotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
