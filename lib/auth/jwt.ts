import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'super_secret_jwt_key_here_for_development'
const key = new TextEncoder().encode(secretKey)

export async function signToken(payload: any, expiresIn: string = '7d') {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}
