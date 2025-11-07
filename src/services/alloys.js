import AlloysDao from "../dao/alloys.js";
export default class AlloyService {
    dao = new AlloysDao();
    getAllAlloys() {
        return this.dao.getAll();
    }
    getAlloy(id) {
        return this.dao.getById(id);
    }
    setAlloy(data) {
        return this.dao.create(data);
    }
    updateAlloy(id, data) {
        return this.dao.update(id, data);
    }
    deleteAlloy(id) {
        return this.dao.delete(id);
    }
}
//# sourceMappingURL=alloys.js.map