import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from '../src/common/interceptors/response.interceptor';

describe('Full Stack CMS (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health (GET /health)', () => {
    it('should return 200 when healthy', () => {
      return request(app.getHttpServer()).get('/health').expect(200);
    });
  });

  describe('Auth (POST /auth/login)', () => {
    it('should login admin user and return token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'changeme123' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      token = res.body.data.accessToken;
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'wrong' })
        .expect(200);

      expect(res.body.data.message).toBeDefined();
    });
  });

  describe('Users (GET /users)', () => {
    it('should list users with token', async () => {
      const res = await request(app.getHttpServer())
        .get('/users?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should reject without token', () => {
      return request(app.getHttpServer())
        .get('/users?page=1&limit=10')
        .expect(401);
    });
  });

  describe('Blogs (POST /blogs)', () => {
    let blogId: string;

    it('should create a blog post with token', async () => {
      const res = await request(app.getHttpServer())
        .post('/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slug: 'test-blog-post',
          status: 'published',
          translations: [
            { languageCode: 'en', title: 'Test', content: 'Test content' },
          ],
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('test-blog-post');
      blogId = res.body.data.id;
    });

    it('should retrieve created blog', async () => {
      const res = await request(app.getHttpServer())
        .get(`/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('test-blog-post');
    });

    it('should list blogs', async () => {
      const res = await request(app.getHttpServer())
        .get('/blogs?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should update blog', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ slug: 'updated-blog-post' })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should delete blog', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('Public Blogs (GET /blogs/public)', () => {
    it('should list published blogs without auth', async () => {
      const res = await request(app.getHttpServer())
        .get('/blogs/public?language=en&page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Roles (POST /roles)', () => {
    it('should create role with token', async () => {
      const res = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'TEST_ROLE', description: 'Test role' })
        .expect(201);

      expect(res.body.success).toBe(true);
    });
  });

  describe('Permissions (POST /permissions)', () => {
    it('should create permission with token', async () => {
      const res = await request(app.getHttpServer())
        .post('/permissions')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: 'test.read', description: 'Test read' })
        .expect(201);

      expect(res.body.success).toBe(true);
    });
  });
});
