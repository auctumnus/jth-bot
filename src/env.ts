import 'dotenv/config'

export const TOKEN = process.env.TOKEN!

if (!TOKEN) {
  throw new Error('no token')
}
