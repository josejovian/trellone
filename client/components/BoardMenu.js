// Styling
import {
	Flex,
	HStack,
	useToast
} from "@chakra-ui/react";

// Components
import SideMenu from "./SideMenu";
import ChangeVisibility from "./detail/ChangeVisibility";
import Members, { AddMembers } from "./detail/Members";

// Misc
import { useRef } from "react";
import { useRouter } from "next/router";
import { updateBoard } from "./API";

const BoardMenu = ({ board, loggedIn, id, allMembers, addMember, removeMember }) => {
	const toast = useToast();
	const toastIdRef = useRef();
	
	async function updateData(data) {
		await updateBoard(loggedIn._id, id, { isPublic: data }, toast, toastIdRef);
	}

	return (
		<Flex
			alignItems="center"
			justifyContent="space-between"
			padding="1rem 4rem"
			marginTop="2rem"
			width="100vw"
			height="4rem"
			zIndex="50"
		>
			<HStack spacing="1rem">
				<ChangeVisibility
					purpose="menu"
					visibility={board.isPublic}
					handler={updateData}
					board={board}
					loggedIn={loggedIn}
				/>
				<Members {...board} allMembers={allMembers} purpose="board" displayType="avatar" showAddMember={false} />
				<AddMembers
					purpose="board"
					members={allMembers}
					handler={(type, member) => addMember(type, id, member)}
				/>
			</HStack>
			<SideMenu {...board} id={id} handler={(type, id, member) => removeMember(type, id, member)} />
		</Flex>
	);
};

export default BoardMenu;
