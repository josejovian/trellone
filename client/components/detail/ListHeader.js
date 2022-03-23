import {
	Flex,
	Text,
	Button,
} from "@chakra-ui/react";

import ChangeName from "./ChangeName";

const ListMenu = ({ name, props }) => {
	return (
		<Button
			display="flex"
			justifyContent="flex-start"
			padding="0.5rem"
			width="100%"
			height="max-content"
			backgroundColor="white"
			{...props}
		>
			<Text
				color="gray.400"
				style={{ fontVariationSettings: "'wght' 200" }}
			>
				{name}
			</Text>
		</Button>
	);
};

const ListHeader = ({ name, purpose, handler, deleteHandler, id }) => {

	const headerStyle = {
		position: "absolute",
		width: "24rem",
		padding: "1rem 0rem",
		top: "0",
		alignContent: "center",
		justifyContent: "space-between",
		zIndex: "2"
	}

	if(purpose === "New List") {
		return (
			<Flex
				{...headerStyle}
				padding="0.75rem 0rem"
			>
				{name}
			</Flex>
		)
	}

	// const EditableControls = () => {
	// 	const {
	// 		isEditing,
	// 		getSubmitButtonProps,
	// 		getCancelButtonProps,
	// 		getEditButtonProps,
	// 	} = useEditableControls();

	// 	return isEditing ? (
	// 		<ButtonGroup justifyContent="center" size="sm">
	// 			<Button colorScheme="green" icon={<BsCheck />} {...getSubmitButtonProps()}>
	// 				Save
	// 			</Button>
	// 			<Button icon={<BsX />} {...getCancelButtonProps()}>
	// 				Cancel
	// 			</Button>
	// 		</ButtonGroup>
	// 	) : (
	// 		<>
	// 			<PopoverTrigger>
	// 				<IconButton
	// 					background="none"
	// 					size="sm"
	// 					icon={<BsThreeDots />}
	// 				/>
	// 			</PopoverTrigger>
	// 			<Portal>
	// 				<PopoverContent width="min-content">
	// 					<PopoverBody padding="0.5rem">
	// 						<Stack spacing="0.5rem">
	// 							<ListMenu
	// 								name="Rename"
	// 								props={getEditButtonProps()}
	// 							/>
	// 							<ListMenu name="Delete" />
	// 						</Stack>
	// 					</PopoverBody>
	// 				</PopoverContent>
	// 			</Portal>
	// 		</>
	// 	);
	// };
	
	return (
		<Flex
			{...headerStyle}
		>
			<ChangeName title={name} purpose="list" handler={handler} deleteHandler={deleteHandler} id={id} />
			{/* <Editable
				display="flex"
				justifyContent="space-between"
				width="100%"
				defaultValue={name}
				isPreviewFocusable={false}
			>
				<EditablePreview padding="0" lineHeight="2rem" />
				<EditableInput width="80%" padding="0" lineHeight="2rem" marginRight="0.5rem" backgroundColor="white" />

				<Popover placement="bottom-start" isLazy>
					<EditableControls />
				</Popover>
			</Editable> */}
		</Flex>
	);
};

export default ListHeader;
