import { Tag } from "@chakra-ui/react";
import DisplayCard from "../DisplayCard";
import Members from "./Members";
import { mapDispatchToProps, mapStateToProps } from "../redux/setter";
import { connect } from "react-redux";
import { DragPreviewImage, useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

const ListCard = ({ card, setCard, listName, onOpen, listID, cardID, cardIndex, before }) => {
	const tags = card.tags;
	const ref = useRef();
	
	const [{ isDragging }, drag, preview] = useDrag(
		() => ({
			type: "card",
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
			item: () => {
				return { listID, cardID, cardIndex };
			}

		}),
		[]
	);

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: "card",
			canDrop: (item) => {
				if(item.cardID === cardID)
					return
				
			},
			drop: () => {

			},
			hover: (item) => {
				
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			}),
		}),
		[]
	);

	function dragDrop(ref) {
		return drag(ref);
	}

	preview(getEmptyImage(), { captureDraggingState: false });

	return (
		<>
			{ before }
			<DragPreviewImage connect={preview} src=""/>
			<DisplayCard
				ddFeat={{
					active: true,
					dragDrop,
					isDragging,
					index: cardIndex,
					listID,
					cardID
				}}
				dragDrop={dragDrop}
				isDragging={isDragging}
				name={card.name}
				pictureURL={card.pictureURL}
				contents={
					tags === undefined ? (
						<></>
					) : (
						<>
							{tags.map((tag) => {
								const [tagName, tagColor] = tag.split("-");
								return (
									<Tag key={`${listID}-${cardID}-${tagName}`} marginRight="0.5rem" colorScheme={tagColor}>
										{tagName}
									</Tag>
								);
							})}
							<Members
								members={card.members}
								displayType="avatar"
								showAddMember={false}
								style={{
									marginTop: (tags.length > 0) ? "0.5rem" : "0"
								}}
							/>
						</>
					)
				}
				trigger={() => setCard(card, listName, onOpen)}
			/>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ListCard);
