import bcrypt from "bcryptjs";
export default class UsersController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    // Get All the users
    getAllUsers = async (req, res) => {
        try {
            const result = await this.userService.getAllUsers();
            res.status(200).json({
                success: true,
                body: result,
                message: "All users fetched successfully"
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                body: null,
                message: "Internal server error"
            });
        }
    };
    // Login with username and password
    getUser = async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const userData = {
            username
        };
        try {
            const result = await this.userService.getUser(userData);
            if (result?.username && (await bcrypt.compare(password, result.password))) {
                return res.status(200).json({
                    success: true,
                    body: result,
                    message: `user ${result.ID} fetched successfully`
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    body: null,
                    message: "No user found with this username and password"
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                body: null,
                message: "Internal server error"
            });
        }
    };
    // Register user with username and password
    setUser = async (req, res) => {
        let { username, password, role } = req.body;
        // Setting default role 
        role = role || "user";
        // Check if user and password has been sent
        if (username === undefined || username === null ||
            password === undefined || password === null) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const userData = {
            username,
            password: hashedPass,
            role
        };
        try {
            // Get user with username checking if another username exists with this name
            const selectedUser = await this.userService.getUser(userData);
            if (selectedUser?.username) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: "Conflict, There is another username like this"
                });
            }
            const createdUser = await this.userService.setUser(userData);
            if (createdUser) {
                return res.status(201).json({
                    success: true,
                    body: createdUser,
                    message: "username created successfully"
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                body: null,
                message: "Internal server error"
            });
        }
    };
    // Register user through super-admin with username, password and role
    setRole = async (req, res) => {
        let { username, password, role } = req.body;
        role = role || 'user';
        if (username === undefined || username === null ||
            password === undefined || password === null) {
            return res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const userData = {
            username,
            password: hashedPass,
            role
        };
        try {
            // Get user with username checking if another username exists with this name
            const selectedUser = await this.userService.getUser(userData);
            if (selectedUser?.username) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: "Conflict, There is another username like this"
                });
            }
            // Create user with username, password and role
            const createdUser = await this.userService.setUser(userData);
            if (createdUser) {
                return res.status(201).json({
                    success: true,
                    body: createdUser,
                    message: "username created successfully"
                });
            }
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            }
            return res.status(500).json({
                success: false,
                body: null,
                message: "Unknown error"
            });
        }
    };
    // Update user with ID
    updateUser = async (req, res) => {
        const { username, password, role } = req.body;
        const { id } = req.params;
        if (!username || !password || !role) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            });
        }
        const userData = {
            username,
            password,
            role
        };
        try {
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            }
            else {
                return res.status(500).json({
                    success: false,
                    body: null,
                    message: "Unknown message"
                });
            }
        }
    };
    // Delete user with ID
    deleteUser = async (req, res) => {
    };
}
//# sourceMappingURL=users.js.map