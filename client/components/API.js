import axios from "axios";
import { showToast, showStandardToast } from "./utility/Toast";

const baseURL = process.env.NEXT_PUBLIC_API_EP;

export const api = axios.create({
	baseURL
});

export async function updateCard(userID, id, data,  toast, toastIdRef) {
	data = {...data, userID, id};
	return await api.post(`/card/${id}`, data).catch(e => {
		showStandardToast(toast, toastIdRef, "updateDataFail");
	}).then((response) => {
		if(response.status !== 200)
			showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
		return response;
	});
}

export async function updateBoard(userID, id, data, toast, toastIdRef) {
	data = {...data, userID, id};
	return await api.post(`/board/${id}`, data).catch(e => {
		showStandardToast(toast, toastIdRef, "updateDataFail");
	}).then((response) => {
		if(response.status !== 200)
			showToast(toast, toastIdRef, "Oops!", response.statusText, "error", 2000, true);
		return response;
	});
}

export default api;
