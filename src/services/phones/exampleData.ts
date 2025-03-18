
import { Phone } from '@/types/phones';
import { getAllExamplePhones } from './data';

// Re-export the function that provides all example phones
export const getExamplePhones = (): Phone[] => getAllExamplePhones();
