import { useMemo, useState } from 'react'
import { Poster } from '../../../../components/Poster'
import { Empty } from '../../../../components/Empty'
import { Icon } from '../../../../components/icons/Icon'
import { useCatalog } from '../../../../api/hooks/useCatalog'
import type { Contenido, ContenidoTipo, Perfil } from '../../../../api/types'

type SortKey = 'populares' | 'recientes' | 'estrellas'

interface CategoryViewProps {
  tipo: ContenidoTipo
  perfil: Perfil
  title: string
  onOpen: (c: Contenido) => void
}

export function CategoryView({ tipo, perfil, title, onOpen }: CategoryViewProps) {
  const { data: catalog = [] } = useCatalog()
  const [genero, setGenero] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('populares')

  const allowed = (it: Contenido) =>
    perfil.tipo !== 'INFANTIL' || ['TP', '+7', '+13'].includes(it.clasif)

  const items = useMemo(() => {
    let list = catalog.filter((c) => c.tipo === tipo).filter(allowed)
    if (genero) list = list.filter((c) => c.generos.includes(genero))
    if (sort === 'populares') list = [...list].sort((a, b) => b.vistas - a.vistas)
    else if (sort === 'recientes')
      list = [...list].sort((a, b) => b.fechaCatalogo.localeCompare(a.fechaCatalogo))
    else if (sort === 'estrellas') list = [...list].sort((a, b) => b.promedio - a.promedio)
    return list
  }, [catalog, tipo, genero, sort, perfil.tipo])

  const generosUsados = useMemo(
    () => [...new Set(catalog.filter((c) => c.tipo === tipo).flatMap((c) => c.generos))],
    [catalog, tipo],
  )

  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: '20px 0 8px' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 28 }}>
        {items.length} títulos disponibles
      </p>
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <button
          className={'chip ' + (!genero ? 'accent' : '')}
          onClick={() => setGenero(null)}
          style={{ cursor: 'pointer' }}
        >
          Todos los géneros
        </button>
        {generosUsados.map((g) => (
          <button
            key={g}
            className={'chip ' + (genero === g ? 'accent' : '')}
            onClick={() => setGenero(g)}
            style={{ cursor: 'pointer' }}
          >
            {g}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          style={{ width: 180 }}
        >
          <option value="populares">Más populares</option>
          <option value="recientes">Recién agregados</option>
          <option value="estrellas">Mejor calificadas</option>
        </select>
      </div>
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
        <Empty icon={Icon.film} title="No hay títulos en esta categoría" hint="Prueba con otro género." />
      )}
    </div>
  )
}
