import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

const products = [
  {
    name: 'Steak dish',
    price: 1000,
    genre: 'meal',
    img: '../imgs/meals/steak2.jpg',
    description: 'Delicious steak dish filled with tenderness and marinated with the best sauce',
  },
  {
    name: 'Moin-moin deli',
    price: 400,
    genre: 'meal',
    img: '../imgs/meals/moinmoin.jpg',
    description: 'Deliciously prepared slices of moin-moin battered with egg & fish crumbs',
  },
  {
    name: 'CheeseBurger',
    price: 500,
    genre: 'snack',
    img: '../imgs/snacks/burger.jpg',
    description: 'Delicious Double-Cheese Burger.',
  },
  {
    name: 'Meatpie',
    price: 350,
    genre: 'snack',
    img: '../imgs/snacks/meatpie.jpg',
    description: 'Hot tasty meatpie.',
  },
  {
    name: 'Doughnut',
    price: 100,
    genre: 'snack',
    img: '../imgs/snacks/dougnut1.jpg',
    description: 'Doughnut of different flavours. The best there is.',
  },
  {
    name: 'Scotch Eggs',
    price: 150,
    genre: 'snack',
    img: '../imgs/snacks/scotchegg1.jpg',
    description: 'Egg in dough. As yummy as it is simple.',
  },
  {
    name: 'Choco Mousse',
    price: 1000,
    genre: 'drink',
    img: '../imgs/drinks/chocolate_mousse1.jpeg',
    description: 'Chocolate munched drink. For the chocolate lovers',
  },
  {
    name: 'FruitJuice',
    price: 500,
    genre: 'drink',
    img: '../imgs/drinks/fruitjuice.jpg',
    description: 'Chilled Fruit Juice.',
  },
  {
    name: 'Cocktails',
    price: 1200,
    genre: 'drink',
    img: '../imgs/drinks/cocktailspecial.jpg',
    description: 'Refreshing cocktails with different flavors.',
  },
  {
    name: 'Soft drinks',
    price: 150,
    genre: 'drink',
    img: '../imgs/drinks/softdrink.jpg',
    description: 'Chilled soft drinks.',
  },
  {
    name: 'Special Veggie Rice',
    price: 1500,
    genre: 'combo',
    img: '../imgs/combo/delicacy.jpg',
    description: 'Delicious rice made specially with vegetarians in mind.',
  },
  {
    name: 'Combo-licious Burger',
    price: 2000,
    genre: 'combo',
    img: '../imgs/combo/burger-fries-drink.png',
    description: 'Delicious Burger immersed with chips and a drink.',
  },
  {
    name: 'Whole Chicken Paella',
    price: 5000,
    genre: 'combo',
    img: '../imgs/combo/chicken3.jpg',
    description: 'Roasted Spicy Chicken Paella garnished with rice, seafood, curry and herbs.',
  },
];

async function seed() {
  try {
    for (const product of products) {
      await pool.query(
        `INSERT INTO menu
        (name, price, genre, img, description, isavailable, created_date, modified_date)
        VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
        ON CONFLICT (name) DO NOTHING`,
        [
          product.name.toUpperCase(),
          product.price,
          product.genre,
          product.img,
          product.description,
        ],
      );
    }

    console.log(`${products.length} produtos processados.`);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

seed();