import { useEbooks } from '@/hooks/useAirtableData';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, BookOpen } from 'lucide-react';

const Ebooks = () => {
  const { data: ebooks, isLoading } = useEbooks();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!ebooks || ebooks.length === 0) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading text-warning tracking-wider">Ebooks</h1>
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-muted-foreground">Aucun ebook disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading text-warning tracking-wider">Ebooks</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ebooks.map((ebook: any, index: number) => {
          const coverUrl = ebook['Image de couverture']?.[0]?.url || ebook['Image de couverture'];
          const isNew = index < 2;

          return (
            <div key={ebook.id} className="glass-card overflow-hidden group relative">
              {isNew && (
                <span className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg text-xs font-semibold gradient-gold text-primary-foreground">
                  Nouveau
                </span>
              )}

              <div className="aspect-[3/4] relative overflow-hidden">
                {coverUrl ? (
                  <img
                    src={typeof coverUrl === 'string' ? coverUrl : ''}
                    alt={ebook.Nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full gradient-gold flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary-foreground opacity-50" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-foreground font-semibold text-sm leading-tight">{ebook.Nom}</h3>
                {ebook['Sous-titre'] && (
                  <p className="text-muted-foreground text-xs line-clamp-2">{ebook['Sous-titre']}</p>
                )}

                {ebook['Lien Google Drive'] && (
                  <a
                    href={ebook['Lien Google Drive']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-warning text-xs font-semibold hover:opacity-80 transition-opacity mt-2"
                  >
                    <Download className="w-3 h-3" />
                    Télécharger
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ebooks;
