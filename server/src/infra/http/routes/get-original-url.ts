import { getOriginalUrl } from '@/app/functions/get-original-url'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/:linkId',
    {
      schema: {
        summary: 'Get original url of a link',
        tags: ['links'],
        params: z.object({
          linkId: z.string(),
        }),
        response: {
          200: z.object({
            originalUrl: z.string().url(),
          }),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Link not found'),
        },
      },
    },
    async (request, reply) => {
      const { linkId } = request.params

      const result = await getOriginalUrl({
        linkId,
      })

      if (isRight(result)) {
        const { originalUrl } = unwrapEither(result)

        return reply.status(200).send({ originalUrl })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'EntityNotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
