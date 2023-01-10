import styles from './styles.module.scss'

interface MenuMobileButtonProps {
  toggleMenu: () => void,
  isMenuOpen: boolean
}

export function MenuMobileButton({ toggleMenu, isMenuOpen }: MenuMobileButtonProps) {
  return (
    <button className={isMenuOpen ? styles.menuOpen : styles.menuClosed}
    title="Menu Button"
    type="button"
    aria-expanded="false"
    onClick={toggleMenu}
    >
      <div className={styles.bar1}></div>
      <div className={styles.bar2}></div>
      <div className={styles.bar3}></div>
    </button>
  )
}