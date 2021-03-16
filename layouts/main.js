import { Flex } from "@chakra-ui/react";

import Header from "@components/Header";
import Footer from "@components/Footer";

export default function MainLayout(props) {
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <main>{props.children}</main>
      <Footer />
    </Flex>
  );
}
