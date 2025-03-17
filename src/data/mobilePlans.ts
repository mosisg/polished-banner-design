
import { MobilePlan } from '@/types/mobile';

// Sample mobile plan data
export const mobilePlans: MobilePlan[] = [
  {
    id: 1,
    name: 'Forfait 100Go',
    operator: 'Orange',
    data: '100 Go',
    price: '8.99€/mois',
    coverage: '4G/5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '15 Go d\'internet en Europe/DOM',
      'Réseau Orange - Qualité supérieure',
      'Sans engagement'
    ]
  },
  {
    id: 2,
    name: 'Forfait 200Go',
    operator: 'SFR',
    data: '200 Go',
    price: '9.99€/mois',
    coverage: '5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '20 Go d\'internet en Europe/DOM',
      'Réseau SFR',
      'Sans engagement'
    ]
  },
  {
    id: 3,
    name: 'Forfait 130Go',
    operator: 'Bouygues',
    data: '130 Go',
    price: '7.99€/mois',
    coverage: '4G/5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '12 Go d\'internet en Europe/DOM',
      'Réseau Bouygues - Excellente couverture',
      'Sans engagement'
    ]
  },
  {
    id: 4,
    name: 'Forfait 250Go',
    operator: 'Free',
    data: '250 Go',
    price: '19.99€/mois',
    coverage: '5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '25 Go d\'internet en Europe/DOM',
      'Réseau Free - 99% de couverture',
      'Sans engagement'
    ]
  },
  {
    id: 5,
    name: 'Forfait Oxygène',
    operator: 'Prixtel',
    data: '140 Go',
    price: '11.99€/mois',
    coverage: '5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '15 Go d\'internet en Europe/DOM',
      'Réseau SFR',
      'Sans engagement',
      'Prix modulable selon consommation'
    ]
  },
  {
    id: 6,
    name: 'L\'essentiel',
    operator: 'YouPrice',
    data: '130 Go',
    price: '7.99€/mois',
    coverage: '4G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '12 Go d\'internet en Europe',
      'Choix du réseau : SFR ou Orange (+2€)',
      'Sans engagement'
    ]
  },
  {
    id: 7,
    name: 'Le Basic',
    operator: 'Coriolis',
    data: '50 Go',
    price: '5.99€/mois',
    coverage: '4G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '13 Go d\'internet en Europe',
      'Réseau SFR',
      'Sans engagement'
    ]
  },
  {
    id: 8,
    name: 'Forfait Eco',
    operator: 'Auchan Télécom',
    data: '40 Go',
    price: '5.99€/mois',
    coverage: '4G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '19 Go d\'internet en Europe',
      'Réseau Bouygues Télécom',
      'Sans engagement'
    ]
  }
];
