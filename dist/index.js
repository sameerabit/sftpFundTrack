"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const sftpClient_1 = require("./sftpClient");
const dbService_1 = require("./dbService");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            "style-src": ["'self'", "'unsafe-inline'"],
        },
    },
}));
app.use(express_1.default.json());
(0, sftpClient_1.mainLoop)().catch((err) => {
    console.log(err);
}).finally(() => dbService_1.prisma.$disconnect());
app.listen(3000, () => {
    console.log('✅ Server is running on port 3000');
    console.log('🌐 Open http://localhost:3000/graphql');
});
