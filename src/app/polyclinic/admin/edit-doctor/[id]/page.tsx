'use client'

import React from 'react';
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../../add-doctor/AddDoctor.module.css'

export default function EditDoctorPage() {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    specialization: '',
    experience: '',
    photo_path: ''
  })
  const [previewImage, setPreviewImage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Загрузка данных врача
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${id}`)
        if (res.ok) {
          const data = await res.json()
          setFormData(data)
          setPreviewImage(data.photo_path)
        } else {
          throw new Error('Не удалось загрузить данные врача')
        }
      } catch (err) {
        //setError(err.message)
        router.push('/polyclinic/admin')
      }
    }
    fetchDoctor()
  }, [id, router])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Превью изображения
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreviewImage(reader.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Загрузка на сервер
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (uploadRes.ok) {
        const { filePath } = await uploadRes.json()
        setFormData(prev => ({ ...prev, photo_path: filePath }))
      } else {
        throw new Error('Ошибка загрузки изображения')
      }
    } catch (err) {
      setError('Не удалось загрузить изображение')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (res.ok) {
        router.push('/polyclinic/admin')
      } else {
        const data = await res.json()
        setError(data.message || 'Ошибка обновления данных')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этого врача?')) return
    
    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        router.push('/polyclinic/admin')
      } else {
        const data = await res.json()
        setError(data.message || 'Ошибка удаления врача')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!formData.surname) {
    return <div className={styles.loading}>Загрузка данных...</div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Редактирование врача</h1>
        <Link href="/polyclinic/admin" className={styles.backLink}>
          ← Назад к списку
        </Link>
      </header>
      
      <main className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Фамилия*
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Имя*
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Отчество
              <input
                type="text"
                name="patronymic"
                value={formData.patronymic}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Специализация*
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Опыт работы (лет)*
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={styles.input}
                min="0"
                max="60"
                required
              />
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Фотография
              <div className={styles.photoUpload}>
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Превью" 
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    {formData.photo_path === '/doctors/default.jpg' 
                      ? 'Будет использовано фото по умолчанию' 
                      : 'Загрузите фото врача'}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className={styles.fileInput}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadButton}
                >
                  Выбрать файл
                </button>
              </div>
            </label>
          </div>
          
          <div className={styles.buttonsContainer}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              className={styles.deleteButton}
              disabled={isLoading}
            >
              Удалить врача
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}