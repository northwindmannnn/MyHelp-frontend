'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './Account.module.css'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true) 
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const router = useRouter()

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include' // Важно для передачи кук
        })
        const data = await response.json()
        
        if (response.ok && data.user) {
          setUser(data.user)
          setFormData({
            name: data.user.name,
            email: data.user.email,
            currentPassword: '',
            newPassword: ''
          })
          
          if (data.user.is_admin) {
            router.push('/polyclinic/admin')
          }
        } else {
          router.push('/polyclinic/auth')
        }
      } catch (err) {
        setError('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Обновление данных пользователя
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setUser(data.user)
        setSuccess('Данные успешно обновлены')
        setEditMode(false)
      } else {
        setError(data.message || 'Ошибка обновления данных')
      }
    } catch (err) {
      setError('Произошла ошибка при соединении с сервером')
    }
  }

  // Удаление аккаунта
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Введите пароль для подтверждения')
      return
    }

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password: deletePassword }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/polyclinic/auth')
      } else {
        setError(data.message || 'Ошибка удаления аккаунта')
      }
    } catch (err) {
      setError('Произошла ошибка при соединении с сервером')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/polyclinic/auth')
    } catch (err) {
      setError('Ошибка при выходе из системы')
    }
  }

  if (loading || !user) {
    return (
      <div className={styles.loading}>
        <p>Загрузка данных...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Поликлиника №1</h1>
          <nav className={styles.nav}>
            <Link href="/polyclinic" className={styles.navLink}>Главная</Link>
            <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
          </nav>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h2 className={styles.title}>Личный кабинет</h2>
            <p className={styles.subtitle}>Управление вашими данными</p>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          
          {!editMode && !showDeleteConfirm ? (
            <div className={styles.profileInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Имя:</span>
                <span className={styles.infoValue}>{user.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Роль:</span>
                <span className={styles.infoValue}>
                  {user.is_admin ? 'Администратор' : 'Пользователь'}
                </span>
              </div>
              
              <div className={styles.buttonGroup}>
                <button 
                  onClick={() => setEditMode(true)} 
                  className={styles.editButton}
                >
                  Редактировать данные
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className={styles.deleteButton}
                >
                  Удалить аккаунт
                </button>
              </div>
            </div>
          ) : showDeleteConfirm ? (
            <div className={styles.deleteConfirmation}>
              <h3>Подтверждение удаления аккаунта</h3>
              <p>Это действие нельзя отменить. Все ваши данные будут удалены безвозвратно.</p>
              
              <div className={styles.formGroup}>
                <label htmlFor="deletePassword" className={styles.label}>
                  Введите ваш пароль для подтверждения:
                </label>
                <input 
                  type="password" 
                  id="deletePassword" 
                  className={styles.input}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  onClick={handleDeleteAccount}
                  className={styles.confirmDeleteButton}
                >
                  Удалить аккаунт
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeletePassword('')
                  }}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Имя
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword" className={styles.label}>
                  Текущий пароль (для подтверждения изменений)
                </label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  name="currentPassword"
                  className={styles.input}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  Новый пароль (оставьте пустым, если не хотите менять)
                </label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword"
                  className={styles.input}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Сохранить изменения
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditMode(false)}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}