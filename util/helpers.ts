const generateRandomInt = (limit: number = 100000): number =>
  Math.floor(Math.random() * limit);

const generateRandomString = (text: String = "Key"): any => {
  return `${text}-${generateRandomInt()}`
    .split(" ")
    .join("")
    .toLocaleLowerCase();
};

const primaryColor = "#1d78d6";
const shuffleArray = (array: string[]): string[] => {
  return array.sort(() => Math.random() - 0.5);
};

const getRandomColor = () => {
  return "#1d78d6";
};

export {
  generateRandomString,
  primaryColor,
  generateRandomInt,
  shuffleArray,
  getRandomColor,
};
