# Rubix Store API

## Documentation 🧾

### Sign up

```
POST /sign-up
```

#### Expected body

```jsx
{
  name: String, at least 3 characters,
  email: String, at least 5 characters, must be a valid email,
  password: String, at least 8 characters, does not differentiate lower and upper cases,
  cpf: String, exactly 11 characters,
  phone: String, exactly 11 characters
}
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters
- 409: This e-mail is already registered
- 201: Account created
```

</br>

### Sign in

```
POST /sign-in
```

#### Expected body

```jsx
{
  email: String, at least 5 characters, must be a valid email,
  password: String, at least 8 characters, does not differentiate lower and upper cases,
}
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters
- 401: Email/password invalid
- 200: Success
```

</br>

### Products

```
GET /products
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 200: Success
```

#### Accepted querys

```jsx
{
  search: anything,
  order: price or -price
}
```

</br>

### Especific product

```
GET /products/:productId
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 200: Success
```

</br>

### Get the user cart

```
GET /cart
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 401: Your JWT is invalid
- 200: Success
```

</br>

### Register a product in the user cart

```
POST /cart
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Expected body

```jsx
{
  productId: String, must be a valid product id,
  productQty: String, from 1 to the total products,
}
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters
- 401: Your JWT is invalid
- 200: Success
```

</br>

## How to run in your machine 🖥️

```
git clone YOUR REPO LINK
```

```
cd YOUR REPO
```

```
npm i --force
```

Create a .env.dev file and fill it using your environment variables following <a href="YOUR .ENV.EXAMPLE LINK ON GITHUB">this example</a>

### In your terminal

```
sudo su postgres
```

```
psql
```

```
CREATE DATABASE YOUR DATABASE NAME
```

```
\c YOUR DATABASE NAME
```

Copy everything in the <a href="YOUR DUMP.SQL LINK ON GITHUB">dump.sql</a> file and paste on the terminal</br>
You can not exit the postgres admin, and run

```
npm run dev
```

</br>

## How to run the tests in your machine 🖥️

Create a .env.test file and fill it using your environment variables following <a href="YOUR .ENV.EXAMPLE LINK ON GITHUB">this example</a>

### In your terminal

```
sudo su postgres
```

```
psql
```

```
CREATE DATABASE YOUR DATABASE NAME_test;
```

```
\c YOUR DATABASE NAME_test
```

Copy everything in the <a href="YOUR DUMP.SQL LINK ON GITHUB">dump.sql</a> file and paste on the terminal</br>

You can not exit the postgres admin, and run

```
npm run test
```

</br>
  
  
## Deployment 🚀

<p align="center"><a  href="YOUR DEPLOYMENT LINK">You can check the server running on heroku here!</a></p>

</br>

### Contact

<div align="center">
  
  [![Gmail Badge](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:YOUR GMAIL)
  [![Linkedin Badge](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](YOUR LINKEDIN ACCOUNT)
  
</div>
