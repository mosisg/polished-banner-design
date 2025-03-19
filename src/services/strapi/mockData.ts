
import { StrapiArticle } from './types';

// Mock data for development
export const MOCK_ARTICLES: StrapiArticle[] = [
  {
    id: 1,
    attributes: {
      title: "Comment choisir le forfait mobile idéal en 2023",
      description: "Guide complet pour trouver le forfait mobile qui correspond à vos besoins et à votre budget.",
      slug: "comment-choisir-forfait-mobile-ideal",
      createdAt: "2023-06-15T10:00:00.000Z",
      updatedAt: "2023-06-15T10:00:00.000Z",
      publishedAt: "2023-06-15T10:00:00.000Z",
      cover: {
        data: {
          id: 1,
          attributes: {
            url: "/placeholder.svg",
            width: 1200,
            height: 630,
            alternativeText: "Forfait mobile"
          }
        }
      },
      author: {
        data: {
          id: 1,
          attributes: {
            name: "Sophie Martin",
            avatar: {
              data: {
                id: 2,
                attributes: {
                  url: "/placeholder.svg",
                  width: 200,
                  height: 200,
                  alternativeText: "Sophie Martin"
                }
              }
            }
          }
        }
      },
      category: {
        data: {
          id: 1,
          attributes: {
            name: "Forfaits Mobiles",
            slug: "forfaits-mobiles"
          }
        }
      },
      blocks: [
        {
          __component: "shared.rich-text",
          id: 1,
          body: "<h2>Comprendre vos besoins en data</h2><p>Avant de choisir un forfait, évaluez votre consommation mensuelle de données. Utilisez-vous principalement votre téléphone pour les e-mails et la navigation web, ou êtes-vous un grand consommateur de vidéos en streaming et de jeux en ligne ?</p>"
        },
        {
          __component: "shared.quote",
          id: 2,
          title: "À savoir",
          body: "En moyenne, regarder une vidéo en HD sur YouTube consomme environ 1,5 Go par heure."
        },
        {
          __component: "shared.media",
          id: 3,
          file: {
            data: {
              id: 3,
              attributes: {
                url: "/placeholder.svg",
                width: 800,
                height: 450,
                alternativeText: "Consommation de data"
              }
            }
          }
        }
      ]
    }
  },
  {
    id: 2,
    attributes: {
      title: "Les box internet fibre : comparatif des meilleures offres",
      description: "Découvrez notre comparatif détaillé des meilleures box internet fibre du marché.",
      slug: "comparatif-meilleures-box-internet-fibre",
      createdAt: "2023-05-20T14:30:00.000Z",
      updatedAt: "2023-05-20T14:30:00.000Z",
      publishedAt: "2023-05-20T14:30:00.000Z",
      cover: {
        data: {
          id: 4,
          attributes: {
            url: "/placeholder.svg",
            width: 1200,
            height: 630,
            alternativeText: "Box internet fibre"
          }
        }
      },
      author: {
        data: {
          id: 2,
          attributes: {
            name: "Thomas Dubois",
            avatar: {
              data: {
                id: 5,
                attributes: {
                  url: "/placeholder.svg",
                  width: 200,
                  height: 200,
                  alternativeText: "Thomas Dubois"
                }
              }
            }
          }
        }
      },
      category: {
        data: {
          id: 2,
          attributes: {
            name: "Box Internet",
            slug: "box-internet"
          }
        }
      },
      blocks: [
        {
          __component: "shared.rich-text",
          id: 4,
          body: "<h2>Pourquoi passer à la fibre ?</h2><p>La fibre optique offre des débits bien supérieurs à l'ADSL, permettant une utilisation simultanée de plusieurs appareils sans perte de qualité.</p>"
        },
        {
          __component: "shared.slider",
          id: 5,
          files: {
            data: [
              {
                id: 6,
                attributes: {
                  url: "/placeholder.svg",
                  width: 600,
                  height: 400,
                  alternativeText: "Box fibre opérateur 1"
                }
              },
              {
                id: 7,
                attributes: {
                  url: "/placeholder.svg",
                  width: 600,
                  height: 400,
                  alternativeText: "Box fibre opérateur 2"
                }
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: 3,
    attributes: {
      title: "5G : tout ce que vous devez savoir sur cette nouvelle technologie",
      description: "Découvrez les avantages de la 5G et comment cette technologie va transformer notre façon d'utiliser internet sur mobile.",
      slug: "5g-tout-ce-que-vous-devez-savoir",
      createdAt: "2023-07-10T09:15:00.000Z",
      updatedAt: "2023-07-10T09:15:00.000Z",
      publishedAt: "2023-07-10T09:15:00.000Z",
      cover: {
        data: {
          id: 8,
          attributes: {
            url: "/placeholder.svg",
            width: 1200,
            height: 630,
            alternativeText: "Technologie 5G"
          }
        }
      },
      author: {
        data: {
          id: 3,
          attributes: {
            name: "Antoine Leroy",
            avatar: {
              data: {
                id: 9,
                attributes: {
                  url: "/placeholder.svg",
                  width: 200,
                  height: 200,
                  alternativeText: "Antoine Leroy"
                }
              }
            }
          }
        }
      },
      category: {
        data: {
          id: 1,
          attributes: {
            name: "Forfaits Mobiles",
            slug: "forfaits-mobiles"
          }
        }
      },
      blocks: [
        {
          __component: "shared.rich-text",
          id: 6,
          body: "<h2>Qu'est-ce que la 5G ?</h2><p>La 5G est la cinquième génération de réseaux mobiles. Elle offre des débits beaucoup plus rapides que la 4G, une latence réduite et la possibilité de connecter un plus grand nombre d'appareils simultanément.</p>"
        },
        {
          __component: "shared.quote",
          id: 7,
          title: "Le saviez-vous ?",
          body: "Avec la 5G, vous pouvez télécharger un film HD en quelques secondes seulement."
        },
        {
          __component: "shared.media",
          id: 8,
          file: {
            data: {
              id: 10,
              attributes: {
                url: "/placeholder.svg",
                width: 800,
                height: 450,
                alternativeText: "Illustration 5G"
              }
            }
          }
        }
      ]
    }
  }
];
