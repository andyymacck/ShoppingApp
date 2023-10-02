CREATE SEQUENCE IF NOT EXISTS cart_cart_id_seq;
CREATE SEQUENCE IF NOT EXISTS clothes_product_id_seq;
CREATE SEQUENCE IF NOT EXISTS orders_order_id_seq;
CREATE SEQUENCE IF NOT EXISTS order_items_order_item_id_seq;

CREATE TABLE IF NOT EXISTS public."Category"
(
    "Category_ID" integer NOT NULL,
    "Category_name" text COLLATE pg_catalog."default" NOT NULL,
    "Category_description" text COLLATE pg_catalog."default",
    CONSTRAINT "Category_pkey" PRIMARY KEY ("Category_ID")
);

CREATE TABLE IF NOT EXISTS public.clothes
(
    product_id integer NOT NULL DEFAULT nextval('clothes_product_id_seq'::regclass),
    category_id integer,
    product_name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    price numeric(10,2) NOT NULL,
    stock_quantity integer NOT NULL,
    size text COLLATE pg_catalog."default",
    color text COLLATE pg_catalog."default",
    image_url text COLLATE pg_catalog."default",
    sex text COLLATE pg_catalog."default",
    CONSTRAINT clothes_pkey PRIMARY KEY (product_id),
    CONSTRAINT clothes_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public."Category" ("Category_ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.cart
(
    cart_id integer NOT NULL DEFAULT nextval('cart_cart_id_seq'::regclass),
    user_id text COLLATE pg_catalog."default",
    product_id integer,
    quantity integer NOT NULL,
    CONSTRAINT cart_pkey PRIMARY KEY (cart_id),
    CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id)
        REFERENCES public.clothes (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."AspNetUsers" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.orders
(
    order_id integer NOT NULL DEFAULT nextval('orders_order_id_seq'::regclass),
    user_id text COLLATE pg_catalog."default",
    order_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price numeric(10,2) NOT NULL,
    masked_cc_info text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."AspNetUsers" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.order_items
(
    order_item_id integer NOT NULL DEFAULT nextval('order_items_order_item_id_seq'::regclass),
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.orders (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id)
        REFERENCES public.clothes (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

INSERT INTO public."Category" ("Category_ID", "Category_name", "Category_description")
SELECT 1, 'Pants', 'Pants'
WHERE NOT EXISTS (SELECT 1 FROM public."Category" WHERE "Category_ID" = 1);

INSERT INTO public."Category" ("Category_ID", "Category_name", "Category_description")
SELECT 2, 'Shirts', 'Shirts'
WHERE NOT EXISTS (SELECT 1 FROM public."Category" WHERE "Category_ID" = 2);
