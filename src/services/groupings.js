import GroupingDao from "../dao/groupings.js";
export default class GroupingService {
    groupingDao = new GroupingDao();
    async getAllGroupings() {
        return this.groupingDao.getAll();
    }
    async getGrouping(id) {
        return this.groupingDao.getById(id);
    }
    async setGrouping(data) {
        return this.groupingDao.create(data);
    }
    async updateGrouping(id, data) {
        return this.groupingDao.update(id, data);
    }
    async deleteGrouping(id) {
        return this.groupingDao.delete(id);
    }
}
//# sourceMappingURL=groupings.js.map