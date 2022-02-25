import {
	Flex,
	Box,
	Text,
	Button,
	IconButton,
	Input,
	Image,
	Heading,
	Divider,
	Portal,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	PopoverArrow,
	PopoverCloseButton,
	PopoverAnchor,
	Stack,
	HStack,
} from "@chakra-ui/react";
import { BsSearch, BsGrid3X3GapFill, BsLockFill, BsGlobe2 } from "react-icons/bs";

const VisibilityChoice = ({ icon, title, description }) => {
	return (
		<Button display="flex" justifyContent="flex-start" padding="1rem" height="max-content" backgroundColor="white">
			<Stack>
				<HStack>
					{ icon }
					<Text>
						{ title }
					</Text>
				</HStack>
				<Text color="gray.400" style={{ fontVariationSettings: "'wght' 200" }}>
					{ description }
				</Text>
			</Stack>
		</Button>
	);
}

export const ChangeVisibility = () => {
	return (
		<Popover placement='bottom-start' width="min-content">
			<PopoverTrigger>
				<Button leftIcon={<BsLockFill />}>Private</Button>
			</PopoverTrigger>
			<Portal>
				<PopoverContent>
					<PopoverHeader border="none">
						<Heading size="sm">Visibility</Heading>
						Choose who can see this board.
					</PopoverHeader>
					<PopoverBody>
						<Stack>
							<VisibilityChoice icon={<BsGlobe2/>} title="Public" description="Anyone can see this." />
							<VisibilityChoice icon={<BsLockFill/>} title="Private" description="Only board members can see this." />
						</Stack>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

export default ChangeVisibility;
