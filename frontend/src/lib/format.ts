import { Icon } from '../components/icons/Icon'

export const fmtCOP = (n: number) => '$' + n.toLocaleString('es-CO')
export const fmtNum = (n: number) => n.toLocaleString('es-CO')
export const fmtMin = (n: number) => (n < 60 ? `${n} min` : `${Math.floor(n / 60)}h ${n % 60}m`)

export type DeviceCode = 'TV' | 'CELULAR' | 'TABLET' | 'COMPUTADOR'

export function deviceIcon(d: DeviceCode | string) {
  const map: Record<string, typeof Icon.device.tv> = {
    TV: Icon.device.tv,
    CELULAR: Icon.device.phone,
    TABLET: Icon.device.tablet,
    COMPUTADOR: Icon.device.pc,
  }
  return map[d] ?? Icon.device.tv
}
