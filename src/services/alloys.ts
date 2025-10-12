import AlloysDao from "../dao/alloys.js";
import type { IAlloyData, TCreateAlloyInput, TUpdateAlloyInput } from "../types/alloys.ts";

export default class AlloyService {
    private dao = new AlloysDao();

    getAllAlloys(): Promise<IAlloyData[]> {
        return this.dao.getAll()
    }

    getAlloy(id: number) {
        return this.dao.getById(id);
    }

    setAlloy(data: TCreateAlloyInput) {
        return this.dao.create(data);
    }

    updateAlloy(id: number, data: TUpdateAlloyInput) {
        return this.dao.update(id, data)
    }

    deleteAlloy(id: number) {
        return this.dao.delete(id);
    }
}