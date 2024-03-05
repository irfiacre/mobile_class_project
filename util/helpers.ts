const generateRandomString = (text: String = "Key"): any => {
  return `${text}-${Math.random() * 100000}`;
};

const primaryColor = "#1d78d6";

export { generateRandomString, primaryColor };
