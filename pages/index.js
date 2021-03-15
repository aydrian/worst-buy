import Link from "next/link";
import ContentfulApi from "@utils/ContentfulApi";

import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";

export default function Home(props) {
  const { allProducts, preview } = props;

  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to Worst Buy!" />
        <ul>
          {allProducts.map((product) => {
            return (
              <li key={product.sys.id}>
                <Link href={`/product/${product.sku}`}>{product.title}</Link>
              </li>
            );
          })}
        </ul>
      </main>

      <Footer />
    </div>
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
