import { GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { createClient } from "../../../services/prismicio"
import * as prismicH from "@prismicio/helpers"
import Head from "next/head"

import styles from '../post.module.scss'
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/router"

interface PostPreviewProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session, post.slug])
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
          className={styles.postContent + ' ' + styles.previewContent}
          dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <div className={styles.divButton}>
            <button type="button" className={styles.continueReading}>
              Wanna continue reading?
              <Link href="/">
                Subscribe Now 🤗
              </Link>
            </button>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { slug } = params

  const prismic = createClient()

  const response = await prismic.getByUID('post', String(slug), {})
  
  const post = {
    slug,
    title: prismicH.asText(response.data.title),
    content: prismicH.asHTML(response.data.content.splice(0, 6)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: { 
      post,
    },
    revalidate: 60 * 30 // 30 min
  }
} 