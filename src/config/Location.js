export const getLocationSummary = (address = "") => {
  if (!address) return "";

  const text = address.toLowerCase();

  const cities = [
    "noida",
    // "delhi",
    "gurgaon",
    "gurugram",
    "thane",
    "mumbai",
    "mulund",
    "pune",
    "bangalore",
    "bengaluru",
    "hyderabad",
    "chennai",
    "kolkata",
  ];

  const states = [
    "uttar pradesh",
    "maharashtra",
    "delhi",
    "karnataka",
    "tamil nadu",
    "telangana",
    "west bengal",
  ];

  const city = cities.find((c) => text.includes(c));
  const state = states.find((s) => text.includes(s));

  if (city && state) {
    return `${capitalize(city)}, ${capitalize(state)}`;
  }

  if (city) return capitalize(city);
  if (state) return capitalize(state);

  if (text.includes("india")) return "India";

  return "Location";
};

const capitalize = (str) =>
  str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
