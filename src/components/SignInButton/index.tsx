import { signIn, signOut, useSession } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
  const { data } = useSession()

  return data ? (
    <button 
    className={styles.authenticated + " " + styles.signInButton} 
    type="button"
    >
      <FaGithub 
      color="#04d361" 
      />
      <span>{data.session.user.name}</span>
      <FiX 
      color="#737380"
      className={styles.closeIcon}
      onClick={() => signOut()}
       />
    </button>
  ) : (
    <button 
    className={styles.signInButton} 
    type="button"
    onClick={() => signIn('github')}
  >
      <FaGithub color="#eba417" />
      <span>Sign in with Github</span>
    </button>
  )
  
}