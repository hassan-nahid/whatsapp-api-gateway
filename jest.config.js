"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    transformIgnorePatterns: [
        'node_modules/(?!(p-queue|p-limit|yocto-queue|eventemitter3)/)',
    ],
};
exports.default = config;
