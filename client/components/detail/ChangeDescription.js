import {
	Box,
	Textarea
} from "@chakra-ui/react";
import {
	BsFillFileEarmarkTextFill,
	BsFillPencilFill,
} from "react-icons/bs";
import {
	DetailHeaderWithButton,
	DetailHeaderWithButtons,
} from "./DetailHeader";
import React, { useState, useEffect, useContext } from "react";
import { AccessContext } from "../utility/AccessContext";

export const ChangeDescription = ({
	description,
	purpose,
	handler,
}) => {
	const inputID = `description-${purpose}`;

	const [edit, setEdit] = useState(false);
	const [old, setOld] = useState(description);
	const { level } = useContext(AccessContext);
	const minLevel = 1;

	function toggleEdit(save = false) {
		let data = document.getElementById(inputID);

		// Revert to old value if edit is not saved.
		if (save === false && edit === true && data !== null) {
			document.getElementById(inputID).value = old;
		}

		if (edit === false && data !== null) {
			setOld(data.value);
			data.focus();
		}

		setEdit(!edit);
	}

	useEffect(() => {
		const input = document.getElementById(inputID);
		input.value = description;
	}, []);

	function onSubmit() {
		toggleEdit(true);

		const newData = document.getElementById(inputID).value;

		if (newData !== description) {
			handler({ description: newData });
		}
	}

	return (
		<Box position="relative" marginBottom="2rem">
			{edit ? (
				<DetailHeaderWithButtons
					icon={<BsFillFileEarmarkTextFill />}
					title="Description"
					style={{ marginBottom: "0!important", marginRight: "1rem" }}
					buttons={[
						{
							name: "Save",
							style: {
								colorScheme: "green",
								isDisabled: level < 1,
							},
							trigger: onSubmit,
						},
						{
							name: "Cancel",
							style: {
								colorScheme: "gray",
								isDisabled: level < 1,
							},
							trigger: () => toggleEdit(false),
						},
					]}
				/>
			) : (
				<DetailHeaderWithButton
					icon={<BsFillFileEarmarkTextFill />}
					title="Description"
					props={{
						display: (level < minLevel) ? "none" : "flex",
						isDisabled: level < minLevel,
					}}
					buttonIcon={<BsFillPencilFill />}
					buttonTitle="Edit"
					trigger={() => toggleEdit(false)}
				/>
			)}
			<Textarea
				id={inputID}
				isReadOnly={!edit}
				maxHeight="10rem"
				maxLength="127"
			/>
		</Box>
	);
};

export default ChangeDescription;
