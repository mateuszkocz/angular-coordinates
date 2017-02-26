import {NgModule} from '@angular/core'
import {CoordinatesService} from './coordinates.service'
import {CoordinatesComponent} from './coordinates.component'
import {CoordinatesPipe} from './coordinates.pipe'

const declarations = [CoordinatesComponent, CoordinatesPipe]

@NgModule({
  providers: [CoordinatesService],
  exports: [...declarations],
  declarations: [...declarations]
})
export class CoordinatesModule {}
