import { Button } from "@chakra-ui/react";
import { BsPlusLg } from "react-icons/bs";
import { buttonStyle, modifiedGhostStyle } from "../styling/ComponentStyling";
import { useContext, useState } from "react";
import AccessContext from "../utility/AccessContext";

export const NewButton = ({ purpose, trigger }) => {
	const { level, memberLv } = useContext(AccessContext);
	const [loading, setLoading] = useState(false);

	async function job() {
		setLoading(true);
		await trigger().then(() => {
			setLoading(false);
		});
	}

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
		style = {
			...style,
			position: "absolute",
			marginTop: "0.25rem",
		}
	
	if(loading)
		style = {
			...style,
			justifyContent: "center"
		}

	return (
		<Button {...style} onClick={job} isLoading={loading}>
			{showText}
		</Button>
	);
};

export default NewButton;
