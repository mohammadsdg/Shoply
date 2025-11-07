export async function up(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM alloys
        WHERE Key_name IN ('fk_alloys_material_id');
    `);
    const existingIndex = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('alloys', table => {
            table
                .foreign('material_id')
                .references('ID')
                .inTable('materials')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_alloys_material_id');
        });
    }
}
export async function down(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM alloys
        WHERE Key_name IN (
            'fk_alloys_material_id'
        );
    `);
    const existingIndex = result[0];
    if (existingIndex.find(r => r.Key_name === 'fk_alloys_material_id')) {
        await knex.schema.alterTable('alloys', table => {
            table.dropForeign(['material_id'], 'fk_alloys_material_id');
        });
    }
}
//# sourceMappingURL=20251020083951_alter-alloys.js.map