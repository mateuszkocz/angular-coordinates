import {Pipe, PipeTransform} from '@angular/core'
import {CoordinatesService} from './coordinates.service'
import {TransformationType} from './transformation-type.enum'
import {getValidTransformationType} from './getTransformationType'

@Pipe({
  name: 'coordinates'
})
export class CoordinatesPipe implements PipeTransform {
  constructor(private coordinatesService: CoordinatesService) {
  }

  transform(value: string | number | null, type?: TransformationType): string | number {
    const validType = getValidTransformationType(type)
    return this.coordinatesService.transform(value, validType)
  }
}
