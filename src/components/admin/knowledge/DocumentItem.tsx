
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentItem as DocumentItemType } from '@/services/openai/documentService';
import { FileText, Trash2 } from 'lucide-react';

interface DocumentItemProps {
  document: DocumentItemType;
  onDelete: (id: string) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg bg-background hover:bg-accent/10 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">{document.metadata.title || "Document sans titre"}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(document.id)}
          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {document.metadata.category && (
          <Badge variant="outline" className="text-xs">
            {document.metadata.category}
          </Badge>
        )}
        {document.metadata.source && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Source: {document.metadata.source}
          </Badge>
        )}
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Ajouté le: {new Date(document.created_at).toLocaleDateString()}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3">
        {document.content}
      </p>
    </div>
  );
};

export default DocumentItem;
