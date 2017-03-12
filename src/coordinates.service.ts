import {TransformationType} from './transformation-type.enum'
import {Direction} from './direction.enum'

type degreeValues = [number, number, number]

export class CoordinatesService {
  transform(value: string | number | null, transformationType: TransformationType, direction?: Direction): string
    | number {

    if (!transformationType || !this.isValueValid(value, direction)) {
      return ''
    } else if (transformationType === TransformationType.ToDegrees) {
      return this.transformToDegrees(value, direction)
    } else {
      return this.transformToDigit(value)
    }
  }

  isValueValid(value: string | number | null, direction?: Direction): boolean {
    return (!value && value === 0) || this.isValidDigit(value, direction) || this.isValidDegree(value)
  }

  transformToDigit(value: string | number): number {
    const potentialNumber = Number(value)
    if (!Number.isNaN(potentialNumber)) {
      return potentialNumber
    }
    return this.transformDegreesToNumber(value as string)
  }

  transformToDegrees(value: string | number, direction?: Direction): string {
    if (typeof value === 'string' && Number.isNaN(Number(value))) {
      return value
    } else {
      const numberValue = Number(value)
      return this.transformNumberToDegrees(numberValue) +
        (direction ? ` ${this.resolveDirection(numberValue, direction)}` : '')
    }
  }

  /* tslint:disable:cyclomatic-complexity */
  isValidDegree(value: string | number | null, direction?: Direction): boolean {
    // All non-strings are for sure not valid degrees.
    if (typeof value !== 'string' || !this.isValidDegreeFormat(value)) {
      return false
    }
    const values = this.extractValuesFromDegrees(value)
    // Minutes and seconds can't exceed [0,60) boundaries.
    const inBoundary = (val: number) => val >= 0 && val < 60
    if (!inBoundary(values[1]) || !inBoundary(values[2])) {
      return false
    }
    // Depending on the direction (or lack thereof), the main value can't exceed it's boundaries.
    const boundaries = this.getDirectionBoundaries(direction)
    const digitValue = this.sumDegreeValues(values)
    return !(digitValue < boundaries[0] || digitValue > boundaries[1])
  }

  /* tslint:enable */

  /* tslint:disable:cyclomatic-complexity */
  isValidDigit(value: string | number | null, direction?: Direction): boolean {
    let val: number
    if (typeof value === 'number' && !Number.isNaN(value)) {
      val = value
    } else if (typeof value === 'string') {
      val = Number(value)
      if (Number.isNaN(val)) {
        return false
      }
    } else {
      return false
    }
    const boundaries = this.getDirectionBoundaries(direction)
    return !(value < boundaries[0] || value > boundaries[1])
  }

  /* tslint:enable */

  private isValidDegreeFormat(value: string): boolean {
    return /^\d+°(\d+'(\d+")?)?(\s[NSWE])?$/.test(value)
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
    return this.sumDegreeValues(this.extractValuesFromDegrees(value)) * (this.isMinusHemisphere(value) ? -1 : 1)
  }

  private isMinusHemisphere(value: string): boolean {
    return /[SW]$/.test(value)
  }

  private sumDegreeValues(values: degreeValues): number {
    return values[0] + values[1] / 60 + values[2] / (60 * 60)
  }

  private resolveDirection(degrees: number, direction: Direction): 'N' | 'S' | 'W' | 'E' {
    if (direction === Direction.Latitude) {
      return degrees < 0 ? 'S' : 'N'
    } else {
      return degrees < 0 ? 'W' : 'E'
    }
  }

  private extractValuesFromDegrees(value: string): degreeValues {
    const values = value.split(/\D/).filter(part => Boolean(part)).map(v => Number(v))
    return values.concat(Array(3 - values.length).fill(0)) as degreeValues
  }

  private getDirectionBoundaries(direction?: Direction): [number, number] {
    return !direction || direction === Direction.Longitude ? [-180, 180] : [-90, 90]
  }
}
