const pool = require('../config/db');

async function createOrder(customerName, items) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `
      INSERT INTO orders (customer_name)
      VALUES ($1)
      RETURNING id, customer_name, created_at
      `,
      [customerName]
    );

    const order = orderResult.rows[0];

    const createdItems = [];

    for (const item of items) {
      const itemResult = await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_name,
          quantity
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          order_id,
          product_name,
          quantity
        `,
        [
          order.id,
          item.productName,
          item.quantity,
        ]
      );

      createdItems.push(itemResult.rows[0]);
    }

    await client.query('COMMIT');

    return {
      order,
      items: createdItems,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createOrder,
};