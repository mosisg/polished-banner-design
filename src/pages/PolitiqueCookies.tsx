
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

const PolitiqueCookies = () => {
  // Structured data for the page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Politique de cookies | ComparePrix",
    "description": "Notre politique de cookies explique comment nous utilisons les cookies et technologies similaires sur notre site."
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Politique de cookies | ComparePrix</title>
        <meta name="description" content="Notre politique de cookies explique comment nous utilisons les cookies et technologies similaires sur notre site." />
        <link rel="canonical" href="https://compareprix.fr/politique-cookies" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Politique de cookies</h1>
            <Separator className="mb-8" />
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p>
                Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés par les propriétaires de sites web pour faire fonctionner leurs sites, ou pour les rendre plus efficaces, ainsi que pour fournir des informations sur l'utilisation du site.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Comment nous utilisons les cookies</h2>
              <p>
                ComparePrix utilise différents types de cookies pour diverses raisons :
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li><strong>Cookies essentiels :</strong> Ces cookies sont nécessaires au fonctionnement de notre site web. Ils vous permettent de naviguer sur notre site et d'utiliser ses fonctionnalités.</li>
                <li><strong>Cookies de performance :</strong> Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant et rapportant des informations de manière anonyme. Ils nous aident à améliorer notre site web.</li>
                <li><strong>Cookies de fonctionnalité :</strong> Ces cookies permettent à notre site web de se souvenir des choix que vous faites et de vous offrir des fonctionnalités améliorées et personnalisées.</li>
                <li><strong>Cookies de ciblage :</strong> Ces cookies sont utilisés pour suivre les visiteurs sur les sites web. Ils sont conçus pour afficher des publicités pertinentes et attrayantes pour l'utilisateur individuel.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Liste des cookies que nous utilisons</h2>
              <table className="border-collapse w-full mt-4 mb-6">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Nom du cookie</th>
                    <th className="border border-border p-2 text-left">Objectif</th>
                    <th className="border border-border p-2 text-left">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">_ga</td>
                    <td className="border border-border p-2">Utilisé par Google Analytics pour distinguer les utilisateurs</td>
                    <td className="border border-border p-2">2 ans</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">_gid</td>
                    <td className="border border-border p-2">Utilisé par Google Analytics pour distinguer les utilisateurs</td>
                    <td className="border border-border p-2">24 heures</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">session_id</td>
                    <td className="border border-border p-2">Gérer la session utilisateur</td>
                    <td className="border border-border p-2">Session</td>
                  </tr>
                </tbody>
              </table>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Comment gérer les cookies</h2>
              <p>
                Vous pouvez contrôler et gérer les cookies de plusieurs façons. Veuillez garder à l'esprit que la suppression ou le blocage des cookies peut avoir un impact sur votre expérience utilisateur et certaines parties de notre site pourraient ne plus être pleinement accessibles.
              </p>
              <p className="mt-4">
                <strong>Via votre navigateur :</strong> La plupart des navigateurs vous permettent de voir quels cookies vous avez et de les supprimer individuellement ou de bloquer les cookies d'un site particulier ou de tous les sites. Soyez conscient que si vous supprimez tous les cookies, tous vos paramètres seront perdus, y compris la possibilité de refuser les cookies, car cette fonction elle-même nécessite un cookie.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Modifications de notre politique de cookies</h2>
              <p>
                Nous pouvons mettre à jour notre politique de cookies de temps à autre. Nous vous invitons à consulter régulièrement cette page pour rester informé de tout changement.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
              <p>
                Si vous avez des questions concernant notre utilisation des cookies, veuillez nous contacter à <a href="mailto:contact@compareprix.fr" className="text-primary hover:underline">contact@compareprix.fr</a>.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PolitiqueCookies;
