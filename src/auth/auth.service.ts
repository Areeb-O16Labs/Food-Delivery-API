import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { checkPassword, customResponseHandler, hashPassword, tokenResponseHandler } from 'src/config/helpers';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { LoginDto } from 'src/modules/users/dto/login.dto';
import { Users } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly userModel: Repository<Users>,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }
    async login(loginDto: LoginDto) {
        try{
            const user = await this.userService.existingUserBy('email', loginDto.email);
            if (!user) throw new BadRequestException('Invalid Credentials!');
            await checkPassword(loginDto.password, user.password);
            const payload = { userId: user.id };
            const token = await this.jwtService.signAsync(payload);
            return tokenResponseHandler(user, token, 'Login Successfully');
        }catch(err){
            throw new BadRequestException(err);
        }
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.existingUserBy('email', createUserDto.email);
            if (user) throw new BadRequestException('User Already Exists!');
            createUserDto.password = await hashPassword(createUserDto.password);
            const newUser = await this.userModel.save(createUserDto);
            return customResponseHandler(newUser, 'User created successfully');
        }catch(err){
            throw new BadRequestException(err);
        }
    }
}
