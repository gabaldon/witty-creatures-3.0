import { CollectionInfo, Db } from 'mongodb'
import Fastify from 'fastify'
import { app } from '../src/app'
import { FastifyInstance } from 'fastify'

let server: FastifyInstance

const { MongoClient } = require('mongodb');


let client;
let db;

beforeAll(async () => {
  client = await MongoClient.connect('mongodb://username:password@localhost:27017/database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = await client.db('database');
});

afterAll(async () => {
  await client.close();
});



beforeEach(async () => {
  // Drop mongodb collections
  try {
    const collections = await db.listCollections()
    let info: CollectionInfo | null

    while (await collections.hasNext()) {
      info = await collections.next()
      if (info) {
        await db.dropCollection(info.name)
      }
    }
  } catch (err) {
    console.error('Error dropping mongo', err)
  }

  server = Fastify().register(app)
})

afterAll(async () => {
  await client.close()
})

afterEach(async () => {
  await server.close()
})

async function authenticatePlayer(key: string): Promise<string> {
  return await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: '/auth',
        payload: { key },
      },
      (err, response) => {
        resolve(response.json().token)
      }
    )
  })
}

async function serverInject(
  opts: {},
  cb: (error: any, result: any) => Promise<void> | void
): Promise<null> {
  return new Promise((resolve, reject) => {
    server.inject(opts, async (error, result) => {
      await cb(error, result)

      return resolve(null)
    })
  })
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    return setTimeout(() => {
      return resolve(null)
    }, ms)
  })
}

const initialPlayers = [
  {
    key: 'ef12efbd765f9ad3',
    username: 'planned-orangutan',
  },
  {
    key: 'b75c34545e8cb4d2',
    username: 'running-rabbit',
  },
  {
    key: 'a17b86baba0cb804',
    username: 'ridiculous-puma',
  },
  { key: '21234f47b1c46620', username: 'verbal-turtle' },
  { key: 'bf70268a8f1e2d67', username: 'realistic-piranha' },
  {
    key: '5a75dc3b46250ba5',
    username: 'magnetic-limpet',
  },
]

export { server, authenticatePlayer, serverInject, sleep, initialPlayers }
