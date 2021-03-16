import ContentfulApi from "@utils/ContentfulApi";
import Head from "next/head";
import { Heading, HStack, Stack, VStack } from "@chakra-ui/react";

import MainLayout from "@layouts/main";
import ProductCard from "@components/ProductCard";

export default function Home(props) {
  const { allProducts, preview } = props;

  return (
    <MainLayout>
      <Head>
        <title>Worst Buy: An example eCommerce Site backed by Contentful</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack spacing="2" textAlign="center">
        <Heading as="h1">Products</Heading>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        {allProducts.map((product) => {
          return <ProductCard product={product} key={product.sys.id} />;
        })}
      </Stack>
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
