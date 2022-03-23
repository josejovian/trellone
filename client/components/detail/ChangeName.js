import {
	Flex,
	Box,
	Button,
	IconButton,
	Input,
	ButtonGroup,
} from "@chakra-ui/react";
import {
	BsChevronRight,
	BsFillPencilFill,
	BsTrash2Fill,
} from "react-icons/bs";
import { modifiedGhostStyle } from "../styling/ComponentStyling";
import { mapDispatchToProps, mapStateToProps } from "../redux/setter";
import { connect } from "react-redux";
import { AccessContext } from "../utility/AccessContext";
import { useState, useEffect, useCallback, useContext } from "react";

export const ChangeName = ({
	title,
	id,
	isDisabled,
	purpose,
	handler,
	deleteHandler,
	editList,
	setEditList,
}) => {
	const inputID = `title-${purpose}-${id}`;

	const [edit, setEdit] = useState(false);
	const [old, setOld] = useState(title);
	const [isOpen, setIsOpen] = useState(false);

	const { level, memberLv } = useContext(AccessContext);

	useEffect(() => {
		if (editList !== id) {
			toggleEdit(false, true);
			setEdit(false);
		}
	}, [editList]);

	function toggleDrawer() {
		if (editList === id) {
			setEditList(null);
			if (edit) toggleEdit(false);
		} else {
			setEditList(id);
		}
	}

	function toggleEdit(save = false, ignore = false) {
		let data = document.getElementById(inputID);

		// Revert to old value if edit is not saved.
		if (save === false && edit === true && data !== null) {
			document.getElementById(inputID).value = old;
		}

		if (edit === false && data !== null) {
			setOld(data.value);
			data.focus();
		}

		if (ignore === false) setEdit(!edit);
	}

	useEffect(() => {
		const input = document.getElementById(inputID);
		input.value = title;
	}, []);

	function onSubmit() {
		if(editList === id)
			setEditList(null);

		toggleEdit(true);

		const newData = document.getElementById(inputID).value;

		if (newData !== title) {
			handler({ name: newData });
		}
	}

	const inputStyle = {
		id: inputID,
		width:
			purpose !== "board"
				? purpose !== "card"
					? "12rem"
					: "min-content"
				: "12rem",
		fontSize: "1.2rem",
		size: "sm",
		fontFamily: "Montserrat",
		style: {
			fontVariationSettings: "'wght' 600",
		},
		isReadOnly: !edit,
		marginRight: "1rem",
		border: "0",
		borderRadius: "md",
	};

	const buttonStyle = {
		borderRadius: "full",
		variant: "ghost",
		size: "sm",
	};

	const EditButton = useCallback(({style}) => {
		return (
			<IconButton
				{...buttonStyle}
				display={(level < memberLv) ? "none" : "flex"}
				colorScheme="blue"
				icon={<BsFillPencilFill />}
				onClick={() => toggleEdit(false, false)}
				{...style}
				isDisabled={(level < memberLv)}
			/>
		);
	}, [ edit ]);

	const DeleteButton = useCallback(({style}) => {
		return (
			<IconButton
				display={(level < memberLv) ? "none" : "flex"}
				{...buttonStyle}
				colorScheme="red"
				icon={<BsTrash2Fill />}
				onClick={deleteHandler}
				{...style}
				isDisabled={(level < memberLv)}
			/>
		);
	}, [ edit ]);

	const SaveButton = useCallback(({style}) => {
		return (
			<Button
				display={(level < memberLv) ? "none" : "flex"}
				{...buttonStyle}
				colorScheme="green"
				onClick={() => onSubmit()}
				{...style}
				isDisabled={(level < memberLv)}
			>
				Save
			</Button>
		);
	}, [ edit ]);

	const CancelButton = useCallback(({style}) => {
		return (
			<Button
				display={(level < memberLv) ? "none" : "flex"}
				{...buttonStyle}
				colorScheme="gray"
				onClick={() => toggleEdit(false, false)}
				{...style}
				isDisabled={(level < memberLv)}
			>
				Cancel
			</Button>
		);
	}, [ edit ]);

	if (purpose === "list") {
		return (
			<Box
				width="calc(100% - 2rem)"
				position="relative"
				marginBottom="0.5rem"
			>
				<Flex
					width="calc(100% - 2rem)"
					flexDirection="row"
					alignContent="center"
					justifyContent="space-between"
				>
					<Input {...inputStyle} />
					<ButtonGroup>
						{editList === id ? (
							edit ? (
								<SaveButton />
							) : (
								<>
									<EditButton />
									<DeleteButton />
								</>
							)
						) : (
							<></>
						)}
						<IconButton
							{...buttonStyle}
							display={(level < memberLv) ? "none" : "flex"}
							variant="solid"
							colorScheme="gray"
							icon={
								<Box
									transition="all 0.1s"
									transform={
										editList !== id
											? "rotate(180deg)"
											: "rotate(0deg)"
									}
								>
									<BsChevronRight />
								</Box>
							}
							isDisabled={(level < memberLv)}
							onClick={() => toggleDrawer()}
						/>
					</ButtonGroup>
				</Flex>
			</Box>
		);
	}

	return (
		<Box
			position="relative"
			marginBottom={purpose !== "board" ? "0.5rem" : "0rem"}
		>
			{edit ? (
				<Flex flexDirection="row" alignContent="center">
					<Input {...inputStyle} />
					<SaveButton style={{marginRight: "1rem", ...modifiedGhostStyle("green")}} />
					<CancelButton style={{...modifiedGhostStyle("gray")}} />
				</Flex>
			) : (
				<Flex flexDirection="row" alignContent="center">
					<Input {...inputStyle} />
					<EditButton />
				</Flex>
			)}
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeName);
