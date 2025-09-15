import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SquareConverter } from '../src/square-converter.js'

// Mock DOM elements
const mockInput = {
    value: '144',
    addEventListener: vi.fn(),
    focus: vi.fn(),
    classList: {
        add: vi.fn(),
        remove: vi.fn()
    },
    closest: vi.fn(() => ({
        querySelector: vi.fn(),
        appendChild: vi.fn()
    }))
}

const mockResultMain = {
    textContent: '0 ft²',
    style: { color: '' }
}

const mockResultDetail = {
    textContent: 'Enter square inches above to convert',
    style: { color: '' }
}

// Mock document
global.document = {
    getElementById: vi.fn((id) => {
        switch (id) {
            case 'square-inches': return mockInput
            case 'result-main': return mockResultMain
            case 'result-detail': return mockResultDetail
            default: return null
        }
    }),
    querySelectorAll: vi.fn(() => []),
    addEventListener: vi.fn()
}

describe('SquareConverter', () => {
    let converter

    beforeEach(() => {
        vi.clearAllMocks()
        converter = new SquareConverter()
    })

    describe('parseInput', () => {
        it('should parse whole numbers', () => {
            const result = converter.parseInput('144')
            expect(result).toBe(144)
        })

        it('should parse decimals', () => {
            const result = converter.parseInput('144.5')
            expect(result).toBe(144.5)
        })

        it('should parse mixed fractions', () => {
            const result = converter.parseInput('144 1/2')
            expect(result).toBe(144.5)
        })

        it('should parse simple fractions', () => {
            const result = converter.parseInput('289/2')
            expect(result).toBe(144.5)
        })

        it('should return null for invalid input', () => {
            const result = converter.parseInput('invalid')
            expect(result).toBeNull()
        })

        it('should handle empty input', () => {
            const result = converter.parseInput('')
            expect(result).toBeNull()
        })
    })

    describe('convert', () => {
        beforeEach(() => {
            mockInput.value = '144'
        })

        it('should convert square inches to square feet', () => {
            converter.convert()
            expect(mockResultMain.textContent).toBe('1 ft²')
            expect(mockResultDetail.textContent).toBe('1.000000 square feet')
        })

        it('should handle decimal results', () => {
            mockInput.value = '288'
            converter.convert()
            expect(mockResultMain.textContent).toBe('2.0000 ft²')
        })

        it('should show error for invalid input', () => {
            mockInput.value = 'invalid'
            converter.convert()
            expect(mockResultMain.textContent).toBe('Error')
        })

        it('should show error for negative input', () => {
            mockInput.value = '-144'
            converter.convert()
            expect(mockResultMain.textContent).toBe('Error')
        })

        it('should show error for empty input', () => {
            mockInput.value = ''
            converter.convert()
            expect(mockResultMain.textContent).toBe('Error')
        })
    })

    describe('clear', () => {
        it('should clear input and reset results', () => {
            converter.clear()
            expect(mockInput.value).toBe('')
            expect(mockResultMain.textContent).toBe('0 ft²')
            expect(mockResultDetail.textContent).toBe('Enter square inches above to convert')
        })
    })
})
