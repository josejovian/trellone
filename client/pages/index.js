import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import BoardMenu from "../components/BoardMenu";
import BoardContent from "../components/BoardContent";
export default function Home() {
	return (
		<div>
			<BoardMenu />
			<BoardContent />
		</div>
	);
}
