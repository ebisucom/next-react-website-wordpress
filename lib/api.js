const API_URL = 'http://xxx.xxx.xxx/graphql'

async function fetchAPI(query = '', variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((response) => response.json())

  if (response.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return response.data
}

export async function getPostBySlug(slug) {
  const variables = {
    slug,
  }

  const query = `
          query getPostBySlug($slug: ID!) {
            post(idType: SLUG, id: $slug) {
              slug
              title(format: RENDERED)
              date
              content(format: RENDERED)
              featuredImage {
                node {
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        `
  try {
    const response = await fetchAPI(query, variables)

    const content = {
      title: response.post.title,
      slug: response.post.slug,
      publishDate: response.post.date,
      content: response.post.content,
      categories: response.post.categories.nodes,
    }

    if (response.post.featuredImage) {
      content.eyecatch = {
        url: response.post.featuredImage.node.sourceUrl,
        height: response.post.featuredImage.node.mediaDetails.height,
        width: response.post.featuredImage.node.mediaDetails.width,
      }
    }
    return content
  } catch (err) {
    console.log('~~ getPostBySlug ~~')
    console.log(err)
  }
}

export async function getAllSlugs(limit = 100) {
  const variables = {
    limit,
  }

  const query = `
          query getAllSlugs($limit: Int!) {
            posts(first: $limit) {
              nodes {
                title
                slug
              }
            }
          }
        `
  try {
    const response = await fetchAPI(query, variables)
    const contents = response.posts.nodes

    return contents
  } catch (err) {
    console.log('~~ getAllSlugs ~~')
    console.log(err)
  }
}

export async function getAllPosts(limit = 100) {
  const variables = {
    limit,
  }

  const query = `
          query getAllSlugs($limit: Int!) {
            posts(first: $limit) {
              nodes {
                title
                slug
                featuredImage {
                  node {
                    sourceUrl
                    mediaDetails {
                      height
                      width
                    }
                  }
                }
              }
            }
          }
        `

  try {
    const response = await fetchAPI(query, variables)

    const contents = response.posts.nodes.map((node) => {
      const content = {
        title: node.title,
        slug: node.slug,
      }

      if (node.featuredImage) {
        content.eyecatch = {
          url: node.featuredImage.node.sourceUrl,
          height: node.featuredImage.node.mediaDetails.height,
          width: node.featuredImage.node.mediaDetails.width,
        }
      }

      return content
    })

    return contents
  } catch (err) {
    console.log('~~ getAllPosts ~~')
    console.log(err)
  }
}

export async function getAllCategories(limit = 100) {
  const variables = {
    limit,
  }

  const query = `
          query getAllCategories($limit: Int!) {
            categories(first: $limit) {
              nodes {
                name
                slug
              }
            }
          }
        `

  try {
    const response = await fetchAPI(query, variables)

    const contents = response.categories.nodes.map((node) => {
      const content = {
        name: node.name,
        id: node.slug,
        slug: node.slug,
      }
      return content
    })

    return contents
  } catch (err) {
    console.log('~~ getAllCategories ~~')
    console.log(err)
  }
}

export async function getAllPostsByCategory(catID, limit = 100) {
  const variables = {
    id: catID,
    limit,
  }
  const query = `
          query getAllPostsByCategory($id: ID!, $limit: Int!) {
            category(id: $id, idType: SLUG) {
              posts(first: $limit) {
                nodes {
                  slug
                  title
                  featuredImage {
                    node {
                      sourceUrl
                      mediaDetails {
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
          }
        `

  try {
    const response = await fetchAPI(query, variables)

    const contents = response.category.posts.nodes.map((node) => {
      const content = {
        title: node.title,
        slug: node.slug,
      }

      if (node.featuredImage) {
        content.eyecatch = {
          url: node.featuredImage.node.sourceUrl,
          height: node.featuredImage.node.mediaDetails.height,
          width: node.featuredImage.node.mediaDetails.width,
        }
      }

      return content
    })

    return contents
  } catch (err) {
    console.log('~~ getAllPostsByCategory ~~')
    console.log(err)
  }
}
