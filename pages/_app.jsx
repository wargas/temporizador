import { signout, signOut, useSession } from 'next-auth/client';
import { Box, Button, ChakraProvider, CSSReset, Flex, Spinner, } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons'

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {

  const [session, loading] = useSession();
  const router = useRouter();

  if (!loading && !session && !router.pathname.includes("/auth/")) {
    router.push("/auth/login");
  }

  return (
    <ChakraProvider>
      <CSSReset />
      {loading && (
        <Flex height="100vh" alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      )}

      {!session && !loading && router.pathname.includes("/auth/") && (
        <Component {...pageProps} />
      )}
      {session && !loading && (
        <>
          <Flex paddingTop={12} height="100vh" direction="column">
            <Flex position="absolute" top={0} left={0} right={0} bgColor="indigo" px={4} height={12} alignItems="center" justifyContent="space-between">
              <Flex>
                <Button variant="ghost">
                  <HamburgerIcon />
                </Button>
                <Button variant="ghost">TEMPORIZADOR</Button>
              </Flex>
              <Button
                onClick={signout}
                fontSize={12} variant="ghost">SAIR</Button>
            </Flex>
            <Box flexGrow={1} overflow="auto">
              <Component {...pageProps} />
            </Box>
          </Flex>
        </>
      )}
    </ChakraProvider>
  )
}

export default MyApp
