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

    table.timestamps(true, true)

    table.integer('status').defaultTo(10);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
