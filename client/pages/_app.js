// Styling
import { Box, ChakraProvider, Spinner } from "@chakra-ui/react";
import { theme } from "../components/styling/Theme";
import "../styles/globals.css";

// Redux
import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import reducer from "../components/redux/reducer";
import storage from "../components/redux/storage";

// Misc
import Navigation from "../components/Navigation.js";
import api from "../components/API";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom";

/* ---------------------------------- Redux --------------------------------- */

const persistConfig = {
	key: "root",
	storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

/* ------------------------------ App Component ----------------------------- */

function startLoading() {
	console.log("START");
	const loaderJSX = (
		<Box
			id="page-loading"
			display="flex"
			justifyContent="center"
			alignItems="center"
			position="fixed"
			top="0"
			left="0"
			w="100vw"
			h="100vh"
			zIndex="99999"
			bg="#1A202C8E"
			opacity="0"
			transition="all 0.5s"
		>
			<Spinner thickness="1rem" width="10rem" height="10rem" speed="1s" size='xl' style={{animationTimingFunction: "ease"}}/>
		</Box>
	);

	ReactDOM.render(loaderJSX, document.getElementById("page-loading-container"));
	const loader = document.getElementById("page-loading");
	if(loader)
		loader.classList.add("page-loading-start");
}

function stopLoading() {
	const loader = document.getElementById("page-loading");
	if(loader)
		loader.classList.remove("page-loading-start");
	setTimeout(() => {
		ReactDOM.unmountComponentAtNode(document.getElementById("page-loading-container"));
	}, 500);
}

const MyApp = ({ Component, pageProps }) => {
	const router = useRouter();
	const path = router.asPath;

	useEffect(() => {
		router.events.on("routeChangeStart", startLoading);
		router.events.on("routeChangeComplete", stopLoading);
		return () => {
			router.events.off("routeChangeStart", startLoading);
			router.events.off("routeChangeComplete", stopLoading);
		};
	});

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ChakraProvider theme={theme}>
					<DndProvider backend={HTML5Backend}>
						<Box id="page-loading-container">

						</Box>
						<Box overflowY="hidden">
							<Navigation />
							<Box paddingTop="4rem" overflow="hidden">
								<Component
									{...pageProps}
									loggedIn={store.getState().loggedIn}
									key={path}
								/>
							</Box>
						</Box>
					</DndProvider>
				</ChakraProvider>
			</PersistGate>
		</Provider>
	);
};

export default MyApp;
