import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Indica la ruta a tu aplicación Next.js
  dir: './',
})

// Configuración personalizada de Jest
/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Asegúrate de que este archivo exista
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Maneja alias de importación (si usas @/ en tu proyecto)
    '^@/(.*)$': '<rootDir>/$1',
  
  },
}

export default createJestConfig(config)
