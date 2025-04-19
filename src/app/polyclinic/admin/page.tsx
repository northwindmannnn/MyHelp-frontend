'use client'

import React from 'react';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './Admin.module.css'

export default function AdminPage() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        })
        const data = await response.json()
        
        if (!response.ok || !data.user?.is_admin) {
          router.push('/polyclinic')
          return
        }
        await fetchDoctors()
      } catch (err) {
        router.push('/polyclinic')
      } finally {
        setLoading(false)
      }
    }

    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors')
        const data = await res.json()
        if (res.ok) {
          setDoctors(data)
        } else {
          setError(data.message || 'Ошибка загрузки данных')
        }
      } catch (err) {
        setError('Ошибка соединения с сервером')
      }
    }

    checkAuth()
  }, [router])

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого врача?')) return
    
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDoctors(doctors.filter((d: any) => d.id !== id))
      } else {
        const data = await res.json()
        setError(data.message || 'Ошибка удаления')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    }
  }

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  )

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <h1>Панель администратора</h1>
          <nav>
            <Link href="/polyclinic/admin/add-doctor" className={styles.navLink}>
              Добавить врача
            </Link>
            <Link href="/polyclinic" className={styles.navLink}>
              На главную
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.adminMain}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <div className={styles.doctorsList}>
          <h2>Список врачей</h2>
          <table className={styles.doctorsTable}>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Специальность</th>
                <th>Опыт</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor: any) => (
                <tr key={doctor.id}>
                  <td>{doctor.surname} {doctor.name} {doctor.patronymic}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experience} лет</td>
                  <td className={styles.actions}>
                  <Link 
                    href={`/polyclinic/admin/edit-doctor/${doctor.id}`} 
                    className={styles.editBtn}
                  >
                    Редактировать
                  </Link>
                  <button 
                    onClick={() => handleDelete(doctor.id)} 
                    className={styles.deleteBtn}
                  >
                    Удалить
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}