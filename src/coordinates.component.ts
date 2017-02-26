import {Component, Input} from '@angular/core'
import {TransformationType} from './transformation-type.enum'
import {getValidTransformationType} from './getTransformationType'
import {Direction} from './direction.enum'

@Component({
  selector: 'geo-coordinates',
  template: '{{ value | coordinates:type:direction }}'
})
export class CoordinatesComponent {
  @Input()
  value: string | number | null

  @Input()
  direction: Direction | undefined

  @Input()
  set type(type: TransformationType) {
    this.internalType = getValidTransformationType(type)
  }

  get type(): TransformationType {
    return this.internalType
  }

  private internalType: TransformationType = getValidTransformationType()
}
