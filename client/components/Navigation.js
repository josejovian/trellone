// Styling
import { Flex, Text, Button, Image, Heading } from "@chakra-ui/react";
import { modifiedGhostStyle } from "./styling/ComponentStyling";

// Redux
import { useEffect } from "react";
import { mapDispatchToProps, mapStateToProps } from "./redux/setter";
import { connect } from "react-redux";

// Components
import Search from "../components/Search";

// Misc
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../components/API";

const Navigation = ({ loggedIn, loginUser, logoutUser, currentBoard }) => {
	const router = useRouter();
	const path = router.asPath;
	const query = useRouter().query;

	async function authenticate() {
		let { code } = query;
		
		// User is already logged in, so do nothing.
		if (loggedIn !== null) return;

		// User is in the process of logging in.
		if (code !== undefined || code !== null || code !== "") {
			await api
				.post("/login/end", { code: code })
				.then((res) => {
					let data = res.data;
					data = { ...data, code };
					router.push("/");
					loginUser(data);
				})
				.catch((e) => {});
		}
	}

	useEffect(() => {
		authenticate();
	}, []);

	function login() {
		window.open("http://localhost:5000/login/start", "_self");
	}

	function logout() {
		router.push("/");
		logoutUser();
	}

	return (
		<Flex
			position="fixed"
			top="0"
			alignItems="center"
			justifyContent="space-between"
			width="100vw"
			height="4rem"
			padding="0.5rem 4rem"
			boxShadow="md"
			zIndex="100"
		>
			<Flex alignItems="center" justifyContent="space-between">
				<Link href="/" as="/">
					<a>
						<Heading
							width="12rem"
							style={{ fontVariationSettings: "'wght' 800" }}
							size="md"
						>
							TRELLONE
						</Heading>
					</a>
				</Link>
				<Heading
					size="md"
					display={!path.includes("/board/") || currentBoard === null ? "none" : "initial"}
				>
					{currentBoard !== null ? currentBoard : ""}
				</Heading>
			</Flex>
			<Flex>
				<Flex alignItems="center" marginLeft="1rem">
					{loggedIn === null ? (
						<Button onClick={() => login()}>Login</Button>
					) : (
						<>
							<Image
								src={loggedIn.pictureURL}
								fallbackSrc="https://via.placeholder.com/40"
								width="2.5rem"
								height="2.5rem"
								marginLeft="2rem"
								borderRadius="full"
							/>
							<Text marginLeft="1rem" fontWeight="bold">
								{loggedIn.name}
							</Text>
							<Button
								onClick={() => logout()}
								variant="ghost"
								colorScheme="red"
								{...modifiedGhostStyle("red")}
								marginLeft="2.5rem"
							>
								Logout
							</Button>
						</>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
