export default class {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Execute a database query
   */
  query(text, params) {
    return this.pool.query(text, params);
  }

  /**
   * Create all database tables
   */
  async createTables() {
    try {
      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          userId SERIAL PRIMARY KEY,
          username VARCHAR(128) UNIQUE NOT NULL,
          email VARCHAR(128) UNIQUE NOT NULL,
          password VARCHAR(128) NOT NULL,
          address TEXT,
          phone VARCHAR(20) UNIQUE,
          role VARCHAR(16) DEFAULT 'user',
          created_date TIMESTAMP DEFAULT NOW(),
          modified_date TIMESTAMP DEFAULT NOW()
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS orders (
          orderId SERIAL PRIMARY KEY,
          userId INTEGER NOT NULL,
          food VARCHAR(512) NOT NULL,
          quantity INTEGER,
          price INTEGER,
          address TEXT NOT NULL,
          email TEXT,
          phone VARCHAR(20),
          username VARCHAR(128),
          status VARCHAR(20),
          reason TEXT,
          created_date TIMESTAMP DEFAULT NOW(),
          modified_date TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (userId)
            REFERENCES users (userId)
            ON DELETE CASCADE
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS menu (
          foodId SERIAL PRIMARY KEY,
          name VARCHAR(128) UNIQUE NOT NULL,
          price INTEGER NOT NULL,
          genre VARCHAR(16) NOT NULL,
          img TEXT,
          description TEXT,
          isAvailable BOOLEAN DEFAULT TRUE,
          created_date TIMESTAMP DEFAULT NOW(),
          modified_date TIMESTAMP DEFAULT NOW()
        )
      `);

      await this.seedMenu();

      console.log('Database tables created successfully!');
    } catch (error) {
      console.error('Error creating database tables:', error);
      throw error;
    }
  }

  /**
   * Insert default menu items
   */
  async seedMenu() {
    const products = [
      ['STEAK DISH', 1000, 'meal', '../imgs/meals/steak2.jpg', 'Delicious steak dish filled with tenderness and marinated with the best sauce'],
      ['MOIN-MOIN DELI', 400, 'meal', '../imgs/meals/moinmoin.jpg', 'Deliciously prepared slices of moin-moin battered with egg & fish crumbs'],
      ['CHEESEBURGER', 500, 'snack', '../imgs/snacks/burger.jpg', 'Delicious Double-Cheese Burger.'],
      ['MEATPIE', 350, 'snack', '../imgs/snacks/meatpie.jpg', 'Hot tasty meatpie.'],
      ['DOUGHNUT', 100, 'snack', '../imgs/snacks/dougnut1.jpg', 'Doughnut of different flavours. The best there is.'],
      ['SCOTCH EGGS', 150, 'snack', '../imgs/snacks/scotchegg1.jpg', 'Egg in dough. As yummy as it is simple.'],
      ['CHOCO MOUSSE', 1000, 'drink', '../imgs/drinks/chocolate_mousse1.jpeg', 'Chocolate munched drink. For the chocolate lovers'],
      ['FRUITJUICE', 500, 'drink', '../imgs/drinks/fruitjuice.jpg', 'Chilled Fruit Juice.'],
      ['COCKTAILS', 1200, 'drink', '../imgs/drinks/cocktailspecial.jpg', 'Refreshing cocktails with different flavors.'],
      ['SOFT DRINKS', 150, 'drink', '../imgs/drinks/softdrink.jpg', 'Chilled soft drinks.'],
      ['SPECIAL VEGGIE RICE', 1500, 'combo', '../imgs/combo/delicacy.jpg', 'Delicious rice made specially with vegetarians in mind.'],
      ['COMBO-LICIOUS BURGER', 2000, 'combo', '../imgs/combo/burger-fries-drink.png', 'Delicious Burger immersed with chips and a drink.'],
      ['WHOLE CHICKEN PAELLA', 5000, 'combo', '../imgs/combo/chicken3.jpg', 'Roasted Spicy Chicken Paella garnished with rice, seafood, curry and herbs.'],
    ];

    const query = `
      INSERT INTO menu (
        name,
        price,
        genre,
        img,
        description,
        isAvailable,
        created_date,
        modified_date
      )
      VALUES ($1, $2, $3, $4, $5, TRUE, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
    `;

    for (const product of products) {
      await this.query(query, product);
    }

    console.log(`${products.length} default menu items checked.`);
  }

  /**
   * Delete all rows from a table
   */
  async deleteRows(tableName) {
    try {
      await this.query(`DELETE FROM ${tableName}`);
      console.log(`Deleted all rows from ${tableName}`);
    } catch (error) {
      console.error(`Error deleting rows from ${tableName}:`, error);
      throw error;
    }
  }
}