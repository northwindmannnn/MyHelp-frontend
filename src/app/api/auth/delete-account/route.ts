import { query } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function DELETE(request: Request) {
  try {
    const { password } = await request.json()
    
    // Получаем текущего пользователя из сессии
    const session = request.cookies.get('session')?.value
    if (!session) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      )
    }
    
    const sessionData = JSON.parse(session)
    const userId = sessionData.userId
    
    // Проверяем пароль
    const userResult = await query('SELECT password FROM accounts WHERE id = $1', [userId])
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      )
    }
    
    const isValidPassword = await bcrypt.compare(password, userResult.rows[0].password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Неверный пароль' },
        { status: 401 }
      )
    }
    
    // Удаляем пользователя
    await query('DELETE FROM accounts WHERE id = $1', [userId])
    
    // Очищаем сессию
    const response = NextResponse.json({ success: true })
    response.cookies.delete('session')
    
    return response
    
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}