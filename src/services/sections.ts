import SectionDao from "../dao/sections.js"
import type { TCreateSection, TUpdateSection } from "../types/sections.js";

export default class SectionService {
    private sectionDao = new SectionDao();

    async getAllSection() {
        return this.sectionDao.getAll();
    }

    async getSection(id: number) {
        return this.sectionDao.getById(id);
    }

    async setSection(data: TCreateSection) {
        return this.sectionDao.create(data);
    }

    async updateSection(id: number, data: TUpdateSection) {
        return this.sectionDao.update(id, data);
    }

    async deleteSection(id: number) {
        return this.sectionDao.delete(id);
    }
}