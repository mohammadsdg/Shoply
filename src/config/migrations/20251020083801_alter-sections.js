export async function up(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM sections WHERE Key_name IN ('fk_sections_material_id')        
    `);
    const existingIndex = result[0];
    if (existingIndex.length === 0) {
        await knex.schema.alterTable('sections', table => {
            table
                .foreign('material_id')
                .references('ID')
                .inTable('materials')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .withKeyName('fk_sections_material_id');
        });
    }
}
export async function down(knex) {
    const result = await knex.raw(`
        SHOW INDEX FROM sections
        WHERE Key_name IN (
            'fk_sections_material_id'
        )
    `);
    const existingIndex = result[0];
    if (existingIndex.find(r => r.Key_name === 'fk_sections_material_id')) {
        await knex.schema.alterTable('sections', table => {
            table.dropForeign(['material_id'], 'fk_sections_material_id');
        });
    }
}
//# sourceMappingURL=20251020083801_alter-sections.js.map