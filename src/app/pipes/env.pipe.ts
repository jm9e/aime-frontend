import { Pipe, PipeTransform } from '@angular/core';
import {environment} from '../../environments/environment';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'env'})
export class EnvPipe implements PipeTransform {
  transform(variable: string): any {
    return environment[variable];
  }
}
