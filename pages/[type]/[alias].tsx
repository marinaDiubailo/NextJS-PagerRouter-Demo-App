import { GetStaticPropsContext, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import axios from 'axios'
import { withLayout } from '@/app/layouts/MainLayout'
import { MenuItem } from '@/shared/types/menu'
import { TopLevelCategory, TopPageModel } from '@/shared/types/page'
import { ProductModel } from '@/shared/types/product'
import { firstLevelMenu } from '@/shared/consts/firstLevelMenu'
import { TopPageComponent } from '@/pages/TopPage'
import { API } from '@/shared/api/api'
import { Error404 } from '../404'

interface TopPageProps extends Record<string, unknown> {
  menu: MenuItem[]
  firstCategory: TopLevelCategory
  page: TopPageModel
  products: ProductModel[]
}

function TopPage(props: TopPageProps) {
  const { products, firstCategory, page } = props

  if (!page || !products) {
    return <Error404 />
  }

  return (
    <>
      <Head>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <meta property="og:title" content={page.metaTitle} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:type" content="article" />
      </Head>
      <TopPageComponent firstCategory={firstCategory} page={page} products={products} />
    </>
  )
}

export default withLayout(TopPage)

export const getStaticPaths: GetStaticPaths = async () => {
  let paths: string[] = []

  for (const menuItem of firstLevelMenu) {
    const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
      firstCategory: menuItem.id,
    })
    paths = paths.concat(
      menu.flatMap(item => item.pages.map(page => `/${menuItem.route}/${page.alias}`))
    )
  }

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<TopPageProps> = async ({
  params,
}: GetStaticPropsContext<ParsedUrlQuery>) => {
  // { type } = params || {} // 2й вариант
  if (!params) {
    return {
      notFound: true,
    }
  }
  const firstCategoryItem = firstLevelMenu.find(category => category.route === params.type)

  if (!firstCategoryItem) {
    return {
      notFound: true,
    }
  }

  try {
    const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
      firstCategory: firstCategoryItem.id,
    })

    if (menu.length === 0) {
      return {
        notFound: true,
      }
    }

    const { data: page } = await axios.get<TopPageModel>(API.topPage.byAlias + params.alias)

    const { data: products } = await axios.post<ProductModel[]>(API.product.find, {
      category: page.category,
      limit: 20,
    })

    return {
      props: {
        menu,
        firstCategory: firstCategoryItem.id,
        page,
        products,
      },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
