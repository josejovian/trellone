// Styling
import {
	Flex,
	Box,
	Text,
	Button,
	IconButton,
	Image,
	Heading,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	Stack,
	HStack,
} from "@chakra-ui/react";
import {
	BsPlusLg,
	BsFillFileEarmarkTextFill,
	BsFillTrashFill
} from "react-icons/bs";
import {
	buttonStyle,
	modifiedGhostStyle,
} from "../styling/ComponentStyling";

// Page Components
import { PopoverStyledHeader } from "./StyledPopover";
import DetailHeader from "./DetailHeader";
import Search from "../Search";
import CardActionButton from "./CardActionButton";

// Misc
import { useEffect, useState, useContext } from "react";
import { AccessContext } from "../utility/AccessContext";

const QueryResults = ({ members, purpose, handler = () => {} }) => {
	const membersElement = members.map((data) => (
		<Button
			key={`${purpose}-${data._id}`}
			justifyContent="flex-start"
			padding="1.5rem"
			backgroundColor="white"
			borderRadius="sm"
			variant="ghost"
			onClick={() => handler(purpose, data)}
		>
			<HStack>
				<Image
					src={data.pictureURL}
					width="2.5rem"
					height="2.5rem"
					borderRadius="md"
				/>
				<Text>{data.name}</Text>
			</HStack>
		</Button>
	));

	if (members.length === 0) {
		return <></>;
	}

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

export const MemberSnippet = ({
	id,
	purpose,
	person,
	text,
	style,
	removable = false,
	handler = () => {},
}) => {
	
	
	return (
		<HStack
			position="relative"
			marginTop="1rem"
			marginBottom="1rem"
			{...style}
		>
			<Image
				src={person.pictureURL}
				fallbackSrc={"https://via.placeholder.com/48"}
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
				<Text
					color="gray"
					fontSize="sm"
					display={text === undefined ? "none" : "initial"}
				>
					{text}
				</Text>
			</Stack>
			<IconButton
				position="absolute"
				right="0"
				{...buttonStyle}
				{...modifiedGhostStyle("red")}
				display={removable ? "flex" : "none"}
				onClick={() => handler(purpose, id, person)}
				icon={<BsFillTrashFill />}
			/>
		</HStack>
	);
};

export const AddMembers = ({
	members,
	button,
	purpose,
	handler = () => {},
}) => {
	const [view, setView] = useState([]);
	const [loading, setLoading] = useState(false);

	const { level } = useContext(AccessContext);

	let prompt = ["Add to Board", "Find the users to add."];

	if (purpose === "card") {
		prompt = ["Members", "Assign members to this card."];
	}

	const inputID = `member-search-${purpose}`;

	let buttonElement = (
		<IconButton
			alignItems="center"
			justifyContent="center"
			icon={<BsPlusLg />}
			borderRadius="full"
			variant="ghost"
			display={level < 2 ? "none" : "flex"}
			{...modifiedGhostStyle()}
			isDisabled={level < 2}
		/>
	);

	async function search() {
		const query = document.getElementById(inputID);

		setLoading(true);
		if (query !== null && query.value !== "") {
			const name = query.value;

			console;
			setView(
				members.filter((member) => {
					const memberName = member.name;
					return memberName.includes(name);
				}),
				setLoading(false)
			);
		}
	}

	if (purpose === "card")
		buttonElement = (
			<CardActionButton
				style={{
					display: level < 1 ? "none" : "flex",
					colorScheme: "blue",
					variant: "outline",
				}}
				icon={<BsPlusLg />}
				text="Assign a member"
				isDisabled={level < 1}
			/>
		);

	return (
		<Popover
			placement="bottom-start"
			width="min-content"
			isLazy
		>
			<PopoverTrigger><Box>{buttonElement}</Box></PopoverTrigger>
			<PopoverContent top={purpose === "card" ? "" : ""}>
				<PopoverStyledHeader title={prompt[0]} desc={prompt[1]} />
				<PopoverBody>
					{/* <Flex alignItems="center" position="relative">
						<Input
							id={inputID}
							width="24rem"
							placeholder="User..."
							zIndex="1"
							boxShadow="md"
						/>
						<IconButton
							size="sm"
							position="absolute"
							right="4px"
							colorScheme="blue"
							icon={<BsSearch />}
							onClick={() => search()}
							zIndex="2"
						/>
					</Flex> */}
					<Search id={inputID} handler={search} />
					<QueryResults
						members={view}
						handler={handler}
						purpose={purpose}
					/>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

const Members = ({
	author,
	members = [],
	purpose,
	displayType,
	showAddMember = false,
	allMembers = [],
	loggedIn,
	board,
	id,
	limit = 5,
	style = {},
	handler = () => {},
}) => {
	

	const membersData = [
		{
			name: "Bames Jond",
			pictureURL: "https://via.placeholder.com/40",
		},
		{
			name: "Bames Jond",
			pictureURL: "https://via.placeholder.com/40",
		},
		{
			name: "Bames Jond",
			pictureURL: "https://via.placeholder.com/40",
		},
	];

	function determineRemovable(id) {
		return (purpose === "board" && (String(author._id) !== String(id) && String(id) !== String(loggedIn._id))) || purpose === "card";
	}

	if (
		purpose !== "card" &&
		author !== undefined &&
		(members.length == 0 ||
			(members.length > 0 && members[0].githubID !== author.githubID))
	)
		members.unshift(author);

	const notShownMembers = members.length - limit;

	const shownMembers = Math.min(members.length, limit);

	const membersElement = members
		.filter((person, index) => {
			return index + 1 <= shownMembers;
		})
		.map((person, index) => {
			// Tailored for the member list below the navigation bar.
			if (displayType === "avatar")
				return (
					<Image
						key={`${purpose}-${displayType}-${id}-${person._id}`}
						src={person.pictureURL}
						fallbackSrc={"https://via.placeholder.com/48"}
						width="2.5rem"
						height="2.5rem"
						borderRadius="full"
						userSelect="none"
						alt={person.pictureAuthorName}
						title={person.pictureAuthorName}
						zIndex="1000"
					/>
				);

			// Tailored for the member list on the sidebar.
			return (
				<MemberSnippet
					key={`${purpose}-${displayType}-${id}-${person._id}`}
					id={id}
					purpose={purpose}
					person={person}
					removable={determineRemovable(person._id)}
					handler={handler}
				/>
			);
		});

	if (notShownMembers > 0) {
		membersElement.push(
			<Flex
				width="2.5rem"
				height="2.5rem"
				borderRadius="full"
				backgroundColor="gray.200"
				justifyContent="center"
				alignItems="center"
			>
				<Text fontSize="xs">{`${notShownMembers}+`}</Text>
			</Flex>
		);
	}

	let addMembers = <></>;

	// if (showAddMember)
	// 	addMembers = (
	// 		<AddMembers
	// 			members={allMembers}
	// 			purpose={purpose}
	// 			board={board}
	// 			loggedIn={loggedIn}
	// 		/>
	// 	);

	if (purpose === "card") return <>{membersElement}</>;

	if (displayType === "avatar")
		return (
			<HStack spacing="1rem" {...style}>
				{membersElement}
				{showAddMember ? addMembers : <></>}
			</HStack>
		);

	return (
		<Box marginBottom="2rem">
			<DetailHeader
				icon={<BsFillFileEarmarkTextFill />}
				title="Members"
			/>
			{membersElement}
		</Box>
	);
};

export default Members;
