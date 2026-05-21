import type { ReactNode } from 'react'
import { Icon } from './icons/Icon'

interface ModalProps {
  onClose: () => void
  children: ReactNode
  title?: string
  maxWidth?: number
}

export function Modal({ onClose, children, title, maxWidth = 520 }: ModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <h3 className="display" style={{ margin: 0, fontSize: 26 }}>
              {title}
            </h3>
            <button className="btn btn-ghost btn-icon" onClick={onClose}>
              <Icon.close style={{ width: 18, height: 18 }} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
