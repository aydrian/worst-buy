import { Button, Image, HStack, Text, VStack } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { format, parseJSON } from "date-fns";

import ContentfulApi from "@utils/ContentfulApi";
import MainLayout from "@layouts/main";
import Head from "next/head";

export default function ProductWrapper(props) {
  const { product } = props;
  const isInStock = product.itemsInStock > 0;

  const onAlertMeClick = async (e) => {
    console.log("Alert me");
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({
        sku: product.sku,
        userId: "73f499a5-2b1e-46e0-bfbe-4020f75a493b"
      })
    };

    try {
      const data = await fetch("/api/alert", fetchOptions).then((response) =>
        response.json()
      );

      console.log(data);
    } catch (error) {
      console.log("Could not subscribe to alerts: ", error);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Worst Buy: {product.title}</title>
      </Head>
      <HStack>
        <VStack>
          <VStack align="start">
            <Text fontSize="xl">{product.title}</Text>
            <Text fontSize="sm">
              <strong>Model: </strong>
              {product.model} <strong>SKU: </strong>
              {product.sku} <strong>Release Date: </strong>
              {format(parseJSON(product.releaseDate), "P")}
            </Text>
          </VStack>

          <Image src={product.mainImage.url} alt={product.title} />
        </VStack>
        <VStack>
          <Text fontSize="xl">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(product.price)}
          </Text>
          <Text>
            {product.description.split("\n").map(function (item, idx) {
              return (
                <span key={idx}>
                  {item}
                  <br />
                </span>
              );
            })}
          </Text>
          <HStack>
            <Button colorScheme="purple" disabled={!isInStock}>
              {isInStock ? "Buy Now" : "Sold Out"}
            </Button>
            {!isInStock && (
              <Button
                colorScheme="purple"
                leftIcon={<BellIcon />}
                onClick={onAlertMeClick}
              >
                Alert Me
              </Button>
            )}
          </HStack>
        </VStack>
      </HStack>
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
