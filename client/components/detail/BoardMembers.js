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
	Portal,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	Stack,
	HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	BsSearch,
	BsGrid3X3GapFill,
	BsPlusLg,
	BsLockFill,
	BsGlobe2,
} from "react-icons/bs";

const QueryResults = () => {
	const membersQuery = [
		{
			name: "Bames Jond",
			picture: "https://via.placeholder.com/40",
		},
		{
			name: "John Doe",
			picture: "https://via.placeholder.com/40",
		},
	];

	const membersElement = membersQuery.map((data) => (
		<Button justifyContent="flex-start" padding="1.5rem" backgroundColor="white" borderRadius="sm">
			<HStack>
				<Image
					fallbackSrc={data.picture}
					width="2.5rem"
					height="2.5rem"
					borderRadius="md"
				/>
				<Text>{data.name}</Text>
			</HStack>
		</Button>
	));

	return (
		<Stack
			marginTop="0.5rem"
			padding="0.5rem"
			border="1px solid"
			borderColor="gray.200"
			borderRadius="md"
			boxShadow="md"
		>
			{membersElement}
		</Stack>
	);
};

const AddMembers = () => {
	return (
		<Popover placement="bottom-start" width="min-content">
			<PopoverTrigger>
				<IconButton
					alignItems="center"
					justifyContent="center"
					colorScheme="blue"
					icon={<BsPlusLg />}
				/>
			</PopoverTrigger>
			<Portal>
				<PopoverContent>
					<PopoverHeader border="none">
						<Heading size="sm">Invite to Board</Heading>
						Find the users to invite.
					</PopoverHeader>
					<PopoverBody>
						<Flex
							alignItems="center"
							position="relative"
							boxShadow="md"
						>
							<Input
								width="24rem"
								placeholder="User..."
								zIndex="1"
							/>
							<IconButton
								size="sm"
								position="absolute"
								right="4px"
								colorScheme="blue"
								icon={<BsSearch />}
								zIndex="2"
							/>
						</Flex>
						<QueryResults />
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

export const BoardMembers = () => {
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

	const membersElement = membersData.map((data) => (
		<Image
			fallbackSrc={data.picture}
			width="2.5rem"
			height="2.5rem"
			borderRadius="md"
		/>
	));

	return (
		<HStack spacing="1rem">
			{membersElement}
			<AddMembers />
		</HStack>
	);
};

export default BoardMembers;
