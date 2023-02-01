import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
const bcrypt = require('bcrypt');

@Injectable()
export class TransformPasswordPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value.password) {
      value.password = await bcrypt.hash(value.password, 12);
    }

    return value;
  }
}
