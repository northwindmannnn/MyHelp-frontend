import Link from 'next/link'
import { query } from '@/lib/db'
import styles from './Doctors.module.css'

async function getDoctors() {
  try {
    const res = await query('SELECT * FROM doctors ORDER BY surname, name')
    return res.rows
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return []
  }
}

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Поликлиника №1</h1>
          <nav className={styles.nav}>
            <Link href="/polyclinic" className={styles.navLink}>Главная</Link>
            <Link href="/polyclinic/auth" className={styles.navLink}>Личный кабинет</Link>
          </nav>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Наши врачи</h2>
          <p className={styles.subtitle}>Профессионалы с большим опытом работы</p>
        </div>
        
        <div className={styles.doctorsGrid}>
          {doctors.map(doctor => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.photoContainer}>
                <img 
                  src={doctor.photo_path} 
                  alt={`${doctor.surname} ${doctor.name} ${doctor.patronymic}`}
                  className={styles.doctorPhoto}
                  width={160}
                  height={160}
                />
              </div>
              <h3 className={styles.doctorName}>
                {doctor.surname} {doctor.name} {doctor.patronymic}
              </h3>
              <p className={styles.specialization}>{doctor.specialization}</p>
              <p className={styles.experience}>Опыт работы: {doctor.experience} лет</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}