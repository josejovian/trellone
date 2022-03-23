import {
	Text,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	Stack,
	HStack,
} from "@chakra-ui/react";
import {
	BsLockFill,
	BsGlobe2,
} from "react-icons/bs";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { showToast } from "../utility/Toast";
import { useContext, useRef } from "react";
import { PopoverStyledHeader } from "./StyledPopover";
import { buttonStyle, modifiedGhostStyle } from "../styling/ComponentStyling";
import { AccessContext } from "../utility/AccessContext";

const VisibilityChoice = ({ isPublic, icon, title, description, trigger, isDisabled }) => {

	return (
		<Button
			display="flex"
			justifyContent="flex-start"
			padding="1rem"
			height="max-content"
			variant={(isPublic === (title === "Public")) ? "solid" : "ghost" }
			onClick={(isDisabled || (isPublic === (title === "Public"))) ? () => {} : trigger}
			borderRadius="md"
		>
			<Stack>
				<HStack>
					{icon}
					<Text>{title}</Text>
				</HStack>
				<Text
					color={(isPublic === (title === "Public")) ? "white" : "orange.600" }
					style={{ fontVariationSettings: "'wght' 200" }}
				>
					{description}
				</Text>
			</Stack>
		</Button>
	);
};

export const ChangeVisibility = ({ purpose, handler, visibility, style }) => {
	const [isPublic, setIsPublic] = useState(visibility);
	const [loading, setLoading] = useState(false);

	const toast = useToast();
	const toastIdRef = useRef();

	const { level } = useContext(AccessContext);

	async function updateVisibility(newSetting) {
		setLoading(true);
		if (isPublic !== newSetting) {

			if(purpose === "newBoard") {
				// not API call
				setIsPublic(newSetting);
				handler(newSetting);
				setLoading(false);
			} else {
				// prevent button spam
				setTimeout(() => {
					setIsPublic(newSetting);
					handler(newSetting);
					setLoading(false);
					showToast(toast, toastIdRef, "Done!", "Visibility rule updated.", "success", 3000, true);
				}, 1000);
			}
		}
	}

	let convert = (purpose === "newBoard") ? {...buttonStyle, ...modifiedGhostStyle()} : {};

	return (
		<Popover placement="bottom-start" width="min-content" zIndex="30000" isLazy>
			<PopoverTrigger>
				<Button
					leftIcon={isPublic ? <BsGlobe2 /> : <BsLockFill />}
					colorScheme="gray"
					{...style}
					{...convert}
					isDisabled={(level < 2)}
				>
					{isPublic ? "Public" : "Private"}
				</Button>
			</PopoverTrigger>
			<PopoverContent zIndex="30000">
				<PopoverStyledHeader
					title="Visibility"
					desc="Choose who can see this board."
				/>
				<PopoverBody padding="0.5rem">
					<Stack>
						<VisibilityChoice
							isPublic={isPublic}
							icon={<BsGlobe2 />}
							title="Public"
							description="Anyone can see this."
							trigger={() => updateVisibility(true)}
							isDisabled={(level < 2)}
						/>
						<VisibilityChoice
							isPublic={isPublic}
							icon={<BsLockFill />}
							title="Private"
							description="Only board members can see this."
							trigger={() => updateVisibility(false)}
							isDisabled={(level < 2)}
						/>
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default ChangeVisibility;
