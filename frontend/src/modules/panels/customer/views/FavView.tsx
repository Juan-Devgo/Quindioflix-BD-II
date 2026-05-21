import { Poster } from '../../../../components/Poster'
import { Empty } from '../../../../components/Empty'
import { Icon } from '../../../../components/icons/Icon'
import { useCatalog } from '../../../../api/hooks/useCatalog'
import { useFavorites } from '../../../../api/hooks/useFavorites'
import type { Contenido, Perfil } from '../../../../api/types'

interface FavViewProps {
  perfil: Perfil
  onOpen: (c: Contenido) => void
}

export function FavView({ perfil, onOpen }: FavViewProps) {
  const { data: catalog = [] } = useCatalog()
  const { data: favorites = [] } = useFavorites(perfil.id)
  const items = favorites
    .map((f) => ({ ...f, item: catalog.find((c) => c.id === f.idContenido) }))
    .filter((x): x is typeof x & { item: Contenido } => !!x.item)

  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: '20px 0 8px' }}>
        Mi lista
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 28 }}>{items.length} títulos guardados</p>
      {items.length === 0 ? (
        <Empty
          icon={Icon.heart}
          title="Tu lista está vacía"
          hint="Agrega contenido con el botón ♥ desde cualquier título."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 18,
          }}
        >
          {items.map(({ item, fecha }) => (
            <div key={item.id}>
              <Poster item={item} size="lg" onClick={() => onOpen(item)} />
              <div
                style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}
                className="mono"
              >
                Agregado {fecha}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
