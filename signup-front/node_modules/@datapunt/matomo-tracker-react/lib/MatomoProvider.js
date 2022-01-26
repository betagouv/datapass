"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var MatomoContext_1 = __importDefault(require("./MatomoContext"));
var MatomoProvider = function (_a) {
    var children = _a.children, value = _a.value;
    var Context = MatomoContext_1.default;
    return react_1.default.createElement(Context.Provider, { value: value }, children);
};
exports.default = MatomoProvider;
//# sourceMappingURL=MatomoProvider.js.map