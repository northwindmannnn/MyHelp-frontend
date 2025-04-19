import { query } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Поиск пользователя в базе данных
    const result = await query('SELECT * FROM accounts WHERE email = $1', [email])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Пользователь с таким email не найден' },
        { status: 401 }
      )
    }
    
    const user = result.rows[0]
    
    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Неверный пароль' },
        { status: 401 }
      )
    }
    
    // Возвращаем данные пользователя (без пароля)
    const { password: _, ...userWithoutPassword } = user
    
    const sessionData = {
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin
    }

    // Создаем response и устанавливаем cookie
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Авторизация успешна'
    })
    
    response.cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 неделя
      path: '/',
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}