import { getLinks } from '@/app/functions/get-links'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get all links',
        tags: ['links'],
        querystring: z.object({
          page: z.coerce.number().default(1),
          pageSize: z.coerce.number().default(4),
        }),
        response: {
          200: z.object({
            links: z
              .array(
                z.object({
                  id: z.string(),
                  originalUrl: z.string().url(),
                  shortUrl: z.string(),
                  createdAt: z.date(),
                })
              )
              .describe('A list of links'),
            total: z.number().describe('Total number of links'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize } = request.query

      const result = await getLinks({
        page,
        pageSize,
      })

      const { total, links } = unwrapEither(result)

      return reply.status(200).send({ total, links })
    }
  )
}
