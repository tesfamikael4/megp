import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '@entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthHelper {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async verify(token: string, secret: string) {
    const decoded: any = this.jwt.verify(token, { secret });

    if (!decoded) {
      throw new UnauthorizedException('invalid_token');
    }
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Generate JWT Token
  public generateAccessToken(user: Account): string {
    return this.jwt.sign(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
      },
    );
  }

  // Generate JWT Refresh Token
  public generateRefreshToken(user: Account): string {
    return this.jwt.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
      },
    );
  }

  public async generateToken(account: Account) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { id: account.id, email: account.email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
        },
      ),
      this.jwt.signAsync(
        { id: account.id },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRES',
          ),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(12);

    return bcrypt.hashSync(password, salt);
  }

  // Generate OTP
  public generateOpt(): string {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;

    return '123456'; //randomNumber.toString();
  }
}
