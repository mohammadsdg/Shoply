
export interface IIndexRow {
    Table: string,
    Non_unique: number,
    Key_name: string,
    Seq_in_index: number,
    Column_name: string,
    Collation: string,
    Cardinality: number,
    Sub_part: null,
    Packed: null,
    Null: string,
    Index_type: string,
    Comment: string,
    Index_comment: string,
    Ignored: string
}

export interface IForeignKeyRow { 
    CONSTRAINT_NAME: string
}