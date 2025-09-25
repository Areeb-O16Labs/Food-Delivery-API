import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { customResponseHandler } from 'src/config/helpers';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userModel: Repository<Users>,
  ){}

  async findAll(query: FindUsersQueryDto) {
    try {
      let userQuery = this.userModel.createQueryBuilder('user');
      if (query.search) {
        userQuery.where(`CONCAT(user.firstName, ' ', user.lastName) LIKE :search OR user.email LIKE :search`, { 
          search: `%${query.search}%`
        });
      }
      const [users, total] = await userQuery.skip((Number(query.page) - 1) * 10)
      .take(10)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();
      return customResponseHandler({users, total}, 'Users fetched successfully');
    }catch(err){
      throw new BadRequestException(err);
    }
  }

  async findOne(id: string) {
    try {
      let users = await this.userModel.createQueryBuilder('user').where('user.id = :id', {id}).getOne();
      if (!users) throw 'User not found';
      return customResponseHandler(users, 'Users fetched successfully');
    }catch(err){
      throw new BadRequestException(err);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      let user = await this.userModel.createQueryBuilder('user').where('user.id = :id', {id}).getOne();
      if (!user) throw 'User not found';
      let updatedUser = await this.userModel.createQueryBuilder()
        .update(user)
        .set(updateUserDto)
        .where('id = :id', { id })
        .returning('*')
        .execute();
      return customResponseHandler(updatedUser, 'User updated successfully');
    }catch(err){
      throw new BadRequestException(err);
    }
  }

  async remove(id: string) {
    try {
      let user = await this.userModel.createQueryBuilder('user').where('user.id = :id', {id}).getOne();
      if (!user) throw 'User not found';
      const data = await this.userModel.createQueryBuilder().where('id = :id', {id}).delete().execute();
      console.log(data, " data =>")
      return customResponseHandler(user, 'User deleted successfully');
    }catch(err){
      throw new BadRequestException(err);
    }
  }

  public async existingUserBy(key: string, value: string): Promise<Users> {
    return await this.userModel.findOne({
      where: { [key]: value },
      // relations: ['userRole'],
    });
  }
}
