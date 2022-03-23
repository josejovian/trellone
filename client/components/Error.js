import {
	Flex,
	Heading,
	Text
} from "@chakra-ui/react";

const Error = ({ head, desc }) => {
	return (
		<Flex
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
			padding="1rem 4rem"
			position="absolute"
			top="2rem"
			width="100vw"
			height="100vh"
			zIndex="50"
		>
			<Heading as="h1" fontSize="4rem">
				{ head }
			</Heading>
			<Text fontSize="2rem">
				{ desc }
			</Text>
		</Flex>
	);
};

export default Error;
