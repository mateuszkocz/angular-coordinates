import {TransformationType} from './transformation-type.enum'

export const getValidTransformationType = (type?: TransformationType): TransformationType => {
  if (!type || (type !== TransformationType.ToDegrees && type !== TransformationType.ToDigit)) {
    return TransformationType.ToDegrees
  } else {
    return type
  }
}
