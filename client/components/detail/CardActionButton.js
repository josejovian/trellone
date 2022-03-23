import {
	Button,
} from "@chakra-ui/react";
import { buttonStyle, modifiedGhostStyle } from "../styling/ComponentStyling";

export const CardActionButton = ({ icon, text, onClick, isDisabled, style={} }) => {
	let color;
	if(style.colorScheme !== undefined) {
		color = style.colorScheme; 
	}
	return (
		<Button
			justifyContent="center"
			leftIcon={icon}
			width="100%"
			onClick={onClick}
			{...style}
			{...buttonStyle}
			{...modifiedGhostStyle(color)}
			isDisabled={isDisabled}
		>
			{text}
		</Button>
	);
};

export default CardActionButton;