import SectionService from "../services/sections.js";
export default class SectionsController {
    sectionService;
    constructor(sectionService) {
        this.sectionService = sectionService;
    }
    getAllSections = async (_, res) => {
        try {
            const result = await this.sectionService.getAllSection();
            return res.status(200).json({
                success: true,
                body: result,
                message: "All sections fetched successfully"
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: error.message
                });
            }
            else if (error && typeof error === 'object' && 'message' in error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: error.message
                });
            }
        }
    };
    getSection = async (req, res) => {
        const { id } = req.params;
        const sectionId = Number(id);
        if (!id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        try {
            const result = await this.sectionService.getSection(sectionId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `Section ${id} fetched successfully`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: `No section found with this ID`
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: error.message
                });
            }
        }
    };
    setSection = async (req, res) => {
        const { name, param_one, param_two, param_three } = req.body;
        const sectionData = {
            name,
            param_one,
            param_two,
            param_three
        };
        if (!name || !param_one) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        try {
            const result = await this.sectionService.setSection(sectionData);
            if (result) {
                return res.status(201).json({
                    success: true,
                    body: {
                        ID: result,
                        ...sectionData
                    },
                    message: "Section created successfully"
                });
            }
        }
        catch (error) {
            if (error instanceof Error)
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: error.message
                });
        }
    };
    updateSection = async (req, res) => {
        const { name, param_one, param_two, param_three } = req.body;
        const { id } = req.params;
        const sectionId = Number(id);
        const allowedFields = {
            name,
            param_one,
            param_two,
            param_three
        };
        if (!id) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        try {
            const result = await this.sectionService.updateSection(sectionId, allowedFields);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: {
                        ID: result,
                        ...allowedFields
                    },
                    message: `section ${result} updated successfully`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No Section found"
                });
            }
        }
        catch (error) {
            if (error instanceof Error)
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: error.message
                });
        }
    };
    deleteSection = async (req, res) => {
        const { id } = req.params;
        const sectionId = Number(id);
        try {
            const result = await this.sectionService.deleteSection(sectionId);
            if (result) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `Section ${id} deleted`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No section found"
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
    };
}
//# sourceMappingURL=sections.js.map