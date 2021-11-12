import faker from 'faker-br';
import bcrypt from 'bcrypt';
import connection from '../../src/database/database.js';

async function createUser() {
  const password = faker.internet.password(8);
  const hash = bcrypt.hashSync(password, 10);

  const newUser = await connection.query(
    `INSERT INTO users (name, email, password, cpf, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, password;`,
    [
      faker.name.findName(),
      faker.internet.email(),
      hash,
      faker.br.cpf(),
      faker.phone.phoneNumber('###########'),
    ],
  );
  newUser.rows[0].password = password;
  return newUser.rows[0];
}

async function createSession() {
  const { id: userId } = await createUser();

  const result = await connection.query(
    `INSERT INTO sessions 
    (user_id) VALUES ($1)
    RETURNING id;`,
    [userId],
  );
  return result.rows[0].id;
}

async function validUser() {
  const password = faker.internet.password(8);

  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    cpf: faker.br.cpf(),
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidName() {
  const password = faker.internet.password(8);

  const userData = {
    name: '',
    email: faker.internet.email(),
    password,
    cpf: faker.br.cpf(),
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidEmptyEmail() {
  const password = faker.internet.password(8);

  const userData = {
    name: faker.name.findName(),
    email: '',
    password,
    cpf: faker.br.cpf(),
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidEmail() {
  const password = faker.internet.password(8);

  const userData = {
    name: faker.name.findName(),
    email: faker.name.findName(),
    password,
    cpf: faker.br.cpf(),
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidEmptyPassword() {
  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: '',
    cpf: faker.br.cpf(),
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidPassword() {
  const password = faker.internet.password(1);

  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    cpf: faker.br.cpf(),
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidEmptyCpf() {
  const password = faker.internet.password(8);

  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    cpf: '',
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidCpf() {
  const password = faker.internet.password(8);

  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    cpf: faker.name.findName(),
    phone: faker.phone.phoneNumber('###########'),
  };

  return userData;
}

async function invalidEmptyPhone() {
  const password = faker.internet.password(8);

  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    cpf: faker.br.cpf(),
    phone: '',
  };

  return userData;
}

async function invalidPhone() {
  const password = faker.internet.password(8);

  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    cpf: faker.br.cpf(),
    phone: faker.phone.phoneNumber('#####'),
  };
  return userData;
}

async function createCategory() {
  const result = await connection.query(
    `INSERT INTO categories (name) VALUES ($1)
    RETURNING id;`,
    ['3x3x3'],
  );
  return Number(result.rows[0].id);
}

async function createBrand() {
  const result = await connection.query(
    `INSERT INTO products_brands (name) VALUES ($1)
    RETURNING id;`,
    ['Moyu'],
  );
  return Number(result.rows[0].id);
}

async function createProduct() {
  const result = await connection.query(
    `INSERT INTO products
    (name, category_id, value, description, total_qty, weight, brand_id, model, size, color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id;`,
    [
      faker.commerce.productName(),
      await createCategory(),
      faker.random.number({
        min: 1999,
        max: 300000,
      }),
      faker.lorem.paragraph(),
      faker.random.number({
        min: 20,
        max: 100,
      }),
      faker.random.number({
        min: 80,
        max: 500,
      }),
      await createBrand(),
      faker.commerce.department(),
      faker.commerce.productMaterial(),
      faker.commerce.color(),
    ],
  );

  const productId = result.rows[0].id;

  const contains = [
    { item: faker.lorem.word() },
    { item: faker.lorem.word() },
    { item: faker.lorem.word() },
  ];

  contains.forEach(async (content) => {
    await connection.query(
      `INSERT INTO product_contains
      (product_id, item) VALUES ($1, $2)`,
      [productId, content.item],
    );
  });

  const images = [
    { url: faker.image.imageUrl() },
    { url: faker.image.imageUrl() },
    { url: faker.image.imageUrl() },
    { url: faker.image.imageUrl() },
  ];

  images.forEach(async (image) => {
    await connection.query(
      `INSERT INTO products_images
      (product_id, url) VALUES ($1, $2)`,
      [productId, image.url],
    );
  });
  return productId;
}

export {
  createUser,
  validUser,
  invalidName,
  invalidEmail,
  invalidEmptyEmail,
  invalidPassword,
  invalidEmptyPassword,
  invalidCpf,
  invalidEmptyCpf,
  invalidPhone,
  invalidEmptyPhone,
  createProduct,
  createSession,
};
