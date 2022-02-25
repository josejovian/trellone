import { extendTheme } from "@chakra-ui/react";

const config = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

export const theme = extendTheme({
	config,
	fonts: {
		body: "NotoSansDisplay, system-ui, sans-serif",
		heading: "Montserrat, serif",
		mono: "Menlo, monospace",
	},
});

export default theme;