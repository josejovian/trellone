import { Button } from "@chakra-ui/react";
import { BsPlusLg } from "react-icons/bs";
import { buttonStyle, modifiedGhostStyle } from "../styling/ComponentStyling";
import { useContext } from "react";
import AccessContext from "../utility/AccessContext";

export const NewButton = ({ purpose, trigger }) => {
	const { level, memberLv } = useContext(AccessContext);

	let style = {
		...buttonStyle,
		width: "20rem",
		rightIcon: <BsPlusLg />,
		justifyContent: "space-between",
		_focus: { outline: "0px" },
		display: (level < memberLv) ? "none" : "flex",
		isDisabled: (level < memberLv),
		...modifiedGhostStyle(),
	};

	const showText = `Add a New ${purpose}`;

	if (purpose === "list")
		return (
			<Button
				{...style}
				position="absolute"
				marginTop="0.25rem"
				onClick={trigger}
			>
				{showText}
			</Button>
		);

	return (
		<Button {...style} onClick={trigger}>
			{showText}
		</Button>
	);
};

export default NewButton;
