/**
 * 
 * @param {*} toast useToast
 * @param {*} toastIdRef useRef
 * @param {*} purpose Preset name.
 */
export function showStandardToast(toast, toastIdRef, purpose) {
	let title, description, status;
	switch (purpose) {
		case "fetchDataFail":
			title = "Failed to fetch data!";
			description = "Please try again later.";
			status = "error";
			break;
		case "updateDataFail":
			title = "Failed to update data!";
			description = "Please try again later.";
			status = "error";
			break;
		case "genericFail":
			title = "Something went wrong...";
			description = "Please try again later.";
			status = "error";
			break;
	}

	showToast(toast, toastIdRef, title, description, status, 3000, true);
}

/**
 * 
 * @param {Toast} toast useToast
 * @param {Ref} toastIdRef useRef
 * @param {String} title Toast's title.
 * @param {String} description Toast's description.
 * @param {String} status Toast's type; success, error, danger, etc.
 * @param {Integer} duration Toast's duration.
 * @param {Boolean} isClosable Closable or not.
 */
export function showToast(
	toast,
	toastIdRef,
	title,
	description,
	status,
	duration,
	isClosable
) {
	/*
	Close any toasts generated by the same component,
	before showing a new one.
	*/
	if (toastIdRef.current) {
		toast.close(toastIdRef.current);
	}
	toastIdRef.current = toast({
		title,
		description,
		status,
		duration,
		isClosable,
	});
}