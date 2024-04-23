export function load({ cookies }) {
	const address: string | undefined = cookies.get('address');

	return { address };
}
