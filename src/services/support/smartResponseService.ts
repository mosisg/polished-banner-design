
/**
 * Smart Response Service
 * Provides fallback responses when AI service is unavailable
 */

/**
 * Generates a contextual response based on user input patterns and conversation history
 */
export function getSmartResponse(userMessage: string, conversationContext?: string): string {
  // If we have conversation context, attempt to provide a more coherent response
  if (conversationContext) {
    // Look for patterns in the conversation to avoid repetition
    const lowerContext = conversationContext.toLowerCase();
    const repeatedQuestions = containsRepeatedQuestions(lowerContext);
    
    if (repeatedQuestions) {
      return "Je vous ai déjà donné des informations sur ce sujet. Pouvez-vous me poser une question différente ou me demander plus de détails sur un aspect spécifique?";
    }
  }
  
  const message = userMessage.toLowerCase();
  
  // Check if user is expressing frustration with repetition
  if (message.includes("répète") || message.includes("même question") || message.includes("déjà dit") || message.includes("encore la même chose")) {
    return "Je m'excuse pour la répétition. Je vais essayer de vous donner une réponse différente. Pour mieux vous aider, pourriez-vous me donner plus de détails sur ce que vous recherchez exactement?";
  }
  
  if (message.includes("gpt") || message.includes("intelligence artificielle") || message.includes("ia")) {
    return "Notre service de chat utilise normalement l'IA avancée d'OpenAI, mais il semble que nous rencontrons actuellement des difficultés de connexion. Nous fonctionnons donc en mode limité avec des réponses prédéfinies. Nos équipes travaillent à résoudre ce problème au plus vite.";
  }
  
  if (message.includes("forfait") || message.includes("mobile") || message.includes("téléphone")) {
    if (message.includes("pas cher") || message.includes("économique") || message.includes("moins cher")) {
      return "Pour les forfaits économiques, je vous recommande de consulter les offres de Free ou RED by SFR qui proposent souvent des forfaits à moins de 10€/mois. Vous pouvez comparer toutes les offres sur notre page de comparaison de forfaits.";
    }
    if (message.includes("data") || message.includes("internet") || message.includes("go") || message.includes("giga")) {
      return "Pour les forfaits avec beaucoup de data, les offres de Free (150Go) et SFR (100Go et plus) sont généralement intéressantes. Consultez notre comparateur pour voir les meilleures offres du moment en fonction de vos besoins en data.";
    }
    if (message.includes("étranger") || message.includes("europe") || message.includes("international") || message.includes("voyage")) {
      return "Pour une utilisation à l'étranger, les forfaits de Orange, SFR et Bouygues incluent généralement l'Europe. Free propose de la data utilisable dans plus de 100 destinations avec son forfait à 19,99€. Je vous conseille de consulter notre comparateur de forfaits pour plus de détails.";
    }
    return "Nous proposons un comparateur complet de forfaits mobiles. Vous pouvez filtrer selon vos besoins (data, prix, opérateur) sur notre page dédiée. Souhaitez-vous des conseils sur un type de forfait particulier?";
  }
  
  if (message.includes("box") || message.includes("internet") || message.includes("fibre") || message.includes("adsl")) {
    if (message.includes("fibre")) {
      return "Pour la fibre optique, les offres sont généralement entre 30€ et 50€ par mois. Free propose sa Freebox à partir de 29,99€/mois, Orange a sa Livebox Fibre à partir de 39,99€/mois. Pour trouver l'offre idéale, utilisez notre comparateur de box internet qui vous permet de filtrer selon vos critères.";
    }
    if (message.includes("tv") || message.includes("télé") || message.includes("television")) {
      return "Pour les box avec de bonnes options TV, je recommande les offres de SFR et Orange qui proposent de nombreuses chaînes et des décodeurs 4K. Les offres Freebox incluent également des services de streaming. Consultez notre comparateur pour voir les détails des bouquets TV inclus dans chaque offre.";
    }
    if (message.includes("sans engagement") || message.includes("engagement")) {
      return "Pour les box sans engagement, regardez du côté de Free et de RED by SFR qui proposent des offres sans condition de durée. Notre comparateur vous permet de filtrer les offres sans engagement.";
    }
    return "Notre site vous permet de comparer toutes les box internet des principaux fournisseurs. Vous pouvez filtrer par type de connexion (ADSL/Fibre), débit, prix et options TV. Avez-vous des préférences particulières pour votre box internet?";
  }
  
  if (message.includes("smartphone") || message.includes("iphone") || message.includes("samsung") || message.includes("xiaomi") || message.includes("android")) {
    return "Nous proposons un comparateur de smartphones qui vous permet de trouver le téléphone idéal selon votre budget et vos besoins. Vous pouvez comparer les caractéristiques techniques et les meilleurs prix du marché. Souhaitez-vous des conseils pour un modèle particulier?";
  }
  
  if (message.includes("comment") && message.includes("fonctionne")) {
    return "Notre site ComparePrix vous permet de comparer les offres de forfaits mobiles, box internet et smartphones. Nous récupérons les informations directement auprès des opérateurs pour vous fournir des comparaisons à jour. Vous pouvez filtrer les offres selon vos critères et être redirigé vers le site de l'opérateur pour souscrire.";
  }
  
  if (message.includes("comparer") || message.includes("comparaison")) {
    return "Notre site vous permet de comparer facilement les offres en utilisant des filtres personnalisés. Vous pouvez ajuster les critères comme le prix, la quantité de data, les options, etc. Les résultats sont mis à jour quotidiennement pour vous garantir les informations les plus récentes. Vous pouvez accéder à nos comparateurs depuis le menu principal.";
  }
  
  return "Je peux vous aider à trouver les meilleures offres de forfaits mobiles, box internet ou smartphones. N'hésitez pas à me poser des questions précises sur vos besoins, ou à utiliser directement nos comparateurs accessibles depuis la page d'accueil. Puis-je vous aider sur un sujet particulier?";
}

/**
 * Helper function to detect repeated questions in conversation
 */
function containsRepeatedQuestions(conversationContext: string): boolean {
  // Split conversation into user messages
  const userMessages = conversationContext.split('user:').slice(1);
  
  if (userMessages.length < 2) {
    return false;
  }
  
  // Get the last two user messages
  const lastMessage = userMessages[userMessages.length - 1].split('assistant:')[0].trim();
  const previousMessage = userMessages[userMessages.length - 2].split('assistant:')[0].trim();
  
  // Check similarity using a simple metric
  const similarity = calculateSimilarity(lastMessage, previousMessage);
  return similarity > 0.7; // If more than 70% similar, consider it a repeat
}

/**
 * Very simple text similarity calculation
 */
function calculateSimilarity(text1: string, text2: string): number {
  // Convert to lowercase and remove punctuation
  const sanitize = (text: string) => {
    return text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  };
  
  const sanitized1 = sanitize(text1);
  const sanitized2 = sanitize(text2);
  
  // Count common words
  const words1 = sanitized1.split(/\s+/);
  const words2 = sanitized2.split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  
  // Calculate Jaccard similarity
  const uniqueWords = new Set([...words1, ...words2]);
  return commonWords.length / uniqueWords.size;
}
