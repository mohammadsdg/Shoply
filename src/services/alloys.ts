import type { RowDataPacket } from "mysql2";
import AlloysDao from "../dao/alloys.ts";
import type { ISetAlloyParams } from "../types/alloys.ts";

export default class AlloyService {
    private dao = new AlloysDao();

    getAllAlloys(): Promise<RowDataPacket[]> {
        return this.dao.getAll()
    }

    getAlloy(id: number) {
        return this.dao.getById(id);
    }

    setAlloy(data: ISetAlloyParams) {
        return this.dao.create(data);
    }

    updateAlloy(id: number, data: ISetAlloyParams) {
        return this.dao.update(id, data)
    }

    deleteAlloy(id: number) {
        return this.dao.delete(id);
    }
}