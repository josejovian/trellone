// Styling
import { Box, Flex, Heading, Button, useDisclosure, useToast, SimpleGrid } from "@chakra-ui/react";
import { BsPlusLg } from "react-icons/bs";

// Page Components
import Meta from "../components/Meta";
import DisplayCard from "../components/DisplayCard";
import ActionCover from "../components/detail/ActionCover";
import ChangeVisibility from "../components/detail/ChangeVisibility";
import Members from "../components/detail/Members";
import NewBoardModal from "../components/detail/NewBoardModal";

// Utility
import canAccessBoard from "../components/utility/CanAccessBoard";
import { showStandardToast } from "../components/utility/Toast";

// React
import { useEffect, useState, useRef } from "react";

// Redux
import {
	mapDispatchToProps,
	mapStateToProps,
} from "../components/redux/reducer";
import { connect } from "react-redux";

// Misc
import api from "../components/API";
import Link from "next/link";
import { useRouter } from 'next/router'

/* ----------------------------- Home Component ----------------------------- */

export function Home({ boards, loggedIn }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [element, setElement] = useState([]);

	const toast = useToast();
	const toastIdRef = useRef();
	const history = useRouter();

	function goToBoard(id) {
		history.push(`/board/${id}`);
	}

	function getBoardsUsersCanSee() {
		if(!boards) {
			showStandardToast(toast, toastIdRef, "fetchDataFail");
			return;
		}
		setElement(
			boards
				.filter((board) => {
					return canAccessBoard(board, loggedIn);
				})
				.map((board) => {
					const link = `/board/${board._id}`;
					return (
						<Link key={link} href={link}>
							<a>
								<DisplayCard
									purpose="board"
									name={board.name}
									pictureURL={board.pictureURL}
									contents={
										<Members
											author={board.author}
											members={board.members}
											displayType="avatar"
											link={link}
											showAddMember={false}
										/>
									}
								/>
							</a>
						</Link>
					);
				})
		);
	}

	useEffect(() => {
		getBoardsUsersCanSee();
	}, []);

	return (
		<>
			<Meta title="Trellone" description="Collaborate with your team and coordinate your project with a kanban board." />
			<Flex
				position="relative"
				flexDirection="column"
				width="72rem"
				padding="4rem 0rem"
				margin="0 auto"
			>
				<Flex height="4rem" justifyContent="space-between">
					<Heading size="md">All Boards</Heading>
					<Button
						display={(loggedIn === null) ? "none" : "flex"}
						leftIcon={<BsPlusLg />}
						onClick={onOpen}
						isDisabled={loggedIn === null}
					>
						Add
					</Button>
					<NewBoardModal
						isOpen={isOpen}
						onClose={onClose}
						loggedIn={loggedIn}
						goToBoard={goToBoard}
					/>
				</Flex>
				<SimpleGrid templateColumns='repeat(3, 1fr)' gap={"6rem"}>
					{element}
				</SimpleGrid>
			</Flex>
		</>
	);
}
export async function getServerSideProps() {
	let boards = await api
		.get("/all")
		.then((res) => {
			if(res.status === 200) {
				return res.data
			} else {
				return null;
			}
		})
		.catch((e) => null);

	return { props: { boards } };
}

export default Home;
