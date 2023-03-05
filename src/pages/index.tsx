import { GetStaticProps } from 'next'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import Head from 'next/head'
import Image from "next/image"

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string,
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
        <meta
          http-equiv="Content-Security-Policy"
          content="script-src 'self' https://*.stripe.com; style-src 'self' https://*.stripe.com; img-src 'self' https://*.stripe.com;"
        />
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month </span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image 
        src="/images/woman.svg"
        alt="Girl coding"
        width={336}
        height={521}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1MOqCMFmhexNBgj4anCH8Mh1')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount as number / 100)
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}