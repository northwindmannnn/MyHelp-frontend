import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  
  try {
    const sessionData = JSON.parse(session)
    
    // Проверяем наличие обязательных полей
    if (!sessionData.userId) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
    
    // Получаем свежие данные из БД
    const result = await query(
      'SELECT id, name, email, is_admin FROM accounts WHERE id = $1',
      [sessionData.userId]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
    
    return NextResponse.json({ 
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        is_admin: result.rows[0].is_admin
      }
    })
    
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}