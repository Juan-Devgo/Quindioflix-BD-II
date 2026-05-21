import { Poster } from '../../../../components/Poster'
import { Empty } from '../../../../components/Empty'
import { Icon } from '../../../../components/icons/Icon'
import { useCatalog } from '../../../../api/hooks/useCatalog'
import type { Contenido, Perfil } from '../../../../api/types'

interface SearchViewProps {
  query: string
  perfil: Perfil
  onOpen: (c: Contenido) => void
}

export function SearchView({ query, perfil, onOpen }: SearchViewProps) {
  const { data: catalog = [] } = useCatalog()
  const allowed = (it: Contenido) =>
    perfil.tipo !== 'INFANTIL' || ['TP', '+7', '+13'].includes(it.clasif)
  const q = query.toLowerCase().trim()
  const items = catalog
    .filter(allowed)
    .filter(
      (c) =>
        c.titulo.toLowerCase().includes(q) ||
        c.generos.some((g) => g.toLowerCase().includes(q)) ||
        (c.director ?? '').toLowerCase().includes(q),
    )

  return (
    <div>
      <h1 className="display" style={{ fontSize: 40, margin: '20px 0 8px' }}>
        Resultados para "{query}"
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 28 }}>{items.length} coincidencias</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 18,
        }}
      >
        {items.map((item) => (
          <Poster key={item.id} item={item} size="lg" onClick={() => onOpen(item)} />
        ))}
      </div>
      {items.length === 0 && (
        <Empty icon={Icon.search} title="Sin resultados" hint="Intenta con otra búsqueda." />
      )}
    </div>
  )
}
