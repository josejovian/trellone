import Head from "next/head";

const Meta = ({ title, desc}) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={desc} />
		</Head>
	);
};

export default Meta;
