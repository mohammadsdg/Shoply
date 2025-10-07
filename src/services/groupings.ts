import GroupingDao from "../dao/groupings.ts"
import type { TCreateGrouping, TUpdateGrouping } from "../types/groupings.ts";

export default class GroupingService {
    private groupingDao = new GroupingDao();
    async getAllGroupings() {
        return this.groupingDao.getAll();
    }

    async getGrouping(id: number) {
        return this.groupingDao.getById(id)
    }

    async setGrouping(data: TCreateGrouping) {
        return this.groupingDao.create(data);
    }

    async updateGrouping(id: number, data: TUpdateGrouping) {
        return this.groupingDao.update(id, data)
    }

    async deleteGrouping(id: number) {
        return this.groupingDao.delete(id);
    }
}