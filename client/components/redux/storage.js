/*
	Source:
	https://github.com/vercel/next.js/discussions/15687#discussioncomment-45319
*/
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
	return {
		getItem(_key) {
			return Promise.resolve(null);
		},
		setItem(_key, value) {
			return Promise.resolve(value);
		},
		removeItem(_key) {
			return Promise.resolve();
		},
	};
};

export const storage =
	typeof window !== "undefined"
		? createWebStorage("local")
		: createNoopStorage();

export default storage;