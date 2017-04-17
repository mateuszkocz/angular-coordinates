import {NgModule} from '@angular/core'
import {CoordinatesService} from './coordinates.service'
import {CoordinatesComponent} from './coordinates.component'
import {CoordinatesPipe} from './coordinates.pipe'

@NgModule({
  providers: [CoordinatesService],
  exports: [CoordinatesComponent, CoordinatesPipe],
  declarations: [CoordinatesComponent, CoordinatesPipe]
})
export class CoordinatesModule {}
