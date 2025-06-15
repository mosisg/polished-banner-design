
import React, { useEffect } from 'react';
import 'cookieconsent/build/cookieconsent.min.css';

// Import the library correctly
const CookieConsent = require('cookieconsent');

const CookieConsentComponent: React.FC = () => {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "box inline",
          position: "bottom left",
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false
        }
      },
      categories: {
        necessary: {
          readOnly: true
        },
        functionality: {},
        analytics: {},
        performance: {},
        advertisement: {}
      },
      language: {
        default: "fr",
        autoDetect: "browser",
        translations: {
          fr: {
            consentModal: {
              title: "Nous utilisons des cookies !",
              description: "Nous utilisons des cookies pour améliorer votre expérience sur notre site. Certains cookies sont essentiels au fonctionnement du site, tandis que d'autres nous aident à comprendre comment vous utilisez notre site.",
              acceptAllBtn: "Accepter tout",
              acceptNecessaryBtn: "Rejeter tout",
              showPreferencesBtn: "Gérer les préférences",
              footer: "<a href=\"/privacy\">Politique de confidentialité</a>\n<a href=\"/cookies\">Politique des cookies</a>"
            },
            preferencesModal: {
              title: "Préférences de consentement",
              acceptAllBtn: "Accepter tout",
              acceptNecessaryBtn: "Rejeter tout",
              savePreferencesBtn: "Sauvegarder les préférences",
              closeIconLabel: "Fermer la modale",
              serviceCounterLabel: "Service|Services",
              sections: [
                {
                  title: "Utilisation des cookies 📢",
                  description: "Nous utilisons des cookies pour garantir les fonctionnalités de base du site Web et pour améliorer votre expérience en ligne. Vous pouvez choisir pour chaque catégorie d'opter pour ou de vous désinscrire quand vous le souhaitez."
                },
                {
                  title: "Cookies strictement nécessaires <span class=\"pm__badge\">Toujours activé</span>",
                  description: "Ces cookies sont essentiels au bon fonctionnement du site Web et ne peuvent pas être désactivés.",
                  linkedCategory: "necessary"
                },
                {
                  title: "Cookies de fonctionnalité",
                  description: "Ces cookies permettent au site Web de fournir des fonctionnalités et une personnalisation améliorées.",
                  linkedCategory: "functionality"
                },
                {
                  title: "Cookies d'analyse et de performance",
                  description: "Ces cookies nous permettent de mesurer et d'améliorer les performances de notre site Web.",
                  linkedCategory: "analytics"
                },
                {
                  title: "Cookies publicitaires",
                  description: "Ces cookies collectent des informations sur la façon dont vous utilisez le site Web, quelles pages vous visitez et quels liens vous suivez.",
                  linkedCategory: "advertisement"
                }
              ]
            }
          }
        }
      }
    });
  }, []);

  return null;
};

export default CookieConsentComponent;
