import {
	Box,
} from "@chakra-ui/react";
import { AddMembers } from "./Members";

export const ActionMembers = ({ members, handler }) => {
	
	return (
		<Box position="relative">
			<AddMembers
				purpose="card"
				members={members}
				handler={handler}
			/>
		</Box>
	);
};

export default ActionMembers;