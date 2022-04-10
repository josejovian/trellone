// Styling
import { Box, Stack, useToast } from "@chakra-ui/react";

// Components
import ListHeader from "./ListHeader";
import ListCard from "./ListCard";
import NewButton from "./NewButton";

// Utility
import { showToast, showStandardToast } from "../utility/Toast";
import DragContext from "../utility/DragContext";

// Misc
import { useRef, useContext, useState } from "react";
import { useRouter } from "next/router";
import api from "../API";
import { useDrop } from "react-dnd";
import SocketContext from "../utility/SocketContext";
import AccessContext from "../utility/AccessContext";

import { mapDispatchToProps, mapStateToProps } from "../redux/setter";
import { connect } from "react-redux";

export const CardDropZone = ({
	boardID,
	listID,
	cardID,
	cardIndex,
	switchCard,
	currentDrag,
}) => {

	const [ color, setColor ] = useState("blue");

	let dropStyle = {
		bg: currentDrag ? `${color}.50` : "initial",
		border: currentDrag ? "1px solid" : "initial",
		borderColor: `${color}.300`,
		borderRadius: "xl"
	}

	function canDropLogic(item) {
		return listID !== item.listID
			? true
			: Math.abs(parseFloat(item.cardIndex) - parseFloat(cardIndex)) >
					0.5;
	}

	const [{ isOver, canDrop, hover }, drop] = useDrop(
		() => ({
			accept: "card",
			canDrop: (item) => canDropLogic(item),
			hover: (item) => canDropLogic(item),
			drop: (item, monitor) => {
				return switchCard(item, {
					listID,
					cardID,
					cardIndex,
				})
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			}),
		}),
		[]
	);

	return (
		<Box
			display={
				currentDrag &&
				currentDrag.listID === listID &&
				Math.abs(currentDrag.cardIndex - cardIndex) <= 0.5
					? "none"
					: "initial"
			}
			ref={drop}
			width="20rem"
			height="32px"
			bg={currentDrag ? (isOver && canDrop) ? "green.100" : "blue.100" : "initial"}
			border={currentDrag ? "0px solid" : "initial"}
			borderColor={isOver && canDrop ? "green.300" : "blue.300"}
			borderRadius="xl"
		></Box>
	);
};

export const ListColumn = ({ list, onOpen, purpose, boardID, loggedIn }) => {
	const router = useRouter();
	const toast = useToast();
	const toastIdRef = useRef();
	const { currentDrag, setDrag } = useContext(DragContext);

	const { socket } = useContext(SocketContext);
	const { level, memberLv } = useContext(AccessContext);

	const listStyle = {
		marginRight: "4rem",
		width: "24rem!important",
		height: "calc(100vh - 16.5rem)",
		paddingTop: "2rem",
		paddingBottom: "2rem",
		overflowX: "hidden",
		overflowY: "scroll",
	};

	async function switchCard(from, to) {
		await api
			.post(`/switch/${boardID}`, {
				from: from,
				to: to,
				userID: loggedIn._id,
				boardID: boardID
			})
			.then((result) => {
				if(result.status !== 200)
					showToast(toast, toastIdRef, "Oops!", result.statusText, "error", 2000, true);
				else {
					socket.emit("switch_update", {
						from,
						to,
					});
				}
				// router.push(`/board/${boardID}`);
			});
		
		
	}

	async function newList() {
		await api
			.post("/new/list", {
				userID: loggedIn._id,
				boardID: boardID,
			})
			.then((response) => {
				if(response.status !== 200)
					showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
				else {
					socket.emit("list_new", response.data);
				}
				
				// router.push(`/board/${boardID}`);
			});
	}

	async function updateListName(_name) {
		if (_name !== null && _name !== undefined) {
			await api.post(`/list/${list._id}`, { name: _name, userID: loggedIn._id }).catch((e) => {
				showStandardToast(toast, toastIdRef, "updateDataFail");
			}).then((response) => {
				if(response.status !== 200)
					showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
				else {
					socket.emit("list_update", response.data);
				}
			});
		}
	}

	async function deleteList() {
		await api.delete(`/list/${list._id}`).catch((e) => {
			showStandardToast(toast, toastIdRef, "genericFail");
		}).then((response) => {
			if(response.status !== 200)
				showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
			else {
				socket.emit("list_delete", response.data);
			}
		});
	}

	async function newCard() {
		await api
			.post(`/new/card`, { listID: list._id, userID: loggedIn._id })
			.catch((e) => {
				showStandardToast(toast, toastIdRef, "genericFail");
			})
			.then((response) => {
				if(response.status !== 200)
					showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
				else {
					socket.emit("card_new", response.data);
				}
			});
	}

	if (purpose === "New List") {
		return (
			<Box
				{...listStyle}
				display="flex"
				alignContent="flex-end"
				justifyContent="flex-end"
			>
				<ListHeader
					name={<NewButton purpose="list" trigger={newList} />}
					purpose={purpose}
				/>
			</Box>
		);
	}

	const { name, cards, _id } = list;

	const cardsElement = cards.map((card, index) => {
		return (
			<ListCard
				key={`${list._id}-${card._id}`}
				listName={name}
				card={card}
				onOpen={onOpen}
				listID={list._id}
				cardID={card._id}
				cardIndex={index}
				before={
					<CardDropZone
						boardID={boardID}
						listID={list._id}
						cardIndex={index - 0.5}
						switchCard={switchCard}
						currentDrag={currentDrag}
					/>
				}
			/>
		);
	});

	return (
		<Box {...listStyle}>
			<ListHeader
				name={name}
				id={_id}
				handler={updateListName}
				deleteHandler={deleteList}
			/>
			<Stack
				width="24rem!important"
				position="relative"
				spacing={currentDrag ? "2rem" : "0rem"}
			>
				{cardsElement}
				<CardDropZone
					boardID={boardID}
					listID={list._id}
					cardIndex={cards.length - 0.5}
					switchCard={switchCard}
					currentDrag={currentDrag}
				/>
				<NewButton purpose="card" trigger={newCard} />
			</Stack>
		</Box>
	);
};

// export default ListColumn;

export default connect(mapStateToProps, mapDispatchToProps)(ListColumn);
