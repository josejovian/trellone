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
	Divider
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsSearch, BsGrid3X3GapFill } from "react-icons/bs"

const Navigation = (props) => {
	const router = useRouter();

	return (
		<Flex
			alignItems="center"
			justifyContent="space-between"
			position="fixed"
			top="0"
			padding="1rem 4rem"
			width="100vw"
			height="4rem"
			borderBottom="1px solid"
			borderBottomColor="gray.200"
			zIndex="100"
		>
			<Flex
				alignItems="center"
				justifyContent="space-between"
			>
				<Heading width="12rem" style={{ fontVariationSettings: "'wght' 500" }} size='md'>Trellone</Heading>
				<Button marginRight="1rem" leftIcon={<BsGrid3X3GapFill />}>
					All Boards
				</Button>
				<Heading size='md'>Untitled Board</Heading>
			</Flex>
			<Flex>
				<Flex
					alignItems="center"
					position="relative"
					boxShadow="md"
				>
					<Input 
						width="24rem"
						placeholder="Keyword..."
						zIndex="1"
					/>
					<IconButton
						size="sm"
						position="absolute"
						right="4px"
						colorScheme="blue"
						zIndex="2"
						icon={<BsSearch />}
					/>
				</Flex>
				<Flex 
					alignItems="center"
				>
					<Image
						fallbackSrc="https://via.placeholder.com/40"
						width="2.5rem"
						height="2.5rem"
						marginLeft="2rem"
						borderRadius="md"
					/>
					<Text
						marginLeft="1rem"
						fontWeight="bold"
					>
						Guest
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Navigation;
