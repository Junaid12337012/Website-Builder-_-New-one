import jwt from 'jsonwebtoken'

export function signToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret'
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' })
}
