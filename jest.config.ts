import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    transformIgnorePatterns: [
        'node_modules/(?!(p-queue|p-limit|yocto-queue|eventemitter3)/)',
    ],
};

export default config;
