import { Config } from "./Config";

/**
 * This class constructs GraphQL queries for products, page content and other data
 * and calls out to the Contentful GraphQL API.
 *
 * Contentful GraphQL API docs:
 * https://www.contentful.com/developers/docs/references/graphql/
 *
 * Explore the GraphQL API in depth in the GraphiQL Playground:
 * https://graphql.contentful.com/content/v1/spaces/{SPACE_ID}/explore?access_token={ACCESS_TOKEN}
 *
 */

const defaultOptions = {
  preview: false
};

export default class ContentfulApi {
  /**
   * Fetch the content for a single page by slug.
   *
   * The content type uses the powerful Rich Text field type for the
   * body of the post.
   *
   * This query fetches linked assets (i.e. images) and entries
   * (i.e. video embed and code block entries) that are embedded
   * in the Rich Text field. This is rendered to the page using
   * @components/RichTextPageContent.
   *
   * For more information on Rich Text fields in Contentful, view the
   * documentation here: https://www.contentful.com/developers/docs/concepts/rich-text/
   *
   * Linked assets and entries are parsed and rendered using the npm package
   * @contentful/rich-text-react-renderer
   *
   * https://www.npmjs.com/package/@contentful/rich-text-react-renderer
   *
   * param: slug (string)
   *
   */
  static async getPageContentBySlug(slug, options = defaultOptions) {
    const query = `
    {
      pageContentCollection(limit: 1, where: {slug: "${slug}"}, preview: ${options.preview}) {
        items {
          sys {
            id
          }
          heroBanner {
            headline
            subHeading
            internalLink
            externalLink
            ctaText
            image {
              url
              title
              description
              width
              height
            }
          }
          title
          description
          slug
          body {
            json
            links {
              entries {
                block {
                  sys {
                    id
                  }
                  __typename
                  ... on VideoEmbed {
                    title
                    embedUrl
                  }
                  ... on CodeBlock {
                    description
                    language
                    code
                  }
                }
              }
              assets {
                block {
                  sys {
                    id
                  }
                  url
                  title
                  width
                  height
                  description
                }
              }
            }
          }
        }
      }
    }`;

    const response = await this.callContentful(query, options);

    const pageContent = response.data.pageContentCollection.items
      ? response.data.pageContentCollection.items
      : [];

    return pageContent.pop();
  }

  /**
   * Fetch a batch of product skus (by given page number).
   *
   * This method queries the GraphQL API for a single batch of product skus (skus).
   *
   * The query limit of 100 is the maximum number of skus
   * we can fetch with this query due to GraphQL complexity costs.
   *
   * For more information about GraphQL query complexity, visit:
   * https://www.contentful.com/developers/videos/learn-graphql/#graphql-fragments-and-query-complexity
   *
   * param: page (number)
   *
   */
  static async getPaginatedSKUs(page) {
    const queryLimit = 100;
    const skipMultiplier = page === 1 ? 0 : page - 1;
    const skip = skipMultiplier > 0 ? queryLimit * skipMultiplier : 0;

    const query = `{
        productCollection(limit: ${queryLimit}, skip: ${skip}, order: releaseDate_DESC) {
          total
          items {
            sku
          }
        }
      }`;

    const response = await this.callContentful(query);

    const { total } = response.data.productCollection;
    const skus = response.data.productCollection.items
      ? response.data.productCollection.items.map((item) => item.sku)
      : [];

    return { skus, total };
  }

  /**
   * Fetch all product skus.
   *
   * This method queries the GraphQL API for product skus
   * in batches that accounts for the query complexity cost,
   * and returns them in one array.
   *
   * This method is used on pages/product/[sku] inside getStaticPaths() to
   * generate all dynamic product routes.
   *
   * For more information about GraphQL query complexity, visit:
   * https://www.contentful.com/developers/videos/learn-graphql/#graphql-fragments-and-query-complexity
   *
   */
  static async getAllProductSKUs() {
    let page = 1;
    let shouldQueryMoreSKUs = true;
    const returnSKUs = [];

    while (shouldQueryMoreSKUs) {
      const response = await this.getPaginatedSKUs(page);

      if (response.skus.length > 0) {
        returnSKUs.push(...response.skus);
      }

      shouldQueryMoreSKUs = returnSKUs.length < response.total;
      page++;
    }

    return returnSKUs;
  }

  /**
   * Fetch a batch of products (by given page number).
   *
   * This method queries the GraphQL API for a single batch of products.
   *
   * The query limit of 10 is the maximum number of posts
   * we can fetch with this query due to GraphQL complexity costs.
   *
   * For more information about GraphQL query complexity, visit:
   * https://www.contentful.com/developers/videos/learn-graphql/#graphql-fragments-and-query-complexity
   *
   * param: page (number)
   *
   */
  static async getPaginatedProducts(page) {
    const queryLimit = 10;
    const skipMultiplier = page === 1 ? 0 : page - 1;
    const skip = skipMultiplier > 0 ? queryLimit * skipMultiplier : 0;

    const query = `{
      productCollection(limit: ${queryLimit}, skip: ${skip}, order: releaseDate_DESC) {
        total
        items {
          sys {
            id
          }
          title
          sku
          model
          price
          releaseDate
          mainImage {
            url
          }
          itemsInStock
        }
      }
    }`;

    const response = await this.callContentful(query);

    const { total } = response.data.productCollection;
    const products = response.data.productCollection.items
      ? response.data.productCollection.items
      : [];

    return { products, total };
  }

  /**
   * Fetch all products.
   *
   * This method queries the GraphQL API for products
   * in batches that accounts for the query complexity cost,
   * and returns them in one array.
   *
   * This method is used to build the RSS feed on pages/buildrss.
   *
   * For more information about GraphQL query complexity, visit:
   * https://www.contentful.com/developers/videos/learn-graphql/#graphql-fragments-and-query-complexity
   *
   */
  static async getAllProducts() {
    let page = 1;
    let shouldQueryMorePosts = true;
    const returnProducts = [];

    while (shouldQueryMorePosts) {
      const response = await this.getPaginatedProducts(page);

      if (response.products.length > 0) {
        returnProducts.push(...response.products);
      }

      shouldQueryMorePosts = returnProducts.length < response.total;
      page++;
    }

    return returnProducts;
  }

  /**
   * Fetch a single product by sku.
   *
   * This method is used on pages/product/[sku] to fetch the data for
   * individual products at build time, which are prerendered as
   * static HTML.
   *
   * The content type uses the powerful Rich Text field type for the
   * body of the post.
   *
   * This query fetches linked assets (i.e. images) and entries
   * (i.e. video embed and code block entries) that are embedded
   * in the Rich Text field. This is rendered to the page using
   * @components/RichTextPageContent.
   *
   * For more information on Rich Text fields in Contentful, view the
   * documentation here: https://www.contentful.com/developers/docs/concepts/rich-text/
   *
   * Linked assets and entries are parsed and rendered using the npm package
   * @contentful/rich-text-react-renderer
   *
   * https://www.npmjs.com/package/@contentful/rich-text-react-renderer
   *
   * param: sku (string)
   *
   */
  static async getProductBySKU(sku, options = defaultOptions) {
    const query = `{
      productCollection(limit: 1, where: {sku: "${sku}"}, preview: ${options.preview}) {
        total
        items {
          sys {
            id
          }
          title
          description
          price
          sku
          model
          releaseDate
          mainImage {
            url
          }
          itemsInStock
        }
      }
    }`;

    const response = await this.callContentful(query, options);
    const product = response.data.productCollection.items
      ? response.data.productCollection.items
      : [];

    return product.pop();
  }

  /**
   * Fetch n  product summaries that are displayed on pages/catelog.js.
   *
   * This method accepts a parameter of a page number that calculates
   * how many blog posts to skip in the GraphQL query.
   *
   * Set your desired page size in @utils/Config:
   * Config.pagination.pageSize
   *
   * The page size is currently set to 2 so you can view how the pagination
   * works on a fresh clone of the repository.
   *
   * param: page (number)
   *
   */
  static async getPaginatedProductSummaries(page) {
    const skipMultiplier = page === 1 ? 0 : page - 1;
    const skip =
      skipMultiplier > 0 ? Config.pagination.pageSize * skipMultiplier : 0;

    const query = `{
        productCollection(limit: ${Config.pagination.pageSize}, skip: ${skip}, order: releaseDate_DESC) {
          items {
            sys {
              id
            }
            releaseDate
            title
            price
            sku
            model
            mainImage {
              url
            }
          }
        }
      }`;

    const response = await this.callContentful(query);

    const paginatedProductSummaries = response.data.productCollection.items
      ? response.data.productCollection.items
      : [];

    return paginatedProductSummaries;
  }

  /**
   * Fetch n recent product summaries that are displayed on pages/index.js.
   *
   * This query is purposefully not paginated as it serves as a single
   * responsibility function to display a fixed size group of posts.
   *
   * Set your desired recent post list size in @utils/Config:
   * Config.pagination.recentPostsSize
   *
   */
  static async getRecentProductList() {
    const query = `{
      productCollection(limit: ${Config.pagination.recentPostsSize}, order: releaseDate_DESC) {
        items {
          sys {
            id
          }
          releaseDate
          title
          sku
          model
          price
        }
      }
    }`;

    const response = await this.callContentful(query);

    const recentPoducts = response.data.productCollection.items
      ? response.data.productCollection.items
      : [];

    return recentPoducts;
  }

  /**
   * Fetch the total number of products.
   */
  static async getTotalProductsNumber() {
    const query = `
      {
        productCollection {
          total
        }
      }
    `;

    const response = await this.callContentful(query);
    const totalProducts = response.data.productCollection.total
      ? response.data.productCollection.total
      : 0;

    return totalProducts;
  }

  /**
   * Call the Contentful GraphQL API using fetch.
   *
   * param: query (string)
   */
  static async callContentful(query, options = defaultOptions) {
    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`;

    const accessToken = options.preview
      ? process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN
      : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

    const fetchOptions = {
      spaceID: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      accessToken: accessToken,
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ query })
    };

    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) =>
        response.json()
      );
      return data;
    } catch (error) {
      throw new Error("Could not fetch blog posts!");
    }
  }
}
