"use client"; // Добавляем эту директиву в начало файла

import Link from 'next/link'
import styles from './Home.module.css'
import { useEffect, useState } from 'react'

// Компонент карточки специализации
function SpecializationCard({ specialization }) {
  return (
    <div className={styles.specCard}>
      <h3 className={styles.specTitle}>{specialization.specialization}</h3>
      {/* <p className={styles.specDoctor}>{specialization.specialization_doctor}</p> */}
      <p className={styles.specDescription}>{specialization.description}</p>
    </div>
  )
}

export default function Home() {
  const [specializations, setSpecializations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Получаем данные о специализациях
  // useEffect(() => {
  //   const fetchSpecializations = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8084/MyHelp/specializations')
  //       if (!response.ok) {
  //         throw new Error('Не удалось загрузить данные')
  //       }
  //       const data = await response.json()
  //       if (data.status === 'success') {
  //         setSpecializations(data.data)
  //       }
  //     } catch (err) {
  //       setError(err.message)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchSpecializations()
  // }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Поликлиника №1</h1>
          <nav className={styles.nav}>
            <Link href="/polyclinic/doctors" className={styles.navLink}>Наши врачи</Link>
            <Link href="/polyclinic/auth" className={styles.navLink}>Личный кабинет</Link>
          </nav>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeHeader}>
            <h2 className={styles.welcomeTitle}>Добро пожаловать в нашу поликлинику</h2>
            <p className={styles.welcomeSubtitle}>Качественная медицинская помощь для всей семьи</p>
          </div>
          
          <div className={styles.content}>
            <p className={styles.paragraph}>
              Мы предлагаем широкий спектр медицинских услуг для взрослых и детей. 
              В нашей поликлинике работают высококвалифицированные специалисты с большим опытом работы.
            </p>
            {/* Специализации */}
        {/* <section className={styles.specializations}>
          <div className={styles.specContainer}>
            <h2 className={styles.specSectionTitle}>Наши услуги и специалисты</h2>
            {loading ? (
              <p className={styles.loading}>Загрузка данных...</p>
            ) : error ? (
              <p className={styles.error}>Ошибка: {error}</p>
            ) : (
              <div className={styles.grid}>
                {specializations.length > 0 ? (
                  specializations.map((spec) => (
                    <SpecializationCard key={spec.specializationID} specialization={spec} />
                  ))
                ) : (
                  <p className={styles.noData}>Специализации не найдены</p>
                )}
              </div>
            )}
          </div>
        </section> */}
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>Часы работы:</h3>
              <p className={styles.infoText}>Пн-Пт с 8:00 до 20:00</p>
              <p className={styles.infoText}>Сб с 9:00 до 15:00</p>
            </div>
            
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>Контакты:</h3>
              <p className={styles.infoText}>Телефон для справок: <strong>+7 (123) 456-78-90</strong></p>
              <p className={styles.infoText}>Email: <strong>info@polyclinic1.ru</strong></p>
            </div>
          </div>
        </div>

        
      </main>
    </div>
  )
}