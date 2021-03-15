import { Image, Text } from "@chakra-ui/react";
import { format, parseJSON } from "date-fns";

import ContentfulApi from "@utils/ContentfulApi";
import MainLayout from "@layouts/main";
import Head from "next/head";

export default function ProductWrapper(props) {
  const { product } = props;

  return (
    <MainLayout>
      <Head>
        <title>Worst Buy: {product.title}</title>
      </Head>
      <Text fontSize="xl">{product.title}</Text>
      <Text fontSize="sm">
        <strong>Model: </strong>
        {product.model} <strong>SKU: </strong>
        {product.sku} <strong>Release Date: </strong>
        {format(parseJSON(product.releaseDate), "P")}
      </Text>
      <Image src={product.mainImage.url} alt={product.title} />
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const productSKUs = await ContentfulApi.getAllProductSKUs();

  const paths = productSKUs.map((sku) => {
    return { params: { sku } };
  });

  // Using fallback: "blocking" here enables preview mode for unpublished blog slugs
  // on production
  return {
    paths,
    fallback: false //"blocking"
  };
}

export async function getStaticProps({ params, preview = false }) {
  const product = await ContentfulApi.getProductBySKU(params.sku, {
    preview: preview
  });

  // Add this with fallback: "blocking"
  // So that if we do not have a post on production,
  // the 404 is served
  if (!product) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      preview,
      product
    }
  };
}
