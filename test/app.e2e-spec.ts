import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto/create-bookmark.dto';
import { EditBookmarkDto } from 'src/bookmark/dto/edit-bookmark.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3030);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3030');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'emmy@gmail.com',
      password: 'emma123',
    };
    describe('Signup', () => {
      it('Should throw error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw error if body empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        // .inspect();
      });
    });

    describe('Signin', () => {
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
  });

  describe('Edit User', () => {
    it('should edit user', () => {
      const dto: EditUserDto = {
        firstName: 'Emmanuel',
        email: 'Emma@gmail.com',
      };
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email);
    });
  });
});

describe('Bookmarks', () => {
  describe('Get empty bookmarks', () => {
    it('should get bookmarks', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .inspect();
    });
  });

  describe('Create bookmark', () => {
    const dto: CreateBookmarkDto = {
      title: 'First Bookmark',
      link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
    }
    it('should create bookmark',() => {
      return pactum
      .spec()
      .post('/bookmarks')
      .withHeaders({
        Authorization: 'Bearer @S{userAt}'
      })
      .withBody(dto)
      .expectStatus(201)
      .stores('bookmarkId', 'id')
    } )
  });

  describe('Get bookmark', () => {
    it('get bookmarks',() => {
      return pactum
      .spec()
      .get('/bookmarks')
      .withHeaders({
        Authorization: 'Bearer @S{userAt}'
      })
      .expectStatus(200)
      .expectJsonLength(1)
    } )
  });

  describe('Get bookmark by id', () => {
    it('get bookmarks by id',() => {
      return pactum
      .spec()
      .get('/bookmarks/{id}')
      .withPathParams('id', '$S{bookmarkId}')
      .withHeaders({
        Authorization: 'Bearer @S{userAt}'
      })
      .expectStatus(200)
      .expectBodyContains('$S{bookmarkId}')
    } )
  });

  describe('Edit bookmark by id', () => {
    it('should edit bookmark by id',() => {
      const dto: EditBookmarkDto = {
        title: 'Kubernetes Course - Full Beginners Tutorial (containerize Your Aps!',
        description: 'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production'
      }
      return pactum
      .spec()
      .patch('/bookmarks/{id}')
      .withPathParams('id', '$S{bookmarkId}')
      .withHeaders({
        Authorization: 'Bearer @S{userAt}'
      })
      .withBody(dto)
      .expectStatus(200)
      .expectBodyContains(dto.title)
      .expectBodyContains(dto.description)
    } )
  });

  describe('Delete bookmark by id', () => {
    it('should dekete bookmark by id',() => {
      return pactum
      .spec()
      .delete('/bookmarks/{id}')
      .withPathParams('id', '$S{bookmarkId}')
      .withHeaders({
        Authorization: 'Bearer @S{userAt}'
      })
      .expectStatus(204)
    } );

    it('Should get empty bookmark', () => {
      return pactum
      .spec()
      .get('/bookmarks')
      .withHeaders({
        Authorization: 'Bearer, $S{userAt}',
      })
      .expectStatus(200)
      .expectJsonLength(0)
    })
  });
});
