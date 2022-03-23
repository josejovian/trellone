import { PopoverHeader, Heading } from "@chakra-ui/react";

export const PopoverStyledHeader = ({title, desc}) => {
	return (
		<PopoverHeader border="0">
			<Heading
				size="sm"
				textTransform="uppercase"
				style={{
					fontVariationSettings: "'wght' 650",
				}}
			>
				{title}
			</Heading>
			{desc}
		</PopoverHeader>
	);
};