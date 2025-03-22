
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ingestDocuments, prepareDocumentForIngestion } from '@/services/openai/documentService';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit contenir au moins 3 caractères.",
  }),
  content: z.string().min(10, {
    message: "Le contenu doit contenir au moins 10 caractères.",
  }),
  category: z.string().optional(),
  source: z.string().optional(),
});

interface DocumentUploadFormProps {
  onDocumentAdded: () => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onDocumentAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      source: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const documents = prepareDocumentForIngestion(values.content, {
        title: values.title,
        category: values.category || undefined,
        source: values.source || undefined,
      });
      
      const result = await ingestDocuments(documents);
      
      if (result.success) {
        form.reset();
        onDocumentAdded();
      } else {
        toast({
          title: "Erreur",
          description: `Impossible d'ajouter le document: ${result.failed} échecs.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting document:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du document.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-muted/30">
      <h3 className="text-lg font-medium mb-4">Ajouter un nouveau document</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre du document</FormLabel>
                <FormControl>
                  <Input placeholder="Titre explicite du document" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie (optionnel)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="forfaits">Forfaits mobiles</SelectItem>
                      <SelectItem value="internet">Offres Internet</SelectItem>
                      <SelectItem value="telephones">Téléphones</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="procedure">Procédure</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL ou référence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu du document</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Contenu détaillé du document..." 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Le contenu sera divisé automatiquement en morceaux optimaux pour l'IA.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                'Ajouter à la base de connaissances'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default DocumentUploadForm;
