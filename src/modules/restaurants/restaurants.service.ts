import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurants } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { customResponseHandler } from 'src/config/helpers';
import { FindRestaurantsQueryDto } from './dto/find-restaurants-query.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurants)
    private readonly restaurantModel: Repository<Restaurants>
  ){}
  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      const restaurant = await this.restaurantModel.save(createRestaurantDto);
      return customResponseHandler(restaurant, 'Restaurant created successfully');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll(query: FindRestaurantsQueryDto) {
    try {
      let restaurantQuery = this.restaurantModel.createQueryBuilder('restaurant');
      if(query.search){
        restaurantQuery.where('restaurant.name ILIKE :search OR restaurant.address ILIKE :search', {
          search: `%${query.search}%`
        });
      }
      const [restaurants, total] = await restaurantQuery
        .skip((Number(query?.page) - 1) * 10)
        .take(10)
        .orderBy('restaurant.createdAt', 'DESC')
        .leftJoinAndSelect('restaurant.menus', 'menu')
        .getManyAndCount();
      return customResponseHandler({restaurants, total}, 'Restaurants fetched successfully');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findOne(id: string) {
    try {
      let restaurant = await this.restaurantModel.createQueryBuilder('restaurant')
        .where('restaurant.id = :id', {id})
        .leftJoinAndSelect('restaurant.menus', 'menu')
        .getOne();
      if(!restaurant){
        throw 'Restaurant not found';
      }
      return customResponseHandler(restaurant, 'Restaurant fetched successfully');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    try {
      let restaurant = await this.restaurantModel.findOneBy({id});
      if(!restaurant){
        throw 'Restaurant not found';
      }
      const updatedRestaurant = await this.restaurantModel.update({id}, updateRestaurantDto);
      return customResponseHandler(updatedRestaurant, 'Restaurant updated successfully');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: string) {
    try {
      let restaurant = await this.restaurantModel.findOneBy({id});
      if(!restaurant){
        throw 'Restaurant not found';
      }
      const updatedRestaurant = await this.restaurantModel.delete({id});
      return customResponseHandler(updatedRestaurant, 'Restaurant removed successfully');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
