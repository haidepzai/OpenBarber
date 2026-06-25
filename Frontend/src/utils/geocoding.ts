export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
    headers: { 'Accept-Language': 'de' },
  });
  const data = await res.json();
  const addr = data.address ?? {};
  const neighborhood = addr.suburb ?? addr.quarter ?? addr.city_district ?? addr.borough ?? '';
  const city = addr.city ?? addr.town ?? addr.village ?? '';
  if (neighborhood && city && neighborhood !== city) return `${neighborhood}, ${city}`;
  return city || neighborhood || data.display_name?.split(',')[0] || '';
};
