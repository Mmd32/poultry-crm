import { toJalaali as _toJalaali } from 'jalaali-js'

export function toJalali(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  const { jy, jm, jd } = _toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate())
  const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
  return `${jd} ${months[jm - 1]} ${jy}`
}

export function toJalaliShort(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  const { jy, jm, jd } = _toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate())
  return `${jy}/${String(jm).padStart(2,'0')}/${String(jd).padStart(2,'0')}`
}
