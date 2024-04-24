export function load({ cookies }) {
	const address: string | undefined = cookies.get('address');
	const decodedAddress: string = decodeURIComponent(address ?? '');

	return { address: decodedAddress };
}
