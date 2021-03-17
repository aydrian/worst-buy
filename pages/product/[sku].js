import { useEffect, useState } from "react";
import { Button, Image, HStack, Text, VStack } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { format, parseJSON } from "date-fns";

import ContentfulApi from "@utils/ContentfulApi";
import MainLayout from "@layouts/main";
import Head from "next/head";

export default function ProductWrapper(props) {
  const [alerts, setAlerts] = useState([]);
  const { product } = props;
  const alertId = `worstbuy.${product.sku}.restock`;
  const isInStock = product.itemsInStock > 0;
  const isSubscribed = alerts.includes(alertId);

  useEffect(async () => {
    const { items } = await fetch(
      `/api/alert?userId=AYDRIAN10036`
    ).then((response) => response.json());
    setAlerts(items.map((item) => item.id));
  }, []);

  const onAlertMeClick = async (e) => {
    console.log("Alert me: ", e.target.value);
    const fetchOptions = {
      method: isSubscribed ? "DELETE" : "POST",
      body: JSON.stringify({
        sku: product.sku,
        userId: "AYDRIAN10036"
      })
    };

    try {
      await fetch("/api/alert", fetchOptions);
      if (isSubscribed) {
        setAlerts(alerts.filter((value) => value !== alertId));
      } else {
        setAlerts([...alerts, alertId]);
      }
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
            <Text fontSize="xl" fontWeight="medium">
              {product.title}
            </Text>
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
          <Text fontSize="xl" fontWeight="medium">
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
                {isSubscribed && "Don't "}Alert Me
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
