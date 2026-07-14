// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import NotFoundImg from '../../assets/Images/NotFound.png'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { PrimaryBtn } from '../../components/Common/Button/Button.jsx'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './NotFound.module.css'

// NOT-FOUND PAGE ----------------------------------------------------------------------------------------------------------------------------------|
export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className = {styles.wrapper}>
            <div className = {styles.card}>
                <div className = {styles.imageSide}>
                    <img src = {NotFoundImg} alt = "Lost in space" className = {styles.image} />
                </div>

                <div className = {styles.infoSide}>
                    <Compass className = {styles.icon} size = {40} />
                    <h1 className = {styles.title}>Lost in Space</h1>
                    <p className = {styles.description}>
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <PrimaryBtn onClick = {() => navigate('/')}>
                        Back To Home
                    </PrimaryBtn>
                </div>
            </div>
        </div>
    )
}
