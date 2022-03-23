import {
	Box,
	Text,
	Button,
	Image,
	Stack,
	HStack,
	Textarea,
	useToast
} from "@chakra-ui/react";
import { useState, useContext, useRef } from "react";
import {
	BsFillChatFill,
} from "react-icons/bs";
import { DetailHeaderWithButton } from "./DetailHeader";
import { mapDispatchToProps, mapStateToProps } from "../redux/setter";
import { connect } from "react-redux";
import { MemberSnippet } from "./Members";
import { prettifyDate } from "../utility/Date";
import { AccessContext } from "../utility/AccessContext";
import { SocketContext } from "../utility/SocketContext";
import { showToast } from "../utility/Toast";
import api from "../API";

export const AddComment = ({ loggedIn }) => {
	const [empty, setEmpty] = useState(true);

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
			<Image
				position="absolute"
				src={loggedIn.pictureURL}
				top="1rem"
				left="1rem"
				width="2rem"
				height="2rem"
				borderRadius="sm"
				zIndex="1000"
			/>
		</Box>
	);
};

const Comments = ({ loggedIn, cardID, id, comments, handler }) => {
	const [empty, setEmpty] = useState(true);
	const [loading, setLoading] = useState(false);
	const [focus, setFocus] = useState(null);
	const [input, setInput] = useState(null);

	const toast = useToast();
	const toastIdRef = useRef();
	const { socket } = useContext(SocketContext);
	const { level, memberLv } = useContext(AccessContext);
	

	function focusEdit(commentID, value) {
		setFocus(commentID);
		setInput(value);
	}

	function handleInput(e) {
		setInput(e.target.value);
	}

	function unfocus() {
		setFocus(null);
		setInput(null);
	}

	async function saveComment(commentID) {
		const comment = document.getElementById("current-comment-edit");

		if (comment !== null && comment.value !== "") {
			await api
				.post(`/comment/${commentID}`, {
					content: comment.value,
					userID: loggedIn._id,
				})
				.then((response) => {
					setFocus(null);
					if(response.status !== 200)
						showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
					else {
						socket.emit("comment_update", response.data);
					}
				});
		}
	}

	async function deleteComment(commentID) {
		await api.delete(`/comment/${commentID}`, {
			userID: loggedIn._id
		}).then((response) => {
			if(response.status !== 200)
				showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
			else {
				socket.emit("comment_delete", response.data);
			}
		});
	}

	const commentsElement = comments.map((comment, index) => {
		function isBeingEdited() {
			return focus !== null && comment._id === focus;
		}

		const stackStyle = {
			position: "absolute",
			top: "2rem",
			right: "0",
			display:
				loggedIn.githubID === comment.author.githubID ? "flex" : "none",
		};

		return (
			<Box
				position="relative"
				borderTop={index === 0 ? "0px" : "1px solid"}
				borderColor="gray.200"
				paddingBottom="2rem"
				paddingTop="2rem"
			>
				<MemberSnippet
					person={comment.author}
					text={prettifyDate(comment.createdAt, true)}
				/>

				{isBeingEdited() ? (
					<HStack {...stackStyle}>
						<Button
							variant="link"
							onClick={() => saveComment(comment._id)}
						>
							Save
						</Button>
						<Text>{"|"}</Text>
						<Button variant="link" onClick={() => unfocus()}>
							Cancel
						</Button>
					</HStack>
				) : (
					<HStack {...stackStyle}>
						<Button
							variant="link"
							onClick={() =>
								focusEdit(comment._id, comment.content)
							}
						>
							Edit
						</Button>
						<Text>{"|"}</Text>
						<Button
							variant="link"
							onClick={() => deleteComment(comment._id)}
						>
							Delete
						</Button>
					</HStack>
				)}
				<Box>
					{isBeingEdited() ? (
						<Textarea
							id="current-comment-edit"
							value={input}
							onChange={handleInput}
						></Textarea>
					) : (
						<Textarea value={comment.content} readOnly></Textarea>
					)}
				</Box>
			</Box>
		);
	});

	async function submitComment() {
		const comment = document.getElementById("new-comment");
		setLoading(true);
		if (comment !== null && comment.value !== "") {
			await api
				.post("/new/comment", {
					id: id,
					userID: loggedIn._id,
					content: comment.value,
				})
				.then((response) => {
					setLoading(false);
					comment.value = "";
					if(response.status !== 200)
						showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
					else {
						socket.emit("comment_new", response.data);
					}
				})
				.catch((e) => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}

	return (
		<>
			<DetailHeaderWithButton
				icon={<BsFillChatFill />}
				title="Comments"
				style={{
					marginBottom: "0",
					marginRight: "1rem",
				}}
				buttonTitle="Submit"
				props={{
					display: level < memberLv ? "none" : "flex",
					colorScheme: "blue",
					isDisabled: loading || level < memberLv,
				}}
				trigger={() => submitComment()}
			/>
			{level < memberLv ? <></> : <AddComment loggedIn={loggedIn} />}
			{commentsElement}
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
