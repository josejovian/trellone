// Styling
import {
	Box,
	Image,
	useDisclosure,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	Grid,
	GridItem,
	useToast,
	Link
} from "@chakra-ui/react";
import { BsImage } from "react-icons/bs";

// Components
import Search from "../Search";
import { PopoverStyledHeader } from "./StyledPopover";
import CardActionButton from "./CardActionButton";

// Redux
import { mapDispatchToProps, mapStateToProps } from "../redux/setter";
import { connect } from "react-redux";

// API
import api from "../API";

// Misc
import { useState } from "react";
import { showStandardToast, showToast } from "../utility/Toast";

const ActionCover = ({
	currentQueries = [],
	setQueries,
	handler,
	deleteHandler,
	style,
	isDisabled,
	toastIdRef,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState(false);

	const toast = useToast();

	function fail(reason) {
		setLoading(false);
		if (reason === "validation") {
			showToast(
				toast,
				toastIdRef,
				"Inappropriate Query!",
				"Query should be 3 - 20 characters long.",
				"danger",
				3000,
				true
			);
		} else {
			showStandardToast(toast, toastIdRef, reason);
		}
	}

	function success(queryResults) {
		setQueries(queryResults);
		setLoading(false);
	}

	async function onSubmit() {
		setLoading(true);
		const queryInput = document.getElementById("photo-search-input");
		const query = (queryInput !== null) ? queryInput.value : "";
		const spaces = (query.match(/(\s)/g) || []).length;
		const startsWithSpace = query.match(/^(\s)(.)*$/);


		function criteria1() {
			return (!startsWithSpace && query.length >= 3 && query.length <= 20);
		}

		function criteria2() {
			return ((query.length <= 7 && spaces <= 1) || spaces <= 2);
		}

		if(criteria1() && criteria2()) {
			let photoQueryResults = [];

			await api
				.get(`/image/${query}`)
				.then((res) => {
					if (res.status === 200) {
						queryInput.value = "";
						const photoData = res.data["photos"];
						photoData.map((photo) => {
							photoQueryResults.push({
								id: photo.id,
								pictureSmallURL: photo.src["tiny"],
								pictureURL: photo.src["landscape"],
								pictureAuthorURL:
									photo.photographer_url,
								pictureAuthorName: photo.photographer,
							});
						});
					} else {
						fail("fetchDataFail");
					}
				})
				.then(() => {
					success(photoQueryResults);
				})
				.catch((e) => {
					fail("fetchDataFail");
				});
		} else {
			fail("validation");
		}
	}

	return (
		<Box position="relative" width="100%">
			<Popover isLazy>
				<PopoverTrigger>
					<Box>
						<CardActionButton
							icon={<BsImage />}
							text="Cover"
							onClick={isDisabled ? () => {} : onOpen}
							style={style}
							isDisabled={isDisabled}
						/>
					</Box>
				</PopoverTrigger>
				<PopoverContent>
					<PopoverStyledHeader
						title="Photo Search"
						desc={(<Link href="https://www.pexels.com/">Search Pexels for photos.</Link>)}
					/>
					<PopoverBody padding="0.5rem">
						<Search
							id="photo-search-input"
							handler={onSubmit}
							isLoading={loading}
							style={{ marginBottom: "0.5rem" }}
							deleteHandler={deleteHandler}
						/>
						<Grid
							templateRows="repeat(2, 1fr)"
							templateColumns="repeat(4, 1fr)"
							gap="0.5rem"
						>
							{currentQueries.map((photo) => {
								return (
									<GridItem key={photo.id || photo.pictureSmallURL}>
										<Image
											outline="2px solid white"
											height="100%"
											objectFit="cover"
											src={photo.pictureSmallURL}
											onClick={() => handler(photo)}
											transition="0.1s"
											borderRadius="md"
											_active={{
												outline: "3px solid",
												outlineColor: "orange.200",
												transition: "0.1s",
											}}
										/>
									</GridItem>
								);
							})}
						</Grid>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</Box>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionCover);
