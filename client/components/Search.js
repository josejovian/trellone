import {
	HStack,
	Button,
	Flex,
	IconButton,
	Input,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { buttonStyle, modifiedGhostStyle } from "./styling/ComponentStyling";

const Search = ({ id, handler, deleteHandler, isLoading=false, style }) => {

	function onClick() {
		const searchInput = document.getElementById(id);
		if(searchInput && searchInput.value !== "")
			handler();
	}

	return (
		<HStack {...style} width="100%">
			<Flex width="100%" alignItems="center" position="relative" >
				<Input
					id={id}
					placeholder="Keyword..."
					zIndex="1"
					height="2rem"
				/>
				<IconButton
					size="sm"
					position="absolute"
					right="4px"
					zIndex="2"
					variant="ghost"
					icon={<BsSearch />}
					onClick={() => onClick()}
					isLoading={isLoading}
				/>
			</Flex>
			<Button display={(deleteHandler) ? "flex" : "none"} {...buttonStyle} {...modifiedGhostStyle("red")} onClick={() => deleteHandler()}>
				Reset
			</Button>
		</HStack>
	);
};

export default Search;
