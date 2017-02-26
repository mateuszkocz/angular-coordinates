import {TransformationType} from './transformation-type.enum'

export class CoordinatesService {
  transform(value: string | number | null, transformationType: TransformationType): string | number {

    if (!value || !transformationType) {
      return ''
    } else if (transformationType === TransformationType.ToDegrees) {
      return this.transformToDegrees(value)
    } else {
      const potentialNumber = Number(value)
      if (!Number.isNaN(potentialNumber)) {
        return potentialNumber
      }
      return String(this.transformToDigit(value as string))
    }
  }

  transformToDigit(value: string): number {
    return this.transformDegreesToNumber(value)
  }

  transformToDegrees(value: string | number): string {
    if (typeof value === 'string' && Number.isNaN(Number(value))) {
      return value
    } else {
      return this.transformNumberToDegrees(Number(value))
    }
  }

  private transformNumberToDegrees(value: number): string {
    const absoluteDegrees = Math.abs(Number(value))
    let fullDegrees = Math.floor(absoluteDegrees)
    const remainingMinutes = (absoluteDegrees - fullDegrees) * 60
    let minutes = Math.floor(remainingMinutes)
    const remainingSeconds = (remainingMinutes - minutes) * 60
    let seconds = Math.round(remainingSeconds)
    if (seconds === 60) {
      minutes += 1
      seconds = 0
    }
    if (minutes === 60) {
      fullDegrees += 1
      minutes = 0
    }
    return (`${fullDegrees}°${minutes}'${seconds}"`)
  }

  private transformDegreesToNumber(value: string): number {
    const digits = value.split(/\D/).filter(part => Boolean(part))
    return Number(digits[0]) + Number(digits[1]) / 60 + Number(digits[2]) / (60 * 60)
  }
}
