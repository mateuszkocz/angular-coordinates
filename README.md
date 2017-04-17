# Angular directive for matching styles to background color depending on it's contrast
[![Build Status](https://travis-ci.org/mateuszkocz/angular-coordinates.svg?branch=master)](https://travis-ci.org/mateuszkocz/angular-coordinates)
[![Code Climate](https://codeclimate.com/github/mateuszkocz/angular-coordinates/badges/gpa.svg)](https://codeclimate.com/github/mateuszkocz/angular-coordinates)
[![Test Coverage](https://codeclimate.com/github/mateuszkocz/angular-coordinates/badges/coverage.svg)](https://codeclimate.com/github/mateuszkocz/angular-coordinates/coverage)

Angular library to parse and display geographical coordinates.

## Installation

```
npm install angular-coordinates --save
```

## Usage
### Module
To have access to the Coordinates service, component and pipe, you need to import the Coordinates module into your
AppModule or any other module you want to use the library.

```ts
// app.module.ts

import {NgModule} from '@angular/core'
import {CoordinatesModule} from 'angular-coordinates';

@NgModule({
  imports: [
    CoordinatesModule
  ]
})
class AppModule {}
```

### Component
#### Information
One way to display formatted coordinates is to use the GeoCoordinates component exposed by the CoordinatesModule.
The component expects at least the value to be converted. Optionally you can provide a transformation type or direction.

Transformation type comes from the TransformationType enum and refers to one of the two types: "to degrees" (more human
readable, eg. "10°0'0" N") and "to digit". By default, the "to degrees" value is used.

Direction is an enum with two values: latitude and longitude. The direction information is used when displaying
geographical direction (N, S, W, E) and with the value validation. By default no direction is used so the output - if
using the "to degree" transformation - won't get the direction marker and the value will allow [-180, 180] range.

#### Example
```ts
import {Component} from '@angular/core'
import {TransformationType, Direction} from 'angular-coordinates';

@Component({
  template: `
    <geo-coordinates [value]="10"></geo-coordinates>
    <geo-coordinates [value]="10.5" [direction]="direction.Latitude"></geo-coordinates>
    <geo-coordinates [value]="stringValue" [type]="type.toDigit"></geo-coordinates>`
})
class MyComponent {
  stringValue = '10°0\'0" N'
  direction = Direction
  type = TransformationType
}
```

```html
<!-- Outcome -->
10°0'0"     <!-- Direction was not provided, so no "N" or "E". Transformed to degree by default. -->
10°30'0" N  <!-- Known direction. -->
10          <!-- Transforming to digit. -->
```

### Pipe
#### Information
The `coordinates` pipe works in the same way as the GeoComponent. Actually, the component just uses `coordinates` internally,
so there's no difference in how they work.

Pipe accepts two parameters: transformation type and direction. Refer to the component description to learn what they do.
Both are optional.

#### Example
```ts
import {Component} from '@angular/core'
import {TransformationType, Direction} from 'angular-coordinates';

@Component({
  template: '{{ value | coordinates:TransformationType.toDegree:Direction.Latitude }}'
})
class MyComponent {
  value = 10
}
```

```html
`10°0'0" N`
```

### Service
#### Information
The coordinates service handles all the logic behind coordinates conversion and is used by both the pipe and component.

#### Methods

##### `transform`
This is the most generic method of transformation. It expects the value to be transformed, transformation type (from the
TransformationType enum) and - optionally - the direction (from the Direction enum).

The `transform` methods returns either a string or a number, depending on what transformation type was used. If the value
was invalid, empty string is returned instead.

```ts
transform(value: string | number | null, transformationType: TransformationType, direction?: Direction): string | number
```

##### `transformToDigit`
Specific transformation that transforms the provided value into a number.

```ts
transformToDigit(value: string | number): number
```

##### `transformToDegrees`
Specific transformation that transforms the provided value into a formatted string. Optionally accepts the direction
(from the Direction enum) for enhanced validation and geographical direction marker ("N", "S", "W", "E").

```ts
transformToDegrees(value: string | number, direction?: Direction): string
```

##### `isValueValid`
Generic validator informing if the provided value is a proper digit or a string. Validity depends on the range, direction
and format. Optional direction allows to properly validate the range (latitude is only [-90, 90] while longitude is
[-180, 180]) and the geographical marker (eg. "N" and "S" are not valid longitude markers).

```ts
isValueValid(value: string | number | null, direction?: Direction): boolean
```

##### `isValidDegree`
Tests if the provided value is a valid coordinates string. Works in the same way as the `isValueValid`, but only for
strings.

```ts
isValidDegree(value: string | number | null, direction?: Direction): boolean
```

##### `isValidDigit`
Tests if the provided value is a proper coordinates digit. Takes the ranges in consideration and - if the direction is provided -
enhances this validation by understanding the proper boundaries for each direction.

```ts
isValidDigit(value: string | number | null, direction?: Direction): boolean
```

#### Example
```ts
import {Component} from '@angular/core'
import {CoordinatesService, TransformationType, Direction} from 'angular-coordinates';

@Component({
  template: '{{geolocation}}' // `10°0'0" N`
})
class MyComponent {
  constructor(coordinatesService: CoordinatesService) {
    this.geolocation = coordinatesService.transform(10, TransformationType.ToDegree, Direction.Latitude) // => `10°0'0" N`
    this.valid = coordinatesService.isValueValid(100, Direction.Latitude) // false, latitude allows only [-90, 90] values.
  }
}
```

## License
MIT
