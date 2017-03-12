import {Component, DebugElement} from '@angular/core'
import {TestBed, ComponentFixture, inject} from '@angular/core/testing'
import {TransformationType} from './transformation-type.enum'
import {CoordinatesModule} from './coordinates.module'
import {Direction} from './direction.enum'
import {CoordinatesService} from './coordinates.service'

describe('Coordinates library', () => {
  let fixture: ComponentFixture<TestComponent>
  let component: TestComponent
  let debugElement: DebugElement
  type testTransformationTypes = TransformationType | null | 'invalid'

  // Test component.
  @Component({
    template: `{{ value | coordinates:conversionType:direction}} |
    <geo-coordinates [value]="value" [type]="conversionType" [direction]="direction"></geo-coordinates>`
  })
  class TestComponent {
    value: string | number | null = null
    conversionType: testTransformationTypes = null
    direction: Direction | undefined
  }

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [CoordinatesModule],
      declarations: [TestComponent]
    }).createComponent(TestComponent)
    component = fixture.componentInstance
    debugElement = fixture.debugElement
  })

  describe('Component and pipe', () => {
    const getContent = () => {
      const content = debugElement.nativeElement.textContent
      const parts = content.split('|').map((part: string) => part.trim())
      if (parts[0] !== parts[1]) {
        throw new Error(`
        Pipe\'s and component\'s should be the same!
        Pipe value: ${parts[0]}
        Component value: ${parts[1]}
      `)
      } else {
        return parts[0]
      }
    }
    const setValue = (value: string | number | null) => {
      component.value = value
      fixture.detectChanges()
    }
    const setType = (type: testTransformationTypes) => {
      component.conversionType = type
      fixture.detectChanges()
    }
    const setDirection = (direction: Direction) => {
      component.direction = direction
      fixture.detectChanges()
    }

    it('should display an empty element when no value is provided', () => {
      fixture.detectChanges()
      expect(getContent()).toBe('')
    })

    it('should display an empty value no matter what transformation type is selected', () => {
      setType(TransformationType.ToDegrees)
      expect(getContent()).toBe('')
      setType(TransformationType.ToDigit)
      expect(getContent()).toBe('')
    })

    it('should transform digits to degrees when "to degrees" transformation is selected', () => {
      setType(TransformationType.ToDegrees)
      setValue(10)
      expect(getContent()).toBe(`10°0'0"`)
      setValue('20.123')
      expect(getContent()).toBe(`20°7'23"`)
      setValue(-30.56789)
      expect(getContent()).toBe(`30°34'4"`)
      setValue(30.999999)
      expect(getContent()).toBe(`31°0'0"`)
    })

    it('should display degrees as they were provided when "to degrees" transformation is selected', () => {
      setType(TransformationType.ToDegrees)
      setValue(`10°0'0"`)
      expect(getContent()).toBe(`10°0'0"`)
      setValue(`20°7'23"`)
      expect(getContent()).toBe(`20°7'23"`)
      setValue(`30°34'4"`)
      expect(getContent()).toBe(`30°34'4"`)
    })

    it('should use "to degrees" transformation by default', () => {
      setType(null)
      setValue(`10°0'0"`)
      expect(getContent()).toBe(`10°0'0"`)
      setValue(10)
      expect(getContent()).toBe(`10°0'0"`)
    })

    it('should use "to degrees" when an invalid transformation type was provided', () => {
      setType('invalid')
      setValue(`10°0'0"`)
      expect(getContent()).toBe(`10°0'0"`)
      setValue(10)
      expect(getContent()).toBe(`10°0'0"`)
    })

    it('should transform degrees to a number when "to digit" transformation is requested', () => {
      setType(TransformationType.ToDigit)
      setValue(`10°0'0"`)
      expect(getContent()).toBe('10')
      setValue(`20°10'30"`)
      expect(getContent()).toBe('20.175')
    })

    it('should handle geographical direction when transforming from degrees to digits', () => {
      setType(TransformationType.ToDigit)
      setValue(`10°0'0" N`)
      expect(getContent()).toBe('10')
      setValue(`10°0'0" S`)
      expect(getContent()).toBe('-10')
      setValue(`10°0'0" E`)
      expect(getContent()).toBe('10')
      setValue(`10°0'0" W`)
      expect(getContent()).toBe('-10')
    })

    it('should display a number when "to digit" transformation is set and the number was provided', () => {
      setType(TransformationType.ToDigit)
      setValue(10)
      expect(getContent()).toBe('10')
      setValue('20.123')
      expect(getContent()).toBe('20.123')
      setValue(-30.56789)
      expect(getContent()).toBe('-30.56789')
    })

    it('should optionally display a direction when used with "to degrees" transformation', () => {
      setValue(10)
      setDirection(Direction.Latitude)
      expect(getContent()).toBe(`10°0'0" N`)
      setValue(-20)
      setDirection(Direction.Latitude)
      expect(getContent()).toBe(`20°0'0" S`)
      setValue(30)
      setDirection(Direction.Longitude)
      expect(getContent()).toBe(`30°0'0" E`)
      setValue(-40)
      setDirection(Direction.Longitude)
      expect(getContent()).toBe(`40°0'0" W`)
    })

    it('should not display invalid values', () => {
      // ...
    })
  })

  // Mostly covered by the "Component and pipe" suit.
  describe('Service', () => {
    let service: CoordinatesService
    beforeEach(inject([CoordinatesService], (coordinatesService: CoordinatesService) => {
      service = coordinatesService
    }))

    it('should validate degree values', () => {
      expect(service.isValidDegree(`40°0'0"`)).toBe(true)
      expect(service.isValidDegree(`40°`)).toBe(true)
      expect(service.isValidDegree(`40°0'`)).toBe(true)
      expect(service.isValidDegree(`0°0'0"`)).toBe(true)
      expect(service.isValidDegree(`180°0'0"`)).toBe(true)
      expect(service.isValidDegree(40)).toBe(false)
      expect(service.isValidDegree(`40°błąd'`)).toBe(false)
      expect(service.isValidDegree(`180°1'0"`)).toBe(false)
      expect(service.isValidDegree(`40°0"`)).toBe(false)
      expect(service.isValidDegree(`181°0'0"`)).toBe(false)
      expect(service.isValidDegree(`0°60'0"`)).toBe(false)
      expect(service.isValidDegree(`0°0'60"`)).toBe(false)
      expect(service.isValidDegree(`0°0'90"`)).toBe(false)
      expect(service.isValidDegree(`0°82'90"`)).toBe(false)
      expect(service.isValidDegree(`niepoprawny`)).toBe(false)
    })

    it('should validate degree values depending on the direction if provided', () => {
      // TODO: Should handle NSWE directions.
      expect(service.isValidDegree(`180°0'0"`, Direction.Longitude)).toBe(true)
      // expect(service.isValidDigit(-180, Direction.Longitude)).toBe(true)
      expect(service.isValidDegree(`181°0'0"`, Direction.Longitude)).toBe(false)
      // expect(service.isValidDigit(-181, Direction.Longitude)).toBe(false)
      expect(service.isValidDegree(`90°0'0"`, Direction.Latitude)).toBe(true)
      // expect(service.isValidDigit(-90, Direction.Latitude)).toBe(true)
      expect(service.isValidDegree(`91°0'0"`, Direction.Latitude)).toBe(false)
      // expect(service.isValidDigit(-91, Direction.Latitude)).toBe(false)
    })

    it('should validate digit values', () => {
      expect(service.isValidDigit(0)).toBe(true)
      expect(service.isValidDigit(10)).toBe(true)
      expect(service.isValidDigit(-10)).toBe(true)
      expect(service.isValidDigit(10.234523)).toBe(true)
      expect(service.isValidDigit(10.9999)).toBe(true)
      expect(service.isValidDigit(180)).toBe(true)
      expect(service.isValidDigit(-180)).toBe(true)
      expect(service.isValidDigit('10')).toBe(true)
      expect(service.isValidDigit('10.9999')).toBe(true)
      expect(service.isValidDigit(NaN)).toBe(false)
      expect(service.isValidDigit('łańcuch')).toBe(false)
      expect(service.isValidDigit(-181)).toBe(false)
      expect(service.isValidDigit(181)).toBe(false)
    })

    it('should validate digit values depending on the direction if provided', () => {
      expect(service.isValidDigit(180, Direction.Longitude)).toBe(true)
      expect(service.isValidDigit(-180, Direction.Longitude)).toBe(true)
      expect(service.isValidDigit(181, Direction.Longitude)).toBe(false)
      expect(service.isValidDigit(-181, Direction.Longitude)).toBe(false)
      expect(service.isValidDigit(90, Direction.Latitude)).toBe(true)
      expect(service.isValidDigit(-90, Direction.Latitude)).toBe(true)
      expect(service.isValidDigit(91, Direction.Latitude)).toBe(false)
      expect(service.isValidDigit(-91, Direction.Latitude)).toBe(false)
    })
  })
})
