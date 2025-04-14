import { createLink } from '@/app/functions/create-link'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/links',
    {
      schema: {
        summary: 'Create a new link',
        tags: ['links'],
        body: z.object({
          originalUrl: z.string().url(),
          shortUrl: z.string(),
        }),
        response: {
          201: z
            .object({
              linkId: z.string(),
            })
            .describe('Link created successfully'),
          409: z
            .object({ message: z.string() })
            .describe('Link already exists'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const result = await createLink({
        originalUrl,
        shortUrl,
      })

      if (isRight(result)) {
        const { linkId } = unwrapEither(result)
        return reply.status(201).send({ linkId })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'UniqueEntityError':
          return reply.status(409).send({ message: error.message })
        case 'InvalidShortUrl':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
