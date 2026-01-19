import { ConfigModule } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { BoilerPartModule } from 'src/boiler-part/boiler-part.module';
import { BoilerPartService } from 'src/boiler-part/boiler-part.service';
import { GetAllBoilerPartDto } from 'src/boiler-part/dto/get-all-boiler-part.dto';
import {
  BoilerPart,
  FindByNameResponse,
  GetBestsellersResponse,
  PaginatedAndFilterResponse,
} from 'src/boiler-part/types';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import request from 'supertest';

const mockedUser = {
  username: 'part_controller',
  email: 'part_controller@test.ru',
  password: 'mock_123',
};

describe('Boiler Parts Controller', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let boilerPartsService: BoilerPartService;
  let userService: UserService;
  let authService: AuthService;
  // Перед КАЖДЫМ тестом создает "чистое" тестовое окружение

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        BoilerPartModule,
        UserModule,
        AuthModule,
        ConfigModule.forRoot(),
      ],
    }).compile();

    prisma = testModule.get<PrismaService>(PrismaService);
    boilerPartsService = testModule.get<BoilerPartService>(BoilerPartService);
    userService = testModule.get<UserService>(UserService);
    authService = testModule.get<AuthService>(AuthService);
    app = testModule.createNestApplication<NestExpressApplication>();

    app.use(
      session({
        secret: '12345',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();

    const user = await userService.create(mockedUser);
    expect(user).toBeDefined();
  });

  afterEach(async () => {
    await prisma.user.delete({ where: { username: 'part_controller' } });
  });

  afterAll(async () => {
    // Закрывает приложение
    await app.close();
    // Разрывает соединение с БД
    await prisma.$disconnect();
  });

  it('should get boiler part one', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/boiler-parts/by-id/cmj2lxzze0000v4ovh6xxllet')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        boilerManufacturer: expect.any(String),
        partsManufacturer: expect.any(String),
        venderCode: expect.any(String),
        images: expect.any(Array),
        inStock: expect.any(Number),
        bestseller: expect.any(Boolean),
        newBoilerPart: expect.any(Boolean),
        popularity: expect.any(Number),
        compatibility: expect.any(String),
      }),
    );
  });
  it('should get boiler part bestsellers', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/boiler-parts/bestsellers')
      .set('Cookie', login.headers['set-cookie']);

    const responseBody = response.body as PaginatedAndFilterResponse;
    expect(responseBody.data).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          boilerManufacturer: expect.any(String),
          partsManufacturer: expect.any(String),
          venderCode: expect.any(String),
          images: expect.any(Array),
          inStock: expect.any(Number),
          bestseller: true,
          newBoilerPart: expect.any(Boolean),
          popularity: expect.any(Number),
          compatibility: expect.any(String),
        },
      ]),
    );
  });
  it('should get boiler part new', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/boiler-parts/new')
      .set('Cookie', login.headers['set-cookie']);

    const responseBody = response.body as GetBestsellersResponse;

    expect(responseBody.data).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          boilerManufacturer: expect.any(String),
          partsManufacturer: expect.any(String),
          venderCode: expect.any(String),
          images: expect.any(Array),
          inStock: expect.any(Number),
          bestseller: expect.any(Boolean),
          newBoilerPart: true,
          popularity: expect.any(Number),
          compatibility: expect.any(String),
        },
      ]),
    );
  });
  it('should search boiler part by string', async () => {
    const searchTerm = 'a';
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });
    const response = await request(app.getHttpServer())
      .get('/boiler-parts/search')
      .query({ searchTerm })
      .set('Cookie', login.headers['set-cookie']);

    const responseBody = response.body as PaginatedAndFilterResponse;

    expect(response.status).toBe(200);

    expect(responseBody.data.length).toBeLessThanOrEqual(20);

    responseBody.data.forEach((element) =>
      expect(element.name.toLowerCase()).toContain(searchTerm),
    );

    expect(responseBody.data).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          boilerManufacturer: expect.any(String),
          partsManufacturer: expect.any(String),
          venderCode: expect.any(String),
          images: expect.any(Array),
          inStock: expect.any(Number),
          bestseller: expect.any(Boolean),
          newBoilerPart: expect.any(Boolean),
          popularity: expect.any(Number),
          compatibility: expect.any(String),
        },
      ]),
    );
  });
  it('should search boiler part by name', async () => {
    const body = 'Strategist Conculco aranea.';

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/boiler-parts/name')
      .send({ body })
      .set('Cookie', login.headers['set-cookie']);

    const responseBody = response.body as FindByNameResponse;

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: 'Strategist Conculco aranea.',
        description: expect.any(String),
        price: expect.any(Number),
        boilerManufacturer: expect.any(String),
        partsManufacturer: expect.any(String),
        venderCode: expect.any(String),
        images: expect.any(Array),
        inStock: expect.any(Number),
        bestseller: expect.any(Boolean),
        newBoilerPart: expect.any(Boolean),
        popularity: expect.any(Number),
        compatibility: expect.any(String),
      }),
    );
  });
});
