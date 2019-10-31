import normalizeColor from './normalizeColors';
import colors from './colors';

function colorToRgba(input: string) {
  let int32Color = normalizeColor(input);
  if (int32Color === null) return input;
  int32Color = int32Color || 0;
  let r = (int32Color & 0xff000000) >>> 24;
  let g = (int32Color & 0x00ff0000) >>> 16;
  let b = (int32Color & 0x0000ff00) >>> 8;
  let a = (int32Color & 0x000000ff) / 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Covers rgb, rgba, hsl, hsla
// Taken from https://gist.github.com/olmokramer/82ccce673f86db7cda5e
const colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
// Covers color names (transparent, blue, etc.)
const colorNamesRegex = new RegExp(`(${Object.keys(colors).join('|')})`, 'g');

/** color string to rgba() */
export const stringColorTransform = (str: string) => {
  return str
    .replace(colorRegex, colorToRgba)
    .replace(colorNamesRegex, colorToRgba);
};
