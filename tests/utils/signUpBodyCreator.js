import faker from 'faker-br';

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

export {
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
};
