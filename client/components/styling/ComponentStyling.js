export const popOverHeaderStyle = {
	border: "0px",
	fontVariationSettings: "'wght' 800",
};

export function modifiedGhostStyle(color="orange") {
	return {
		backgroundColor: `${color}.50`,
		color: `${color}.600`,
		_hover: {
			backgroundColor: `${color}.100`,
		},
		_active: {
			backgroundColor: `${color}.200`,
		},
	};
}

export const buttonStyle = {
	variant: "ghost",
	size: "sm",
}