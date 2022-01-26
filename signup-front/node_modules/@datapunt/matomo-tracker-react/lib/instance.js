"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var matomo_tracker_js_1 = __importDefault(require("@datapunt/matomo-tracker-js"));
function createInstance(params) {
    return new matomo_tracker_js_1.default(params);
}
exports.default = createInstance;
//# sourceMappingURL=instance.js.map