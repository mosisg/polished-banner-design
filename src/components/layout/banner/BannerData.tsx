
import { Plan } from './types';

export const plans: Plan[] = [
  {
    id: 1,
    name: "Forfait 5G",
    data: "20 Go",
    price: "4€99",
    operator: "Sosh",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "10 Go utilisables en Europe/DOM", "Sans engagement", "Réseau Orange"]
  },
  {
    id: 2,
    name: "Forfait Série Free",
    data: "90 Go",
    price: "8€99",
    operator: "Free",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "15 Go utilisables en Europe/DOM", "Sans engagement", "5G incluse", "Appli Free Ligue 1"]
  },
  {
    id: 3,
    name: "Forfait B&You",
    data: "100 Go",
    price: "9€99",
    operator: "Bouygues",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "20 Go utilisables en Europe/DOM", "Sans engagement", "5G en option (+3€/mois)", "Service client 7j/7"]
  },
  {
    id: 4,
    name: "RED Box",
    data: "130 Go",
    price: "11€99",
    operator: "RED by SFR",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "25 Go utilisables en Europe/DOM", "Sans engagement", "5G incluse", "SFR TV inclus"]
  },
  {
    id: 5,
    name: "Forfait Orange 5G",
    data: "150 Go",
    price: "19€99",
    operator: "Orange",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "30 Go utilisables en Europe/DOM", "Sans engagement", "5G incluse", "Orange TV inclus", "Multi-SIM"]
  },
  {
    id: 6,
    name: "Forfait Oxygène",
    data: "80 Go",
    price: "7€99",
    operator: "Prixtel",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "15 Go utilisables en Europe/DOM", "Sans engagement", "Forfait neutre en CO2", "Prix ajustable selon consommation"]
  },
  {
    id: 7,
    name: "Forfait Eco",
    data: "50 Go",
    price: "6€99",
    operator: "Auchan Telecom",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "10 Go utilisables en Europe/DOM", "Sans engagement", "Réseau Bouygues Telecom"]
  },
  {
    id: 8,
    name: "L'essentiel",
    data: "60 Go",
    price: "5€99",
    operator: "YouPrice",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités en France", "12 Go utilisables en Europe/DOM", "Sans engagement", "Choix entre réseau Orange ou SFR"]
  }
];
