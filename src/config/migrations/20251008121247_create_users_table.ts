import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('ID').primary();

    table.string('username', 45).notNullable().unique();
    table.string('password', 255).notNullable();

    table
      .enum('role', ['super-admin', 'shop-admin', 'user'], {
        useNative: true,
        enumName: 'role_enum'
      })
      .defaultTo('user');

    // Foreign key to shops
    table.integer('shop_id').unsigned().nullable(); // must match shops.ID type
    table
      .foreign('shop_id')
      .references('ID')
      .inTable('shops')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.timestamps(true, true)

    table.integer('status').defaultTo(10);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
