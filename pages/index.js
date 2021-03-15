import ContentfulApi from "@utils/ContentfulApi";

import MainLayout from "@layouts/main";

import ProductCard from "@components/ProductCard";

import Head from "next/head";

export default function Home(props) {
  const { allProducts, preview } = props;

  return (
    <MainLayout>
      <Head>
        <title>Worst Buy: An example eCommerce Site backed by Contentful</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul>
        {allProducts.map((product) => {
          return (
            <li key={product.sys.id}>
              <ProductCard product={product} />
            </li>
          );
        })}
      </ul>
    </MainLayout>
  );
}

export async function getStaticProps({ preview = false }) {
  const allProducts = await ContentfulApi.getAllProducts();

  return {
    props: {
      preview,
      allProducts
    }
  };
}
