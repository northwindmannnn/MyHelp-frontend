import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await query('SELECT * FROM doctors ORDER BY surname, name')
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { surname, name, patronymic, specialization, experience, photo_path } = await request.json()
    
    const result = await query(
      `INSERT INTO doctors 
       (surname, name, patronymic, specialization, experience, photo_path) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [surname, name, patronymic, specialization, experience, photo_path]
    )
    
    return NextResponse.json(result.rows[0])
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}