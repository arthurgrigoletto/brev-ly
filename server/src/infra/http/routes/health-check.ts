import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const healthCheckRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/health',
    {
      schema: {
        summary: 'Get application health',
        tags: ['health-check'],
        response: {
          200: z.object({
            message: z.enum(['ok']),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send({ message: 'ok' })
    }
  )
}
