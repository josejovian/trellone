// Styling
import {
	Box,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Heading,
	Button,
	Input,
	HStack,
	Text,
	Link as ChakraLink,
	useToast
} from "@chakra-ui/react";

// Page Components
import { showToast, showStandardToast } from "../utility/Toast";
import ActionCover from "./ActionCover";
import ChangeVisibility from "./ChangeVisibility";

// React
import { useState, useRef } from "react";

// Misc
import api from "../API";

/* ----------------------------- New Board Form ----------------------------- */

export const NewBoardModal = ({ isOpen, onClose, loggedIn, goToBoard }) => {
	const [picture, setPicture] = useState(null);
	const [isPublic, setIsPublic] = useState(true);
	const [loading, setLoading] = useState(false);

	const toast = useToast();
	const toastIdRef = useRef();

	function choosePicture(setting) {
		setPicture(setting);
	}

	function chooseVisibility(setting) {
		if (setting != isPublic) setIsPublic(setting);
	}

	async function validateCreateBoard() {
		setLoading(true);
		const nameInput = document.getElementById("createBoard-boardName");
		let name = "";

		if (nameInput !== null && nameInput.value !== "") name = nameInput.value;
		else {
			setLoading(false);
			showToast(toast, toastIdRef, "Oops!", "Name must be filled.", "error", 3000, true);
			return;
		}

		if (name.length > 0) {
			await api
				.post("/new/board", {
					id: loggedIn._id,
					name: name,
					pictureURL: (picture) ? picture.pictureURL : "",
					pictureAuthorName: (picture) ? picture.pictureAuthorName : "",
					pictureAuthorURL: (picture) ? picture.pictureAuthorURL : "",
					isPublic: isPublic,
				})
				.catch((e) => {
					setLoading(false);
					showStandardToast(toast, toastIdRef, "genericFail");
				})
				.then((response=null) => {
					setLoading(false);
					if(response === null) {
						showStandardToast(toast, toastIdRef, "genericFail");
					} else if(response.status !== 200) {
						showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
					} else {
						goToBoard(response.data._id);
					}
				});
		}
		/*
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	name: String,
	pictureURL: String,
	pictureAuthorName: String,
	pictureAuthorURL: String,
	description: String,
	isPublic: Boolean,
	lists: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	}],
	members: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	tags: [ String ],
				*/
	}

	function cleanUp() {
		onClose();
	}

	return (
		<Modal isOpen={isOpen} onClose={cleanUp} isLazy>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader padding="0" overflow="hidden">
					<Box
						width="100%"
						height="10rem"
						position="relative"
						overflow="hidden"
						borderRadius="0.375rem 0.375rem 0px 0px"
					>
						<Image
							position="absolute"
							top="0"
							left="0"
							width="100%"
							height="auto"
							src={picture !== null ? picture.pictureURL : ""}
							fallbackSrc="./placeholderCoverBoardAsCard.png"
						/>
						<Box
							backgroundColor="white"
							borderRadius="0.25rem"
							padding="0rem 0.5rem"
							position="absolute"
							bottom="0.5rem"
							right="0.5rem"
							fontSize="0.75rem"
							display={picture !== null ? "initial" : "none"}
						>
							<Text>
								Photo taken by{" "}
								<ChakraLink
									textDecoration="underline"
									href={
										picture !== null
											? picture.pictureAuthorURL
											: ""
									}
								>
									{picture !== null
										? picture.pictureAuthorName
										: ""}
								</ChakraLink>
							</Text>
						</Box>
					</Box>
				</ModalHeader>
				<ModalBody padding="1rem">
					<Heading as="h2" size="md" mb="1rem">
						Create New Board
					</Heading>
					<Input
						id="createBoard-boardName"
						placeholder="Board Name"
						zIndex="1"
						maxLength="20"
						marginBottom="1rem"
					/>
					<HStack spacing="1rem">
						<ActionCover
							style={{
								width: "100%",
								justifyContent: "center",
								zIndex: "1400",
							}}
							handler={choosePicture}
							deleteHandler={() =>
								setPicture(null)
							}
						/>
						<ChangeVisibility
							visibility={isPublic}
							purpose="newBoard"
							style={{ width: "100%" }}
							handler={chooseVisibility}
						/>
					</HStack>
				</ModalBody>
				<ModalFooter padding="1rem">
					<Button variant="ghost" mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={validateCreateBoard} isLoading={loading}>
						Submit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NewBoardModal;