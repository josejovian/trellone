// Styling
import { Box, ChakraProvider } from "@chakra-ui/react";
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
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

/* ---------------------------------- Redux --------------------------------- */

const persistConfig = {
	key: "root",
	storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

/* ------------------------------ App Component ----------------------------- */

const MyApp = ({ Component, pageProps }) => {
	const path = useRouter().asPath;

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ChakraProvider theme={theme}>
					<DndProvider backend={HTML5Backend}>
						<Box overflowY="hidden">
							<Navigation />
							<Box paddingTop="4rem" overflow="hidden">
								<Component {...pageProps} loggedIn={store.getState().loggedIn} key={path} />
							</Box>
						</Box>
					</DndProvider>
				</ChakraProvider>
			</PersistGate>
		</Provider>
	);
}

export default MyApp;
