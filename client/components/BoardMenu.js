import {
	Flex,
	Box,
	Text,
	HStack,
	Button,
	IconButton,
	Input,
	Image,
	Heading,
	Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsSearch, BsGrid3X3GapFill, BsLockFill } from "react-icons/bs";
import ChangeVisibility from "./detail/ChangeVisibility";
import BoardMembers from "./detail/BoardMembers";
import SideMenu from "./detail/SideMenu";

const BoardMenu = (props) => {
	const router = useRouter();

	return (
		<Flex
			alignItems="center"
			justifyContent="space-between"
			marginTop="2rem"
			padding="1rem 4rem"
			width="100vw"
			height="4rem"
			zIndex="50"
		>
			<HStack spacing="1rem">
				<ChangeVisibility />
				<BoardMembers />
			</HStack>
			<SideMenu />
		</Flex>
	);
};

export default BoardMenu;
