
import React from 'react';
import { Users, Star } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  comment: string;
  rating: number;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marie L.",
    comment: "Grâce à ComparePrix, j'ai économisé plus de 20€ par mois sur mon forfait mobile tout en doublant ma data. Le comparateur est vraiment simple à utiliser !",
    rating: 5,
    date: "15/03/2023"
  },
  {
    id: 2,
    name: "Thomas B.",
    comment: "J'hésitais entre plusieurs box internet, ComparePrix m'a permis de voir clairement les différences et de choisir l'offre la plus adaptée à mes besoins.",
    rating: 5,
    date: "22/01/2023"
  },
  {
    id: 3,
    name: "Julie D.",
    comment: "Un vrai gain de temps ! Toutes les offres télécom au même endroit avec des informations claires. Je recommande à 100% !",
    rating: 4,
    date: "04/04/2023"
  },
  {
    id: 4,
    name: "François M.",
    comment: "Le site est transparent et présente les vrais prix sans surprises. J'apprécie particulièrement les analyses détaillées des offres.",
    rating: 5,
    date: "10/02/2023"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-7 w-7 text-primary" />
            <h2 className="text-3xl font-bold">Ils nous font confiance</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez ce que nos utilisateurs pensent de notre service de comparaison d'offres télécom.
          </p>
        </div>
        
        <div className="relative mx-auto max-w-4xl">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 p-1">
                  <div className="bg-white p-6 rounded-lg shadow-sm h-full border border-border">
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <p className="mb-4 italic text-gray-700">"{testimonial.comment}"</p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </div>
          </Carousel>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { title: "Économisez du temps", value: "+2h", description: "gagnées en recherche" },
            { title: "Économisez de l'argent", value: "219€", description: "d'économie moyenne annuelle" },
            { title: "Utilisateurs satisfaits", value: "98%", description: "de satisfaction client" }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center border border-border">
              <h3 className="font-semibold mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
