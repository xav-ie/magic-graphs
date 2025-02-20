import gsap from 'gsap';
import { DURATION_MS } from '@graph/animationController';

const { mapRange } = gsap.utils;

export const getMapper = (startSeq: number, endSeq: number) => {
  return mapRange(DURATION_MS * startSeq, DURATION_MS * endSeq, 0, 1);
};

export const inRange = (start: number, end: number, value: number) => {
  return value >= start && value <= end;
};
