import { useState } from "react"
import Image from "next/image"

import { MenuMobileButton } from "../MenuMobileButton"
import { SignInButton } from "../SignInButton"

import styles from './styles.module.scss'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function toggleMenu() {
    setIsMenuOpen(prevState => !prevState)
  }
  
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
        src="/images/logo.svg"
        alt="ig.news"
        width={110}
        height={31} />
        
        <nav className={isMenuOpen ? styles.active : ''}>
          <a className={styles.active} href="">Home</a>
          <a href="">Posts</a>
          <SignInButton />
        </nav>
        <MenuMobileButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  )
}