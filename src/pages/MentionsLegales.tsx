
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

const MentionsLegales = () => {
  // Structured data for the page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Mentions légales | ComparePrix",
    "description": "Mentions légales de ComparePrix: informations sur l'éditeur du site, l'hébergement et les conditions d'utilisation."
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Mentions légales | ComparePrix</title>
        <meta name="description" content="Mentions légales de ComparePrix: informations sur l'éditeur du site, l'hébergement et les conditions d'utilisation." />
        <link rel="canonical" href="https://compareprix.fr/mentions-legales" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Mentions légales</h1>
            <Separator className="mb-8" />
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Informations légales</h2>
              <p>
                Le site ComparePrix est édité par la société ComparePrix SAS, société par actions simplifiée au capital de 10 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789, dont le siège social est situé au 123 Avenue des Champs-Élysées, 75008 Paris.
              </p>
              <p className="mt-4">
                <strong>Numéro de TVA intracommunautaire :</strong> FR12 123 456 789
              </p>
              <p className="mt-4">
                <strong>Directeur de la publication :</strong> Jean Dupont
              </p>
              <p className="mt-4">
                <strong>Contact :</strong> <a href="mailto:contact@compareprix.fr" className="text-primary hover:underline">contact@compareprix.fr</a>
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Hébergement</h2>
              <p>
                Le site ComparePrix est hébergé par la société OVH SAS, société par actions simplifiée au capital de 10 069 020 euros, immatriculée au Registre du Commerce et des Sociétés de Lille sous le numéro 424 761 419, dont le siège social est situé au 2 rue Kellermann, 59100 Roubaix.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble des éléments constituant le site ComparePrix (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site lui-même, sont soumis aux lois françaises et internationales sur le droit d'auteur et la propriété intellectuelle.
              </p>
              <p className="mt-4">
                Ces éléments sont la propriété exclusive de ComparePrix SAS. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de ComparePrix SAS.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitation de responsabilité</h2>
              <p>
                ComparePrix s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur son site, dont elle se réserve le droit de corriger le contenu à tout moment. Cependant, ComparePrix ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur son site.
              </p>
              <p className="mt-4">
                En conséquence, ComparePrix décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur son site, ainsi que pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur son site.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Liens hypertextes</h2>
              <p>
                Le site ComparePrix peut contenir des liens hypertextes vers d'autres sites internet. ComparePrix n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux liens qu'ils contiennent.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Données personnelles</h2>
              <p>
                Les informations relatives au traitement des données personnelles sont détaillées dans notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de confidentialité</a>.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Droit applicable et juridiction compétente</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MentionsLegales;
