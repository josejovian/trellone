// Styling
import {
	Box,
	Button,
	Divider,
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useToast,
} from "@chakra-ui/react";
import { BsThreeDots, BsPersonCircle } from "react-icons/bs";

// Components
import DetailHeader, { DetailHeaderWithButton } from "./detail/DetailHeader";
import Members, { MemberSnippet } from "./detail/Members";
import ChangeDescription from "./detail/ChangeDescription";
import ChangeName from "./detail/ChangeName";
import { mapDispatchToProps, mapStateToProps } from "./redux/setter";
import { connect } from "react-redux";

// Misc
import { useRef } from "react";
import { prettifyDate } from "./utility/Date";
import { updateBoard } from "./API";

const BoardAuthor = ({
	name,
	pictureURL,
	createdAt = "1990-01-01T21:19:00.000Z",
}) => {
	return (
		<Box marginBottom="2rem">
			<DetailHeader icon={<BsPersonCircle />} title="Made by" />
			<MemberSnippet
				person={{ name, pictureURL }}
				text={prettifyDate(createdAt)}
			/>
		</Box>
	);
};

const BoardDescription = ({ description, handler }) => {
	return (
		<ChangeDescription
			description={description}
			purpose="board"
			handler={handler}
		/>
	);
};

export const SideMenu = ({
	name,
	author,
	description,
	members,
	createdAt,
	id,
	loggedIn,
	handler,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const toast = useToast();
	const toastIdRef = useRef();

	async function updateData(data) {
		if (data !== null && data !== undefined)
			await updateBoard(loggedIn._id, id, data, toast, toastIdRef);
	}

	return (
		<>
			<Button
				leftIcon={<BsThreeDots />}
				onClick={onOpen}
				colorScheme="gray"
			>
				Show Menu
			</Button>
			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				size="sm"
				isLazy
			>
				<DrawerOverlay opacity="0.2" />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader display="flex" alignItems="center">
						<ChangeName
							title={name}
							purpose="board"
							handler={updateData}
						/>
					</DrawerHeader>
					<Divider />
					<DrawerBody padding="1rem">
						<BoardAuthor {...author} createdAt={createdAt} />
						<BoardDescription
							description={description}
							handler={updateData}
						/>
						<Members
							id={id}
							loggedIn={loggedIn}
							members={members}
							author={author}
							purpose="board"
							displayType="list"
							handler={handler}
						/>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
