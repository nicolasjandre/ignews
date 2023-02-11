import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'

export function createClient({
  previewData,
  req,
  ...config
}: prismicNext.CreateClientConfig = {}) {
  const client = prismic.createClient(process.env.PRISMIC_REPO_NAME as  string, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })

  prismicNext.enableAutoPreviews({ client, previewData, req })

  return client
}