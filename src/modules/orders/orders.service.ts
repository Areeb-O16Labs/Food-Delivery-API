import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, Repository } from 'typeorm';
import { Orders } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { customResponseHandler } from 'src/config/helpers';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Menus } from '../menus/entities/menu.entity';
import { OrderStatus } from 'src/utils/enums';
import { OrderItems } from './entities/order-items';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';

@Injectable()
export class OrdersService {
  constructor (
    @InjectRepository(Orders)
    private readonly orderModel: Repository<Orders>,
    @InjectRepository(OrderItems)
    private readonly orderItemsModel: Repository<OrderItems>,
    private readonly dataSource: DataSource,
    private readonly restaurantService: RestaurantsService
  ) {}

  // create order without transaction 
  async create1(createOrderDto: CreateOrderDto, userId: string) {
    try {
      // check if restaurant exists
      const restaurant = await this.restaurantService.findOne(createOrderDto.restaurant_id);
      
      // check if menu exists in the restaurant
      for (let item of createOrderDto.menus) {
        if (!restaurant?.data?.menus?.find((menu: Menus) => menu.id === item.menuId)) {
          throw `Menu with id ${item.menuId} does not exist in the restaurant`;
        }
      }

      // create order
      const order = new Orders();
      order.restaurant = restaurant.data.id;
      order.restaurant = { id: restaurant.data.id } as any;
      order.user = { id: userId } as any;
      const newOrder = await this.orderModel.save(order);

      // create order items
      const orderItems = createOrderDto.menus.map((item) => {
        const orderItem = new OrderItems();
        orderItem.order = newOrder;
        orderItem.menu = { id: item.menuId } as any;
        orderItem.quantity = item.quantity;
        orderItem.price = item.price;
        return orderItem;
      });

      await this.orderModel.manager.save(orderItems);
      // await this.orderItemsModel.save(orderItems);
      return customResponseHandler(newOrder, 'Order created successfully');
    } catch (err) {
      throw new BadRequestException(err?.response?.message || err);
    }
  }

  // create order with transaction 
  async create(createOrderDto: CreateOrderDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // check if restaurant exists
      const restaurant = await this.restaurantService.findOne(createOrderDto.restaurant_id);
      
      // check if menu exists in the restaurant
      for (let item of createOrderDto.menus) {
        if (!restaurant?.data?.menus?.find((menu: Menus) => menu.id === item.menuId)) {
          throw `Menu with id ${item.menuId} does not exist in the restaurant`;
        }
      }

      // create order
      const order = new Orders();
      order.restaurant = restaurant.data.id;
      order.restaurant = { id: restaurant.data.id } as any;
      order.user = { id: userId } as any;
      order.status = OrderStatus.PENDING;
      const newOrder = await queryRunner.manager.save(order);

      // create order items
      for (let item of createOrderDto.menus) {
        const orderItem = new OrderItems();
        orderItem.order = newOrder;
        orderItem.menu = { id: item.menuId } as any;
        orderItem.quantity = item.quantity;
        orderItem.price = item.price;
        await queryRunner.manager.save(orderItem);
      }
      const savedOrder = await queryRunner.manager.findOne(Orders, {
        where: { id: newOrder.id },
        relations: ['restaurant', 'user', 'items', 'items.menu'],
      });
      await queryRunner.commitTransaction();
      return customResponseHandler(savedOrder, 'Order created successfully');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err?.response?.message || err);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: FindOrdersQueryDto) {
    try {
      const skip = ((parseInt(query.page) || 1) - 1) * 10;
      const take = 10;
      const orderQuery = this.orderModel.createQueryBuilder('orders')
        .leftJoinAndSelect('orders.user', 'user')
        .leftJoinAndSelect('orders.restaurant', 'restaurant')
        .leftJoinAndSelect('orders.items', 'items')
        .leftJoinAndSelect('items.menu', 'menu');
        
      if (query.search) {
        orderQuery.andWhere(
          `orders.id::text LIKE :search
          OR orders.status::text LIKE :search
          OR restaurant.name ILIKE :search
          OR CONCAT(user.firstName, ' ', user.lastName) ILIKE :search
          OR user.email ILIKE :search`,
          { search: `%${query.search}%` }
        );
      }
      const [orders, total] = await orderQuery
        .skip(skip)
        .take(take)
        .orderBy('orders.createdAt', 'DESC')
        .getManyAndCount();
      return customResponseHandler({ orders, total }, 'Orders fetched successfully');
    }catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findOne(id: string) {
    try {
      const orders = await this.orderModel.createQueryBuilder('orders')
        .where('orders.id = :id', { id })
        .leftJoinAndSelect('orders.user', 'user')
        .leftJoinAndSelect('orders.restaurant', 'restaurant')
        .leftJoinAndSelect('orders.items', 'items')
        .leftJoinAndSelect('items.menu', 'menu')
        .getOne();
      if (!orders) throw 'Order not found';
      return customResponseHandler(orders, 'Order fetched successfully');
    }catch (err) {
      throw new BadRequestException(err);
    }
  }
}
