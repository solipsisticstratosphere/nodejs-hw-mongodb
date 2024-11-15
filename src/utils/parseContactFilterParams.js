const parseNumber = (number) => {
  if (typeof number !== 'string') return;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return;

  return parsedNumber;
};

export const parseContactFilterParams = ({ minAge, maxAge }) => {
  const parsedMinAge = parseNumber(minAge);
  const parsedMaxAge = parseNumber(maxAge);

  return {
    minAge: parsedMinAge,
    maxAge: parsedMaxAge,
  };
};
