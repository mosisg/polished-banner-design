
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

const CGV = () => {
  // Structured data for the page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Conditions Générales de Vente | ComparePrix",
    "description": "Consultez nos Conditions Générales de Vente qui régissent l'utilisation de notre plateforme de comparaison de prix."
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Conditions Générales de Vente | ComparePrix</title>
        <meta name="description" content="Consultez nos Conditions Générales de Vente qui régissent l'utilisation de notre plateforme de comparaison de prix." />
        <link rel="canonical" href="https://compareprix.fr/cgv" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
            <Separator className="mb-8" />
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Préambule</h2>
              <p>
                Les présentes Conditions Générales de Vente (ci-après dénommées "CGV") régissent les relations entre la société ComparePrix SAS (ci-après dénommée "ComparePrix") et les utilisateurs de son site web accessible à l'adresse www.compareprix.fr (ci-après dénommé le "Site").
              </p>
              <p className="mt-4">
                ComparePrix propose un service de comparaison de prix de produits et services, notamment dans le domaine des télécommunications et de l'électronique grand public.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Définitions</h2>
              <p>
                <strong>Utilisateur :</strong> désigne toute personne physique ou morale qui accède au Site et utilise les services proposés par ComparePrix.
              </p>
              <p className="mt-4">
                <strong>Service :</strong> désigne l'ensemble des fonctionnalités proposées par ComparePrix sur son Site, notamment la comparaison de prix de produits et services.
              </p>
              <p className="mt-4">
                <strong>Partenaires :</strong> désigne les fournisseurs de produits et services dont les offres sont référencées sur le Site.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Acceptation des CGV</h2>
              <p>
                L'utilisation du Site implique l'acceptation pleine et entière des présentes CGV par l'Utilisateur. ComparePrix se réserve le droit de modifier les CGV à tout moment. Les CGV applicables sont celles en vigueur au moment de l'utilisation du Site.
              </p>
              <p className="mt-4">
                L'Utilisateur est invité à consulter régulièrement les CGV afin de prendre connaissance de toute modification éventuelle.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Description du Service</h2>
              <p>
                ComparePrix propose un service de comparaison de prix de produits et services. Le Service permet aux Utilisateurs de comparer les offres de différents fournisseurs et de trouver les meilleures offres correspondant à leurs besoins.
              </p>
              <p className="mt-4">
                ComparePrix agit en tant qu'intermédiaire entre les Utilisateurs et les Partenaires. ComparePrix n'est pas partie aux contrats conclus entre les Utilisateurs et les Partenaires.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Utilisation du Service</h2>
              <p>
                L'Utilisateur s'engage à utiliser le Service conformément aux présentes CGV et à la législation en vigueur. L'Utilisateur s'interdit notamment :
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>D'utiliser le Service à des fins illicites ou frauduleuses</li>
                <li>De porter atteinte aux droits de propriété intellectuelle de ComparePrix ou de tiers</li>
                <li>De perturber le fonctionnement normal du Site</li>
                <li>De collecter des informations sur les autres Utilisateurs sans leur consentement</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Exactitude des informations</h2>
              <p>
                ComparePrix s'efforce de fournir des informations exactes et à jour sur les produits et services référencés sur son Site. Cependant, ces informations sont fournies par les Partenaires et peuvent être modifiées sans préavis.
              </p>
              <p className="mt-4">
                ComparePrix ne peut garantir l'exactitude, l'exhaustivité ou la pertinence des informations disponibles sur le Site. Les informations sont fournies à titre indicatif et doivent être vérifiées auprès des Partenaires avant toute décision d'achat.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Responsabilité</h2>
              <p>
                ComparePrix n'est pas responsable des produits et services proposés par ses Partenaires. Les réclamations relatives aux produits et services doivent être adressées directement aux Partenaires concernés.
              </p>
              <p className="mt-4">
                ComparePrix ne peut être tenue responsable des dommages directs ou indirects résultant de l'utilisation du Site ou de l'impossibilité d'y accéder.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Propriété intellectuelle</h2>
              <p>
                L'ensemble des éléments du Site (textes, images, logos, etc.) sont la propriété exclusive de ComparePrix ou de ses partenaires et sont protégés par les lois relatives à la propriété intellectuelle.
              </p>
              <p className="mt-4">
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation préalable écrite de ComparePrix.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Protection des données personnelles</h2>
              <p>
                ComparePrix s'engage à respecter la vie privée des Utilisateurs et à traiter leurs données personnelles conformément à la législation en vigueur. Pour plus d'informations, veuillez consulter notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de confidentialité</a>.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Loi applicable et juridiction compétente</h2>
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact</h2>
              <p>
                Pour toute question relative aux présentes CGV, veuillez contacter ComparePrix à l'adresse suivante : <a href="mailto:contact@compareprix.fr" className="text-primary hover:underline">contact@compareprix.fr</a>.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default CGV;
