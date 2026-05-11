import logoImg from '../pictures/pic2.jpg';
import styles from './Header.module.css';

export default function Header(){
    return(
    
    <header>
        <img src={logoImg} className={styles.logo}/>
        <h3>
        Travel Planner
        Organize trips, destinations and expenses in one place
    </h3>

        </header>)
}