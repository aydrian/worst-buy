import Link from "next/link";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

export default function NavBar() {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px="4">
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Link href="/">
            <Text fontWeight="medium">Worst Buy</Text>
          </Link>
        </Box>
        <HStack>
          <Text fontWeight="light">Welcome, Aydrian</Text>
          <Avatar
            size={"sm"}
            src={
              "https://pbs.twimg.com/profile_images/1250423206931861505/3-52t24v_400x400.jpg"
            }
          />
        </HStack>
      </Flex>
    </Box>
  );
}
