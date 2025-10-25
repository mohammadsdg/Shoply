import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('users');
  if (!exists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('ID').primary();
  
      table.string('username', 50).notNullable().unique();
      table.text('password').notNullable();
  
      table
        .enum('role', ['super-admin', 'shop-admin', 'user'], {
          useNative: true,
          enumName: 'role_enum'
        })
        .defaultTo('user');
  
      table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  
      table.integer('status').defaultTo(10);
    });
  } else {
    console.log('users table exists')
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
