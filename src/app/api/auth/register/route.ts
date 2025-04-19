import { query } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    // Проверка существования пользователя
    const userExists = await query('SELECT * FROM accounts WHERE email = $1', [email])
    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { message: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }
    
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Создание нового пользователя
    const result = await query(
      'INSERT INTO accounts (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, is_admin',
      [name, email, hashedPassword]
    )
    
    const newUser = result.rows[0]
    
    return NextResponse.json({
      user: newUser,
      message: 'Регистрация успешна'
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}