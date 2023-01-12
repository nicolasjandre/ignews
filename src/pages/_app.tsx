import type { AppProps } from 'next/app'
import { SessionProvider as NextAuthProvider} from 'next-auth/react';
import { Roboto } from '@next/font/google'

import '../styles/global.scss'

const roboto = Roboto({ 
  weight: ['400', '700', '900'],
  subsets: ['latin']
 })

import { Header } from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <NextAuthProvider session={pageProps.session}>
    <Header />
    <Component className={roboto.className} {...pageProps} />
  </NextAuthProvider>
  )
}
