import { Poster } from '../../../components/Poster'
import { useCatalog } from '../../../api/hooks/useCatalog'

export function CatalogPreviewSection() {
  const { data: catalog = [] } = useCatalog()
  const items = catalog.slice(0, 10)
  return (
    <section
      id="catalogo"
      style={{ padding: '60px 0 80px', borderTop: '1px solid var(--border-soft)' }}
    >
      <div style={{ padding: '0 48px', maxWidth: 1280, margin: '0 auto 32px' }}>
        <h2 className="display" style={{ fontSize: 48, margin: '0 0 10px' }}>
          Lo que verás
        </h2>
        <p style={{ color: 'var(--fg-3)', fontSize: 16, margin: 0 }}>
          Una muestra de los originales y favoritos del momento.
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          padding: '0 48px',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => (
          <div key={item.id} style={{ flexShrink: 0 }}>
            <Poster item={item} size="lg" />
          </div>
        ))}
      </div>
    </section>
  )
}
