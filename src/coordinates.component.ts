import {Component, Input} from '@angular/core'
import {TransformationType} from './transformation-type.enum'
import {getValidTransformationType} from './getTransformationType'

@Component({
  selector: 'coordinates-display',
  template: '{{ value | coordinates:type }}'
})
export class CoordinatesComponent {
  @Input()
  value: string | number | null

  @Input()
  set type(type: TransformationType) {
    this.internalType = getValidTransformationType(type)
  }

  get type(): TransformationType {
    return this.internalType
  }

  private internalType: TransformationType = getValidTransformationType()
}
