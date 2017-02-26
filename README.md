# Angular directive for matching styles to background color depending on it's contrast
[![Build Status](https://travis-ci.org/angular-coordinates.svg?branch=master)](https://travis-ci.org/angular-coordinates)
[![Code Climate](https://codeclimate.com/github/angular-coordinates/badges/gpa.svg)](https://codeclimate.com/github/angular-coordinates)
[![Test Coverage](https://codeclimate.com/github/angular-coordinates/badges/coverage.svg)](https://codeclimate.com/github/angular-coordinates/coverage)

Angular (2+) library to parse and display geographical coordinates.

## Installation

```
npm install angular-coordinates
```

## Usage
### Component
```
<geo-coordinates [value]="10" [direction]="Direction.Latitude"></geo-coordinates>

// Outcome
`10°0'0" N`
```

### Pipe
```
@Component({
  template: '{{ value | coordinates:TransformationType.toDegree:Direction.Latitude }}'
})
class MyComponent {
  value = 10
}

// Outcome
`10°0'0" N`
```

### Service
```
@Component({
  template: ''
})
class MyComponent {
  constructor(private coordinatesService: CoordinatesService) {
    this.geolocation = coordinatesService.transform(10) // => `10°0'0"`
  }
}
```

## License
MIT
