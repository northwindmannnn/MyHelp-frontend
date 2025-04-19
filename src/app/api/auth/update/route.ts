import { query } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
  try {
    const { name, email, currentPassword, newPassword } = await request.json()
    
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
    
    // Проверяем текущий пароль
    const userResult = await query('SELECT password FROM accounts WHERE id = $1', [userId])
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      )
    }
    
    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Неверный текущий пароль' },
        { status: 401 }
      )
    }
    
    // Обновляем данные
    let hashedPassword = userResult.rows[0].password
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10)
    }
    
    await query(
      `UPDATE accounts 
       SET name = $1, email = $2, password = $3 
       WHERE id = $4`,
      [name, email, hashedPassword, userId]
    )
    
    // Возвращаем обновленные данные
    const updatedUser = await query(
      'SELECT id, name, email, is_admin FROM accounts WHERE id = $1',
      [userId]
    )
    
    return NextResponse.json({ user: updatedUser.rows[0] })
    
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}