const prefix = "Spotification";
const delimiter = "~";
export const prefixAndDelimiter = `${prefix} ${delimiter}`;

export const createGroupName = (name) => {
  return `${prefixAndDelimiter} ${name}`;
};

export const getFriendlyName = (name) => {
  const index = name.indexOf(delimiter);
  if (name.length < index + 2) {
    return name;
  }
  return name.substring(index + 1).trim();
};
