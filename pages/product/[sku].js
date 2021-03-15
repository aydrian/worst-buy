import ContentfulApi from "@utils/ContentfulApi";

export default function ProductWrapper(props) {
  const { product } = props;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>
        model: {product.model} sku: {product.sku}
      </p>
      <img src={product.mainImage.url} alt={product.title} />
    </div>
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
    paths
    //fallback: "blocking"
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
