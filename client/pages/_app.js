import { Box, ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import Navigation from "../components/Navigation.js";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { theme } from "../components/Theme";

function MyApp({ Component, pageProps }) {
	const path = useRouter().asPath;

	return (
		<ChakraProvider theme={theme}>
			<Navigation />
			<Box paddingTop="4rem">
				<Component {...pageProps} key={path} />
			</Box>
		</ChakraProvider>
	);
}

export default MyApp;
