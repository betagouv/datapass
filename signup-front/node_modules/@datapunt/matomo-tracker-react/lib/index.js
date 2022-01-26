"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMatomo = exports.createInstance = exports.MatomoProvider = exports.MatomoContext = void 0;
var MatomoContext_1 = require("./MatomoContext");
Object.defineProperty(exports, "MatomoContext", { enumerable: true, get: function () { return __importDefault(MatomoContext_1).default; } });
var MatomoProvider_1 = require("./MatomoProvider");
Object.defineProperty(exports, "MatomoProvider", { enumerable: true, get: function () { return __importDefault(MatomoProvider_1).default; } });
var instance_1 = require("./instance");
Object.defineProperty(exports, "createInstance", { enumerable: true, get: function () { return __importDefault(instance_1).default; } });
var useMatomo_1 = require("./useMatomo");
Object.defineProperty(exports, "useMatomo", { enumerable: true, get: function () { return __importDefault(useMatomo_1).default; } });
//# sourceMappingURL=index.js.map