import {
	Flex,
	Box,
	Button,
	Heading,
} from "@chakra-ui/react";
import { buttonStyle, modifiedGhostStyle } from "../styling/ComponentStyling";

export const DetailHeader = ({ icon, style, fontSize = "xs", title }) => {
	return (
		<Box
			display="flex"
			flexDirection="row"
			alignItems="center"
			marginBottom="1rem"
			color="gray.400"
			height="2rem"
			{...style}
			style={{ fontVariationSettings: "'wght' 600" }}
		>
			{icon}
			<Heading alignSelf="center" marginLeft="0.5rem" size={fontSize}>
				{title}
			</Heading>
		</Box>
	);
};

export const DetailHeaderWithButton = ({
	icon,
	textStyle,
	fontSize,
	title,
	buttonIcon,
	buttonTitle,
	trigger,
	props = {},
}) => {
	const newStyle = {
		...textStyle,
		marginBottom: "0!important",
		marginRight: "1rem",
	};

	let color;
	if(props.colorScheme !== undefined) {
		color = props.colorScheme; 
	}

	return (
		<Flex flexDirection="row" alignContent="center" marginBottom="1rem">
			<DetailHeader
				icon={icon}
				title={title}
				style={newStyle}
				fontSize={fontSize}
			/>
			<Button
				leftIcon={buttonIcon}
				onClick={trigger}
				{...props}
				{...buttonStyle}
				{...modifiedGhostStyle(color)}
			>
				{buttonTitle}
			</Button>
		</Flex>
	);
};

export const DetailHeaderWithButtons = ({
	icon,
	textStyle,
	fontSize,
	title,
	buttons,
}) => {
	const newStyle = {
		...textStyle,
		marginBottom: "0!important",
		marginRight: "1rem",
	};

	const buttonElements = buttons.map((button) => {
		const style = button.style;
		
		return (
			<Button
				key={`dh-${button.name}`}
				variant="outline"
				leftIcon={button.icon}
				size="sm"
				onClick={button.trigger}
				marginRight="1rem"
				{...style}
				{...buttonStyle}
				{...modifiedGhostStyle(style.colorScheme)}
			>
				{button.name}
			</Button>
		);
	});

	return (
		<Flex flexDirection="row" alignContent="center" marginBottom="1rem">
			<DetailHeader
				icon={icon}
				title={title}
				style={newStyle}
				fontSize={fontSize}
			/>
			{buttonElements}
		</Flex>
	);
};

export default DetailHeader;
