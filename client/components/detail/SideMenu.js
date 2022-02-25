import {
	Flex,
	Box,
	Text,
	Button,
	IconButton,
	Input,
	Image,
	Heading,
	Divider,
	Stack,
	HStack,
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	BsThreeDots,
	BsSearch,
	BsGrid3X3GapFill,
	BsLockFill,
	BsGlobe2,
	BsPersonCircle,
	BsFillFileEarmarkTextFill,
	BsFillPencilFill,
} from "react-icons/bs";

const SideSectionHeader = ({ icon, style={}, title }) => {
	return (
		<Box
			display="flex"
			flexDirection="row"
			alignItems="center"
			marginBottom="1rem"
			color="gray.400"
			{...style}
		>
			{icon}
			<Heading alignSelf="center" marginLeft="0.5rem" size="xs">
				{title}
			</Heading>
		</Box>
	);
};

const BoardAuthor = ({ author }) => {
	return (
		<Box marginBottom="2rem">
			<SideSectionHeader icon={<BsPersonCircle />} title="Made by" />
			<HStack>
				<Image
					fallbackSrc={author.picture}
					width="2.5rem"
					height="2.5rem"
					borderRadius="md"
					marginRight="1rem"
				/>
				<Stack spacing="0">
					<Heading
						style={{ fontVariationSettings: "'wght' 600" }}
						size="sm"
					>
						{author.name}
					</Heading>
					<Text fontSize="sm">on 4 July, 2020</Text>
				</Stack>
			</HStack>
		</Box>
	);
};

const BoardDescription = ({ description }) => {
	return (
		<Box position="relative" marginBottom="2rem">
			<Flex flexDirection="row" alignContent="center" marginBottom="1rem">
				<SideSectionHeader
					icon={<BsFillFileEarmarkTextFill />}
					title="Description"
					style={{ marginBottom: "0!important", marginRight: "1rem" }}
				/>
				<Button
					variant="outline"
					leftIcon={<BsFillPencilFill />}
					size="sm"
					border="2px"
					color="gray.400"
				>
					Edit
				</Button>
			</Flex>
			<Text>{description}</Text>
		</Box>
	);
};

const BoardMembers = () => {
	const membersData = [
		{
			name: "Bames Jond",
			picture: "https://via.placeholder.com/40",
		},
		{
			name: "Bames Jond",
			picture: "https://via.placeholder.com/40",
		},
		{
			name: "Bames Jond",
			picture: "https://via.placeholder.com/40",
		},
	];

	const membersElement = membersData.map((person) => (
		<HStack marginBottom="1rem">
			<Image
				fallbackSrc={person.picture}
				width="2.5rem"
				height="2.5rem"
				borderRadius="md"
				marginRight="1rem"
			/>
			<Stack spacing="0">
				<Heading
					style={{ fontVariationSettings: "'wght' 600" }}
					size="sm"
				>
					{person.name}
				</Heading>
			</Stack>
		</HStack>
	));

	return (
		<Box marginBottom="2rem">
			<SideSectionHeader
				icon={<BsFillFileEarmarkTextFill />}
				title="Members"
			/>
			{membersElement}
		</Box>
	);
};

export const SideMenu = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	return (
		<>
			<Button leftIcon={<BsThreeDots />} onClick={onOpen}>
				Show Menu
			</Button>
			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				size="sm"
			>
				<DrawerOverlay display="none" />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Board Menu</DrawerHeader>
					<Divider />
					<DrawerBody padding="1rem">
						<BoardAuthor
							author={{
								name: "Jond Bames",
								picture: "https://via.placeholder.com/40",
							}}
						/>
						<BoardDescription description="Desc" />
						<BoardMembers />
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideMenu;
