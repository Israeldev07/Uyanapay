import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterClientDto, RegisterYanapayerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private async signToken(userId: string, email: string, role: Role) {
    return this.jwt.signAsync({ sub: userId, email, role });
  }

  private sanitize<T extends { passwordHash: string }>(user: T) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async registerClient(dto: RegisterClientDto) {
    return this.register(dto, Role.CLIENTE);
  }

  async registerYanapayer(dto: RegisterYanapayerDto) {
    const user = await this.register(dto, Role.YANAPAYER);
    await this.prisma.yanapayerProfile.create({
      data: {
        userId: user.user.id,
        cedula: dto.cedula,
        semester: dto.semester,
        bankAccount: dto.bankAccount,
        transport: dto.transport,
        schedule: dto.schedule,
      },
    });
    return user;
  }

  private async register(dto: RegisterClientDto, role: Role) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('El correo ya está registrado');

    const university = await this.prisma.university.upsert({
      where: { name: dto.university },
      update: {},
      create: { name: dto.university },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, 10),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        career: dto.career,
        role,
        acceptedTos: dto.acceptedTos,
        universityId: university.id,
        wallet: { create: {} },
      },
    });

    return {
      user: this.sanitize(user),
      accessToken: await this.signToken(user.id, user.email, user.role),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { university: true, yanapayerProfile: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return {
      user: this.sanitize(user),
      accessToken: await this.signToken(user.id, user.email, user.role),
    };
  }
}
