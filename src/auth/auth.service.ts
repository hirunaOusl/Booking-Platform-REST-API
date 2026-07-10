import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const { email, password } = dto;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('This email is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({ email, password: hashedPassword });
    await this.userRepo.save(user);

    return { message: 'Registration successful' };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;
    const user = await this.userRepo.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException('Invalid login credentials.');
  }
}