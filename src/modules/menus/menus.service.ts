import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Repository } from 'typeorm';
import { Menus } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { customResponseHandler } from 'src/config/helpers';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class MenusService {
  constructor (
    @InjectRepository(Menus)
    private readonly menuModel: Repository<Menus>,
    private readonly restaurantService: RestaurantsService
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    try {
      await this.restaurantService.findOne(createMenuDto.restaurant);
      const menu = await this.menuModel.save({
        ...createMenuDto,
        restaurant: { id: createMenuDto.restaurant }
      });
      return customResponseHandler(menu, 'Menu created successfully');
    } catch(err){
      throw new BadRequestException(err?.response?.message || err);
    }
  }

  async findAll() {
    try{
      let menus = await this.menuModel.find({relations: ['restaurant']});
      return customResponseHandler(menus, 'Menus fetched successfully');
    }catch(err){
      throw new BadRequestException(err);
    }
  }

  async findOne(id: string) {
    try {
      let menu = await this.menuModel.findOneBy({id});
      if(!menu){
        throw 'Menu not found';
      }
      return customResponseHandler(menu, 'Menu fetched successfully');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }


  async update(id: string, updateMenuDto: UpdateMenuDto) {
    try {
      let menu = await this.menuModel.findOneBy({id});
      if(!menu){
        throw 'Menu not found';
      }
      if (updateMenuDto.restaurant) {
        await this.restaurantService.findOne(updateMenuDto.restaurant);
      }
      const updatedmenu = await this.menuModel.update({id}, {
        ...updateMenuDto,
        restaurant: { id: updateMenuDto.restaurant }
      });
      return customResponseHandler(updatedmenu, 'Menu removed successfully');
    } catch (err) {
      throw new BadRequestException(err?.response?.message || err);
    }
  }

  async remove(id: string) {
    try {
      let menu = await this.menuModel.findOneBy({id});
      if(!menu){
        throw 'Menu not found';
      }
      const updatedmenu = await this.menuModel.delete({id});
      return customResponseHandler(updatedmenu, 'Menu removed successfully');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
