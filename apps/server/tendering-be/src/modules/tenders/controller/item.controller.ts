// import { Controller } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { Item } from 'src/entities/item.entity';
// import { ExtraCrudController } from 'src/shared/controller';
// import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
// import { ItemService } from '../service/item.service';

// const options: ExtraCrudOptions = {
//   entityIdName: 'lotId',
// };

// @ApiBearerAuth()
// @Controller('items')
// @ApiTags('Item Controller')
// export class ItemController extends ExtraCrudController<Item>(options) {
//   constructor(private readonly ItemService: ItemService) {
//     super(ItemService);
//   }
// }
