CREATE TABLE "users" (
    "id" serial NOT NULL,
    "name" varchar(255) NOT NULL,
    "cpf" varchar(11) NOT NULL UNIQUE,
    "email" varchar(100) NOT NULL UNIQUE,
    "password" varchar(70) NOT NULL UNIQUE,
    "phone" varchar(12) NOT NULL UNIQUE,
    CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "addresses" (
    "id" serial NOT NULL UNIQUE,
    "street" varchar(255) NOT NULL UNIQUE,
    "user_id" integer NOT NULL,
    "zip_code" varchar(8) NOT NULL,
    "number" integer NOT NULL,
    "complement" varchar(50) NOT NULL,
    CONSTRAINT "addresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
    "id" serial NOT NULL,
    "name" varchar(255) NOT NULL,
    "category_id" integer NOT NULL,
    "value" integer NOT NULL,
    "description" varchar(1024) NOT NULL,
    "total_qty" integer NOT NULL,
    "weight" integer NOT NULL,
    "brand_id" integer NOT NULL,
    "model" varchar(255) NOT NULL,
    "size" varchar(255) NOT NULL,
    "color" varchar(255) NOT NULL,
    CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "categories" (
    "id" serial NOT NULL,
    "name" varchar(255) NOT NULL,
    CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products_images" (
    "id" serial NOT NULL,
    "product_id" serial NOT NULL,
    "url" varchar(255) NOT NULL,
    CONSTRAINT "products_images_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
    "id" serial NOT NULL,
    "user_id" integer NOT NULL,
    "token" varchar(36) NOT NULL,
    CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "recovery_password" (
    "id" serial NOT NULL,
    "user_id" integer NOT NULL,
    "token" varchar(36) NOT NULL,
    "creation_date" TIMESTAMP NOT NULL DEFAULT 'now ()',
    CONSTRAINT "recovery_password_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "purchases" (
    "id" serial NOT NULL,
    "user_id" integer NOT NULL,
    "total_value" integer NOT NULL,
    CONSTRAINT "purchases_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "bought_products" (
    "id" serial NOT NULL,
    "purchase_id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "qty" integer NOT NULL,
    CONSTRAINT "bought_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products_brands" (
    "id" serial NOT NULL UNIQUE,
    "name" varchar(255) NOT NULL UNIQUE,
    CONSTRAINT "products_brands_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "product_contains" (
    "id" serial NOT NULL,
    "product_id" integer NOT NULL,
    "item" varchar(255) NOT NULL,
    CONSTRAINT "product_contains_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("category_id") REFERENCES "categories"("id");
ALTER TABLE "products" ADD CONSTRAINT "products_fk1" FOREIGN KEY ("brand_id") REFERENCES "products_brands"("id");


ALTER TABLE "products_images" ADD CONSTRAINT "products_images_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "recovery_password" ADD CONSTRAINT "recovery_password_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "purchases" ADD CONSTRAINT "purchases_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "bought_products" ADD CONSTRAINT "bought_products_fk0" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id");
ALTER TABLE "bought_products" ADD CONSTRAINT "bought_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");


ALTER TABLE "product_contains" ADD CONSTRAINT "product_contains_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");