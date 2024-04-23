export const getLocation = async (place: string) => {
  const placeQueryReadable = place.replaceAll(' ', '+');
  const url = `https://nominatim.openstreetmap.org/search.php?q=${placeQueryReadable}&format=json`;

  const query = await fetch(url);
  const response = await query.json();

  return response[0];
}