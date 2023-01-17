import { useState } from "react"

import Image from "next/image"

import { MenuMobileButton } from "../MenuMobileButton"
import { SignInButton } from "../SignInButton"

import styles from './styles.module.scss'
import { ActiveLink } from "../ActiveLink"

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
          height={31}
        />
        
        <nav className={isMenuOpen ? styles.active : ''}>
          <ActiveLink href="/" activeClassName={styles.active}>Home</ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>Posts</ActiveLink>
          <SignInButton />
        </nav>
        <MenuMobileButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  )
}