'use client'

import React from 'react';
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './AddDoctor.module.css'
import Link from 'next/link';

export default function AddDoctorPage() {
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    specialization: '',
    experience: '',
    photo_path: '/doctors/default.jpg'
  })
  const [previewImage, setPreviewImage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Создание превью
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
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (res.ok) {
        router.push('/polyclinic/admin')
      } else {
        const data = await res.json()
        setError(data.message || 'Ошибка сохранения')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Добавить нового врача</h1>
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
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </main>
    </div>
  )
}