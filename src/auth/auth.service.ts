import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // Check for existing email
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new ForbiddenException('Credentials taken');
    }
    //generate the password
    const hash = await argon.hash(dto.password);
      //save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true
        // }
      });
      console.log(user);
      delete user.hash;

      //return the saved user
      return user;
  }

  async signin(dto: AuthDto) {
    // find the user by Email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    //compare passwords
    const pwMatch = await argon.verify(user.hash, dto.password);
    //if password incorrect throw exception
    if (!pwMatch) throw new ForbiddenException('credentials Incorrect!');

    //send back user
    delete user.hash;
    return user;
  }
}
