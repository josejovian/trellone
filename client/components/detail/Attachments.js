// Styling
import {
	Box,
	Text,
	Button,
	Input,
	Image,
	Link,
	Stack,
	HStack,
	Textarea,
	useToast
} from "@chakra-ui/react";
import {
	BsPaperclip,
} from "react-icons/bs";
import { buttonStyle, modifiedGhostStyle } from "../styling/ComponentStyling";

// Components
import DetailHeader from "./DetailHeader";

// Redux
import { mapDispatchToProps, mapStateToProps } from "../redux/setter";
import { connect } from "react-redux";

// Misc
import { useState, useContext, useRef } from "react";
import { prettifyDate, getCurrentDate } from "../utility/Date";
import { AccessContext } from "../utility/AccessContext";
import { SocketContext } from "../utility/SocketContext";

// API
import { updateCard } from "../API";

export const AddAttachments = ({ loggedIn }) => {
	const inputStyle = {
		position: "absolute",
		padding: "1rem 0rem 1rem 4rem",
		lineHeight: "2rem",
		_focus: { outline: "" },
		marginBottom: "0.5rem",
		border: "1px solid",
		width: "100%",
		borderRadius: "md",
		borderColor: "gray.200",
	};

	return (
		<Box
			position="relative"
			display={loggedIn !== null ? "initial" : "none"}
			marginBottom="2rem"
		>
			<Image
				position="absolute"
				src={loggedIn.pictureURL}
				top="1rem"
				left="1rem"
				width="2rem"
				height="2rem"
				borderRadius="sm"
			/>
			<Textarea
				{...inputStyle}
				position="relative"
				id="new-comment"
				placeholder="Write a comment..."
				zIndex="30"
				minHeight="4rem"
				maxHeight="10rem"
				maxLength="127"
			></Textarea>
		</Box>
	);
};

const UploadAttachment = ({ handler, isDisabled=false }) => {

	const [file, setFile] = useState(null);

	function getFile() {
		return document.getElementById("upload-attachment").files[0];
	}

	function getAndSetFile() {
		const upload = getFile();
		setFile(upload.name);
	}

	function submitFile() {
		if(file !== null) {
			handler(file);
			setFile(null);
		}
	}

	return (
		<HStack display={isDisabled ? "none" : "flex"}>
			<Box position="relative" overflow="hidden" display="inline-block">
				<Button
					{...buttonStyle}
					{...modifiedGhostStyle("gray")}
				>
					Choose File
				</Button>
				<Input
					position="absolute"
					left="0"
					top="0"
					opacity="0"
					type="file"
					id="upload-attachment"
					onChange={() => getAndSetFile()}
				/>
			</Box>
			<Text>
				{ file }
			</Text>
			<Button
				{...buttonStyle}
				{...modifiedGhostStyle((file) ? "blue" : "gray")}
				onClick={() => submitFile()}
				display={(file) ? "initial" : "none"}
				isDisabled={isDisabled}
			>
				Submit
			</Button>
		</HStack>
	);
};

const Attachments = ({ loggedIn, id, currentCard, attachments }) => {
	const [loading, setLoading] = useState(false);
	const { level, memberLv } = useContext(AccessContext);
	const { socket } = useContext(SocketContext);

	const toast = useToast();
	const toastIdRef = useRef();

	const attachmentsElement = attachments.map((attachment, index) => {
		return (
			<HStack
				key={`attachment-${currentCard._id}-${attachment.createdAt}`}
				position="relative"
				borderTop={index === 0 ? "0px" : "1px solid"}
				borderColor="gray.200"
				paddingBottom="1rem"
				paddingTop="1rem"
				spacing="2rem"
			>
				<Box
					width="6rem"
					height="6rem"
					bg="lightgray"
					borderRadius="lg"
				></Box>
				<Stack>
					<Text color="gray" fontSize="xs">
						Added {prettifyDate(attachment.createdAt, false)}
					</Text>
					<Text>{attachment.name}</Text>
					<HStack spacing="1rem">
						<Link download={attachment.name} href={attachment.base64} _hover={{textDecoration: "none"}}>
							<Button
								{...buttonStyle}
								{...modifiedGhostStyle("green")}
							>
								Download
							</Button>
						</Link>
						<Button {...buttonStyle} {...modifiedGhostStyle("red")} onClick={() => deleteAttachment(attachment.name)}>
							Delete
						</Button>
					</HStack>
				</Stack>
			</HStack>
		);
	});

	async function deleteAttachment(name) {
		await updateCard(loggedIn._id, id, {
			attachments: attachments.filter((att) => {
				return att.name !== name
			})
		}).then(() => {
			setCard(_card, list.name);
			socket.emit("attachment_delete", {
				cardID: id,
			});
			setLoading(false);
		})
	}

	/*
		Source:
		https://stackoverflow.com/a/57272491
	*/
	const toBase64 = file => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});	

	async function submitAttachments() {
		const input = document.getElementById("upload-attachment");
		const file = input.files[0];
		setLoading(true);

		if (file) {	
			const attachment = {
				name: file.name,
				base64: await toBase64(file),
				createdAt: getCurrentDate()
			}

			for(let i = 0; i < attachments.length; i++) {
				if(attachments[i].name === attachment.name) {
					setLoading(false);
					return;
				}
			}

			// Maximum file size, approx 0.5 MB
			if(file.size/1024/1024 > 0.5) {
				input.value = "";
				setLoading(false);
				return;
			}
			
			await updateCard(loggedIn._id, id, {
				attachments: [...attachments, attachment]
			}, toast, toastIdRef).then((response) => {
				if(response.status === 200) {
					socket.emit("attachment_new", {
						cardID: id,
						attachment: attachment
					});
				}
				input.value = "";
				setLoading(false);
			});
		} else {
			setLoading(false);
		}
	}

	return (
		<>
			<HStack>
				<DetailHeader
					icon={<BsPaperclip />}
					title={`Attachments`}
					style={{
						marginBottom: "0",
						marginRight: "1rem",
					}}
					buttonTitle="Upload"
					props={{
						display: level < memberLv ? "none" : "flex",
						colorScheme: "blue",
						isDisabled: loading || level < memberLv,
					}}
					trigger={() => {}}
				/>
				<UploadAttachment isDisabled={(level < memberLv)} handler={() => submitAttachments()} />
			</HStack>
			{attachmentsElement}
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Attachments);