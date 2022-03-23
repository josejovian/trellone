import Error from "../components/Error";

export default function Custom500() {
	return <Error head="500" desc="Server-side error occured." />
}