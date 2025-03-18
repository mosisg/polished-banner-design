
import { Plan } from './types';

export const plans: Plan[] = [
  {
    id: 1,
    name: "Forfait Essentiel",
    data: "1 Go",
    price: "1€99",
    operator: "NRJ Mobile",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement"]
  },
  {
    id: 2,
    name: "Forfait Confort",
    data: "50 Go",
    price: "7€99",
    operator: "RED by SFR",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement", "Application TV incluse"]
  },
  {
    id: 3,
    name: "Forfait Premium",
    data: "100 Go",
    price: "9€99",
    operator: "Bouygues",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement", "Application TV incluse", "Service client prioritaire"]
  },
  {
    id: 4,
    name: "Forfait Ultime",
    data: "150 Go",
    price: "12€99",
    operator: "Orange",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement", "Application TV incluse", "Service client prioritaire", "Multi-SIM incluse"]
  }
];
