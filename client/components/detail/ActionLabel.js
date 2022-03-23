// Styling
import {
	Box,
	Button,
	Input,
	Image,
	useDisclosure,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	Grid,
	GridItem,
	useToast,
} from "@chakra-ui/react";
import {
	BsImage,
	BsFillTagsFill,
	BsTag,
} from "react-icons/bs";

// Components
import DetailHeader from "./DetailHeader";
import { PopoverStyledHeader } from "./StyledPopover";
import CardActionButton from "./CardActionButton";

export const ActionLabels = ({ allTags, tags, setAllTags, setTags, isDisabled }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	function newLabel(color) {
		const input = document.getElementById("input-label-color");

		// Since minus symbol is used to concatenate name and color as a single entry,
		// name should not contain an additional minus symbol.
		const strip = (input.value.match(/-/g) || []).length;

		// Label must not be an empty string.
		if (input !== null && input.value !== "" && strip === 0) {
			const label = `${input.value}-${color}`;
			if (!allTags.includes(label)) {
				input.value = "";
				setAllTags([...allTags, label]);
			}
			if (!tags.includes(label)) {
				input.value = "";
				setTags([...tags, label]);
			}
		}
	}

	const LabelColor = ({ color }) => {
		return (
			<Button
				colorScheme={color}
				width="100%"
				borderRadius="md"
				onClick={() => newLabel(color)}
			></Button>
		);
	};

	function toggleLabel(tag) {
		if (tags.includes(tag)) setTags(tags.filter((_tag) => _tag != tag));
		else setTags([...tags, tag]);
	}

	const labelElements = allTags.map((tag) => {
		const data = tag.match(/(([^-])+)/g);
		
		return (
			<Button
				key={`tag-${data[0]}`}
				colorScheme={data[1]}
				marginRight="0.5rem"
				marginBottom="0.5rem"
				size="xs"
				variant={tags.includes(tag) ? "solid" : "outline"}
				onClick={() => toggleLabel(tag)}
			>
				{data[0]}
			</Button>
		);
	});

	const colors = [
		"green",
		"yellow",
		"orange",
		"red",
		"whatsapp",
		"cyan",
		"teal",
		"blue",
		"pink",
		"purple",
	];

	return (
		<Box position="relative" width="100%">
			<Popover isLazy>
				<PopoverTrigger>
					<Box>
						<CardActionButton
							icon={<BsFillTagsFill />}
							text="Label"
							onClick={isDisabled ? () => {} : onOpen}
							isDisabled={isDisabled}
						/>
					</Box>
				</PopoverTrigger>
				<PopoverContent>
					<PopoverStyledHeader
						title="Label"
						desc="Select a name and a color."
					/>
					<PopoverBody padding="0.5rem">
						<Input
							id="input-label-color"
							placeholder="Label..."
							marginBottom="0.5rem"
							maxLength="16"
						/>
						<Grid
							templateRows="repeat(1, 1fr)"
							templateColumns="repeat(4, 1fr)"
							gap="0.5rem"
						>
							{colors.map((color) => {
								return (
									<GridItem key={`color-${color}`}>
										<LabelColor color={color} />
									</GridItem>
								);
							})}
						</Grid>
						<DetailHeader
							icon={<BsTag />}
							title="Labels"
							style={{
								marginTop: "1rem",
								marginBottom: "0",
							}}
						/>
						{labelElements}
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</Box>
	);
};

export default ActionLabels;