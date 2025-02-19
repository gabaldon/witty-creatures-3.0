import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { PLAYER_MINT_TIMESSTAMP } from '../constants'
import { PlayerRepository } from '../repositories/player'
import { Player, ClaimPlayerParams } from '../types'
import { isTimeToMint } from '../utils'

const authentication: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const repository = new PlayerRepository(fastify.mongo.db)

  fastify.post<{ Body: ClaimPlayerParams; Reply: Player | Error }>('/auth', {
    schema: {
      body: ClaimPlayerParams,
      response: {
        200: Player,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: ClaimPlayerParams }>,
      reply
    ) => {
      // Check 0: check if game is over
      if (PLAYER_MINT_TIMESSTAMP && isTimeToMint())
        return reply
          .status(403)
          .send(new Error(`Claiming is not possible because the game is over.`))

      const key = request.body.key
      const player = await repository.get(key)

      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${key})`))
      }

      if (player.token) {
        return reply
          .status(405)
          .send(new Error(`Player has already been claimed (key ${key})`))
      }

      const token = fastify.jwt.sign({ id: key })

      try {
        return reply.status(200).send(
          await repository.update({
            ...player,
            token,
          })
        )
      } catch (error) {
        reply.status(409).send(error as Error)
      }
    },
  })
}

export default authentication
