import { Flex, Box, Text, Stack, Image as Img } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { getEmptyImage } from "react-dnd-html5-backend";
import DragContext from "./utility/DragContext";
import AccessContext from "./utility/AccessContext";

const DisplayCard = ({
	trigger,
	name,
	pictureURL,
	contents,
	pictureContents,
	style,
	link = null,
	ddFeat = { active: false },
	purpose
}) => {
	/*
		Source:
		https://mayursinhsarvaiya.medium.com/how-to-merge-refs-in-react-component-d5e4623b6924
	*/
	let coords = { rect: null, x: null, y: null };
	const ref = useRef();
	const element = ref.current;
	let [init, setInit] = useState({
		rect: null,
		x: null,
		y: null,
	});

	const { currentDrag, setDrag } = useContext(DragContext);
	const { level, memberLv } = useContext(AccessContext);
	const allowDD = (ddFeat.active === true && (level >= memberLv));
	
	function manage(e) {
		if (element && ddFeat.isDragging) {
			e.preventDefault();
			element.style.position = "fixed";

			if (init.x === null) {
				let rect = element.parentElement.getBoundingClientRect();
			
				let x = e.clientX - rect.left; //x position within the element.
				let y = e.clientY - rect.top; //y position within the element.

				let parent = element.parentElement;
				
				parent = parent.getBoundingClientRect();

				let space = - 32;
				if (ddFeat.index > 0) {
					space = y - element.scrollHeight - 64;
				}
				setDrag({
					listID: ddFeat.listID,
					cardIndex: ddFeat.index
				});
				setInit({ ...init, rect, x: x, y: y - space});
				element.style.top = e.pageY - y - space + "px";
				element.style.left = e.pageX - x + "px";
			} else {
				element.style.transform = "rotate(-2deg)";
				element.style.top = e.pageY - init.y + "px";
				element.style.left = e.pageX - init.x + "px";
			}
		}
	}

	function stop() {
		element.style.top = "unset";
		element.style.left = "unset";
		element.style.position = "relative";
		element.style.transform = "rotate(0deg)";
		setInit({ ...init, x: null, y: null });
		setDrag(false);
	}
	
	return (
		<Flex
			ref={!allowDD ? null : ddFeat.dragDrop(ref)}
			position="relative"
			className="displayCardWrapper"
			flexDirection="column"
			alignItems="flex-start"
			justifyContent="space-between"
			padding="0"
			width="20rem"
			background="white"
			borderRadius="xl"
			boxShadow="md"
			overflow="hidden"
			onClick={ddFeat.isDragging ? () => {} : trigger}
			zIndex={ddFeat.isDragging ? 9999999 : 1}
			transition="background 0.2s"
			_hover={{
				cursor: "pointer",
				background: "gray.50",
			}}
			_active={{
				background: "gray.100",
			}}
			{...style}
			onDrag={allowDD ? (e) => manage(e) : () => {}}
			onDragEnd={allowDD ? () => stop() : () => {}}
		>
			<Box
				display={pictureURL === "" && purpose !== "board" ? "none" : "initial"}
				width="100%"
				height="200px"
				position="relative"
				overflow="hidden"
			>
				<Img
					position="absolute"
					width="auto"
					height="100%"
					top="0"
					left="0"
					src={pictureURL}
					fallbackSrc="./placeholderCoverBoard.png"
					userSelect="none"
					draggable="false"
				/>
				<Box
					position="absolute"
					width="20rem"
					height="100%"
					top="0"
					left="0"
					draggable="false"
				></Box>
				{pictureContents}
			</Box>
			<Stack padding="1rem" spacing="1rem">
				<Text
					fontSize="lg"
					style={{ fontVariationSettings: "'wght' 600" }}
					_hover={{}}
				>
					{name}
				</Text>
				<Box display="inline-block" lineHeight="2rem">
					{contents}
				</Box>
			</Stack>
			<Flex
				display={allowDD ? "flex" : "none"}
				width="20rem"
				color="gray.400"
				alignItems="center"
				justifyContent="center"
			>
				<BsThreeDots />
			</Flex>
		</Flex>
	);
};

export default DisplayCard;
