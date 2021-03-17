import { Box, Flex } from "@chakra-ui/react";

import Header from "@components/Header";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";

export default function MainLayout(props) {
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <NavBar />
      <Box as="main" flex="1" p="4">
        {props.children}
      </Box>
      <Footer />
    </Flex>
  );
}
