// Styling
import { Flex, Box, useDisclosure, useToast } from "@chakra-ui/react";

// Components
import ListColumn from "./detail/ListColumn";
import EditCardModal from "./detail/EditCardModal";

// Redux
import { mapDispatchToProps, mapStateToProps } from "./redux/setter";
import { connect } from "react-redux";

// Utility
import { showStandardToast } from "./utility/Toast";
import DragContext from "./utility/DragContext";
import SocketContext from "./utility/SocketContext";

// Misc
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import api, { updateCard } from "./API";

const ListHeaderBar = () => {
	return (
		<Box
			position="fixed"
			top="12rem"
			width="100vw"
			height="4rem"
			zIndex="1"
			background="white"
			borderBottom="1px solid"
			borderColor="gray.200"
		></Box>
	);
};

const BoardContent = ({
	board,
	id,
	currentCard,
	setCard,
	currentList,
	currentTags,
	loggedIn,
	setBoard,
	addMember,
	removeMember,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [currentDrag, setDrag] = useState(false);

	const router = useRouter();

	let lists = board.lists;

	if (lists === undefined) lists = [];

	function setFocus(newCard) {
		setCard(newCard);
		onOpen();
	}

	const listElements = lists.map((value) => {
		return (
			<ListColumn
				key={`list-${value._id}`}
				list={value}
				onOpen={onOpen}
				boardID={board._id}
			/>
		);
	});

	useEffect(() => {
		if(board)
			setBoard(board.name);
		else
			setBoard("");
	}, []);

	listElements.push(
		<ListColumn
			key={`new-list-button`}
			purpose="New List"
			boardID={board._id}
		/>
	);

	return (
		<>
			<ListHeaderBar />
			<Box
				position="relative"
				marginTop="2rem"
				height="calc(100vh - 12rem)"
				overflowY="hidden"
				bg="gray.50"
			>
				<DragContext.Provider
					value={{
						currentDrag,
						setDrag,
					}}
				>
					<Flex
						alignItems="flex-start"
						padding="4rem 4rem"
						minWidth="0"
						width={lists.length > 1 ? "max-content" : "100%"}
						background="#F8F9FD"
						zIndex="50"
						overflowY="hidden"
					>
						{listElements}
					</Flex>
				</DragContext.Provider>
			</Box>
			<EditCardModal
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				{...currentCard}
				allTags={currentTags}
				listName={currentList}
				loggedIn={loggedIn}
				boardMembers={board.members}
				setBoard={setBoard}
				setCard={setCard}
				addMember={addMember}
				removeMember={removeMember}
			/>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardContent);
