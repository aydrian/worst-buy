import { Box, Heading, Text } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box
      as="header"
      w="100%"
      p="4"
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      textAlign="center"
      textColor="whiteAlpha.900"
    >
      <Heading as="h1">☠️ Worst Buy</Heading>
      <Text>You could probably shop somewhere better.</Text>
    </Box>
  );
}
