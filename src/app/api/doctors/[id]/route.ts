import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // Явно извлекаем id из params
    const { id } = params;
    const result = await query('SELECT * FROM doctors WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Врач не найден' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result.rows[0])
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { surname, name, patronymic, specialization, experience, photo_path } = await request.json()
    
    const result = await query(
      `UPDATE doctors 
       SET surname = $1, name = $2, patronymic = $3, 
           specialization = $4, experience = $5, photo_path = $6
       WHERE id = $7
       RETURNING *`,
      [surname, name, patronymic, specialization, experience, photo_path, id]
    )
    
    return NextResponse.json(result.rows[0])
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(
    request: Request,
    { params: { id } }: { params: { id: string } } // <- сразу получаем id
  ) {
    try {
      await query('DELETE FROM doctors WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
      
    } catch (error) {
      return NextResponse.json(
        { message: 'Ошибка сервера' },
        { status: 500 }
      );
    }
  }