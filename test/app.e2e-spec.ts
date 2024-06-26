import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { RootModule } from "./../src/root/root.module";

describe("AppController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [RootModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	// it('/ (GET)', () => {
	//   return request(app.getHttpServer())
	//     .get('/')
	//     .expect(200)
	//     .expect()
	// });
});
