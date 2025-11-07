import SectionDao from "../dao/sections.js";
export default class SectionService {
    sectionDao = new SectionDao();
    async getAllSection() {
        return this.sectionDao.getAll();
    }
    async getSection(id) {
        return this.sectionDao.getById(id);
    }
    async setSection(data) {
        return this.sectionDao.create(data);
    }
    async updateSection(id, data) {
        return this.sectionDao.update(id, data);
    }
    async deleteSection(id) {
        return this.sectionDao.delete(id);
    }
}
//# sourceMappingURL=sections.js.map