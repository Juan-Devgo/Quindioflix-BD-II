interface SwitchProps {
  on: boolean
  onChange: (on: boolean) => void
}

export function Switch({ on, onChange }: SwitchProps) {
  return <div className={'switch ' + (on ? 'on' : '')} onClick={() => onChange(!on)} />
}
