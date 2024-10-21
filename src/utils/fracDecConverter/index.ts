/**
 * will come in handy for markov chains!
 */

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export const decimalToFraction = (decimalInput: number) => {
  const decimal = Math.round(decimalInput * 1e10) / 1e10;
  const len = decimal.toString().length - 2;
  let denominator = 10 ** len;
  let numerator = decimal * denominator;
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  if (denominator === 1) return numerator.toString()
  return `${numerator}/${denominator}`;
};

export const fractionToDecimal = (fractionInput: string) => {
  const fraction = fractionInput.split('/')
  const [numerator, denominator] = fraction.map(Number)
  if (!numerator || !denominator) throw 'not a fraction!'
  return numerator / denominator
}
