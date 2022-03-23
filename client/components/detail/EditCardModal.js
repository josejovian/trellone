// Styling
import {
	Flex,
	Box,
	Text,
	HStack,
	Button,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useToast,
	Link as ChakraLink,
} from "@chakra-ui/react";
import {
	BsPaperclip,
	BsPlusLg,
	BsPersonCircle,
	BsFillGearFill,
} from "react-icons/bs";

// Components
import Members from "./Members";
import DetailHeader, { DetailHeaderWithButton } from "./DetailHeader";
import ActionCover from "./ActionCover";
import ActionLabels from "./ActionLabel";
import ActionMembers from "./ActionMember";
import ChangeDescription from "./ChangeDescription";
import ChangeName from "./ChangeName";
import Comments from "./Comments";
import Attachments from "./Attachments";

// Utility
import { showToast, showStandardToast } from "../utility/Toast";
import { AccessContext } from "../utility/AccessContext";
import { SocketContext } from "../utility/SocketContext";

// Misc
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import api, { updateCard } from "../API";

const EditCardModal = ({
	isOpen,
	onOpen,
	onClose,
	name = "",
	_id,
	pictureURL,
	pictureAuthorURL,
	pictureAuthorName,
	listName = "",
	description = "",
	comments,
	members,
	boardMembers,
	attachments,
	allTags,
	tags,
	loggedIn,
	setCard,
	addMember,
	removeMember,
}) => {
	const [picture, setPicture] = useState({
		pictureURL: pictureURL,
		pictureAuthorURL: pictureAuthorURL,
		pictureAuthorName: pictureAuthorName,
	});

	function _isOpen() {
		// if (pictureURL !== picture.pictureURL) {
		// 	setPicture({
		// 		pictureURL,
		// 		pictureAuthorURL,
		// 		pictureAuthorName,
		// 	});
		// }
		return isOpen;
	}

	const [_tags, setTags] = useState(tags);
	const [_allTags, setAllTags] = useState(allTags);
	const [changes, setChanges] = useState({
		tags: false,
		picture: false,
	});

	const toast = useToast();
	const toastIdRef = useRef();
	const { level, memberLv } = useContext(AccessContext);
	const { socket } = useContext(SocketContext);

	useEffect(() => {
		setTags(tags);
		setAllTags(allTags);
		setPicture({
			pictureURL,
			pictureAuthorURL,
			pictureAuthorName,
		});
		setChanges({
			tags: false,
			picture: false,
		});
	}, [_id]);

	async function updateData(data) {
		if (data !== null && data !== undefined)
			await updateCard(loggedIn._id, _id, data, toast, toastIdRef);
	}

	function _setTags(data) {
		setTags(data);
		setChanges({ ...changes, tags: true });
	}

	function _setPicture(data) {
		setPicture(data);
		setChanges({ ...changes, picture: true });
	}

	async function deleteCard() {
		await api
			.delete(`/card/${_id}`)
			.then((response) => {
				onClose();
				socket.emit("card_delete", response.data);
			})
			.catch((e) => {});
	}

	async function updateRemainingData() {
		let data = {};
		
		if (level >= memberLv && changes.tags) {
			data = {
				...data,
				tags: _tags,
			};
		}
		if (level >= memberLv && changes.picture) {
			data = {
				...data,
				picture: picture,
			};
		}

		if (changes.tags || changes.picture) {
			await updateCard(loggedIn._id, _id, data, toast, toastIdRef);
		}

		onClose();
	}

	return (
		<Modal isOpen={_isOpen()} onClose={updateRemainingData} isLazy>
			<ModalOverlay />
			<ModalContent maxWidth="100vw" width="52rem" height="max-content">
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
							src={picture.pictureURL}
							fallbackSrc="https://via.placeholder.com/384"
						/>
						<Box
							backgroundColor="white"
							borderRadius="0.25rem"
							padding="0rem 0.5rem"
							position="absolute"
							bottom="0.5rem"
							right="0.5rem"
							fontSize="0.75rem"
							display={
								picture.pictureURL !== "" ? "initial" : "none"
							}
						>
							<Text>
								Photo taken by{" "}
								<ChakraLink
									textDecoration="underline"
									href={
										picture.pictureAuthorURL !== null
											? picture.pictureAuthorURL
											: ""
									}
								>
									{picture.pictureAuthorName !== null
										? picture.pictureAuthorName
										: ""}
								</ChakraLink>
							</Text>
						</Box>
					</Box>
				</ModalHeader>
				<ModalBody padding="1rem">
					<Flex>
						<Box width="32rem" marginRight="2rem">
							<Box marginBottom="2rem">
								<ChangeName
									title={name}
									purpose="card"
									handler={updateData}
								/>
								<HStack fontSize="0.8rem" marginLeft="12px">
									<Text
										color="gray"
										style={{
											fontVariationSettings: "'wght' 600",
										}}
									>
										in list
									</Text>
									<Text
										style={{
											fontVariationSettings: "'wght' 800",
										}}
									>
										{listName}
									</Text>
								</HStack>
							</Box>
							<ChangeDescription
								description={description}
								purpose="card"
								handler={updateData}
							/>
							<Box marginBottom="2rem">
								<Attachments
									id={_id}
									attachments={attachments}
								/>
							</Box>
							<Box marginBottom="2rem" position="static">
								<Comments
									id={_id}
									loggedIn={loggedIn}
									comments={comments}
								/>
							</Box>
						</Box>
						<Box width="16rem">
							<Box
								display={level < memberLv ? "none" : "initial"}
							>
								<DetailHeader
									icon={<BsFillGearFill />}
									title="Actions"
									style={{
										marginBottom: "0",
									}}
								/>
								<HStack spacing="0.5rem">
									<ActionCover
										toastIdRef={toastIdRef}
										purpose="card"
										handler={_setPicture}
										deleteHandler={() =>
											_setPicture({
												pictureURL: "",
												pictureAuthorURL: "",
												pictureAuthorName: "",
											})
										}
										isDisabled={(level < memberLv)}
									/>
									<ActionLabels
										toastIdRef={toastIdRef}
										allTags={_allTags}
										setAllTags={setAllTags}
										tags={_tags}
										setTags={_setTags}
										isDisabled={(level < memberLv)}
									/>
								</HStack>
							</Box>
							<Box>
								<DetailHeader
									icon={<BsPersonCircle />}
									title="Members"
									style={{
										marginTop:
											level < memberLv ? "0rem" : "1rem",
										marginBottom: "0rem",
									}}
								/>
								<Members
									id={_id}
									members={members}
									allMembers={boardMembers}
									showAddMembers={true}
									purpose="card"
									handler={removeMember}
								/>
								<ActionMembers
									members={boardMembers}
									handler={(type, member) =>
										addMember(type, _id, member)
									}
								/>
							</Box>
						</Box>
					</Flex>
				</ModalBody>
				<ModalFooter display={level < memberLv ? "none" : "flex"}>
					<Button colorScheme="red" onClick={() => deleteCard()}>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default EditCardModal;
