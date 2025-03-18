
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

const PolitiqueConfidentialite = () => {
  // Structured data for the page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Politique de confidentialité | ComparePrix",
    "description": "Notre politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles."
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Politique de confidentialité | ComparePrix</title>
        <meta name="description" content="Notre politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles." />
        <link rel="canonical" href="https://compareprix.fr/politique-confidentialite" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Politique de confidentialité</h1>
            <Separator className="mb-8" />
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                Chez ComparePrix, nous nous engageons à protéger votre vie privée et à traiter vos données personnelles avec soin et transparence. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre site web et nos services.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Informations que nous collectons</h2>
              <p>
                Lorsque vous utilisez ComparePrix, nous pouvons collecter différents types d'informations vous concernant, notamment :
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li><strong>Informations que vous nous fournissez :</strong> Lorsque vous créez un compte, effectuez une recherche, ou nous contactez, nous collectons des informations telles que votre nom, adresse e-mail, et vos préférences de recherche.</li>
                <li><strong>Informations de navigation :</strong> Nous collectons automatiquement certaines informations lorsque vous naviguez sur notre site, comme votre adresse IP, type d'appareil, navigateur, et la façon dont vous interagissez avec notre site.</li>
                <li><strong>Cookies et technologies similaires :</strong> Nous utilisons des cookies et d'autres technologies pour améliorer votre expérience et analyser l'utilisation de notre service.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Utilisation de vos informations</h2>
              <p>
                Nous utilisons les informations que nous collectons pour :
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Vous fournir nos services de comparaison de prix</li>
                <li>Personnaliser votre expérience</li>
                <li>Améliorer et développer nos services</li>
                <li>Communiquer avec vous</li>
                <li>Assurer la sécurité de notre site</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Partage de vos informations</h2>
              <p>
                Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec :
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Nos partenaires commerciaux et fournisseurs de services qui nous aident à exploiter notre service</li>
                <li>Les autorités légales lorsque la loi l'exige</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Vos droits</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
              <p>
                Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à <a href="mailto:contact@compareprix.fr" className="text-primary hover:underline">contact@compareprix.fr</a>.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PolitiqueConfidentialite;
