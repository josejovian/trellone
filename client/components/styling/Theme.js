import { extendTheme } from "@chakra-ui/react";

const config = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

export const theme = extendTheme({
	config,
	components: {
		Button: {
			baseStyle: {
				_focus: {
					boxShadow:
						"0 0 0 3px var(--chakra-colors-orange-200)!important",
				},
				borderRadius: "full"
			},
			defaultProps: {
				colorScheme: "orange",
				borderRadius: "full"
			},
		},
		Input: {
			baseStyle: {
				_focus: {
					outline:
						"0 0 0 3px var(--chakra-colors-orange-200)!important",
				},
			},
			defaultProps: {
				focusBorderColor: "orange.200",
			},
		},
		Textarea: {
			baseStyle: {
				_focus: {
					outline:
						"0 0 0 3px var(--chakra-colors-orange-200)!important",
				},
			},
			defaultProps: {
				focusBorderColor: "orange.200",
			},
		},
	},
	shadows: {
		boxShadow: "0 0 0 3px var(--chakra-colors-orange-200)!important",
		outline: "0 0 0 3px var(--chakra-colors-orange-200)!important",
	},
	fonts: {
		body: "NotoSansDisplay, system-ui, sans-serif",
		heading: "Montserrat, serif",
		mono: "Menlo, monospace",
	},
});

export default theme;
