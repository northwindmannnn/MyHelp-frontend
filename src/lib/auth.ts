import { compare, hash } from 'bcryptjs'

export const hashPassword = (password: string) => hash(password, 12)
export const comparePassword = (password: string, hashed: string) => 
  compare(password, hashed)