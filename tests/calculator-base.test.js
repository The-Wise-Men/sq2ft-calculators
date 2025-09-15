import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CalculatorBase } from '../calculator-base.js'

// Mock DOM
const mockInput = {
    value: '10',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn()
    },
    closest: vi.fn(() => ({
        querySelector: vi.fn(),
        appendChild: vi.fn()
    }))
}

const mockButton = {
    disabled: false,
    innerHTML: 'Calculate',
    addEventListener: vi.fn()
}

// Mock document methods
global.document = {
    getElementById: vi.fn((id) => {
        if (id === 'calculate-btn') return mockButton
        if (id === 'clear-btn') return mockButton
        return mockInput
    }),
    querySelectorAll: vi.fn(() => [mockInput]),
    querySelector: vi.fn(() => mockInput),
    addEventListener: vi.fn()
}

describe('CalculatorBase', () => {
    let calculator

    beforeEach(() => {
        vi.clearAllMocks()
        calculator = new CalculatorBase('test-calculator')
    })

    describe('constructor', () => {
        it('should initialize with correct type and options', () => {
            expect(calculator.type).toBe('test-calculator')
            expect(calculator.options.enableValidation).toBe(true)
            expect(calculator.options.enablePersistence).toBe(true)
            expect(calculator.options.enableLoadingStates).toBe(true)
        })

        it('should set up common elements', () => {
            expect(calculator.calculateBtn).toBe(mockButton)
            expect(calculator.clearBtn).toBe(mockButton)
        })
    })

    describe('getInputValue', () => {
        it('should return parsed float value', () => {
            const result = calculator.getInputValue('test-input', 5)
            expect(result).toBe(10)
        })

        it('should return default value when input is empty', () => {
            mockInput.value = ''
            const result = calculator.getInputValue('test-input', 5)
            expect(result).toBe(5)
        })
    })

    describe('setResultValue', () => {
        beforeEach(() => {
            const mockElement = { textContent: '' }
            global.document.getElementById = vi.fn(() => mockElement)
        })

        it('should format currency correctly', () => {
            calculator.setResultValue('test-result', 123.45, 'currency')
            expect(global.document.getElementById).toHaveBeenCalledWith('test-result')
        })

        it('should format percentage correctly', () => {
            calculator.setResultValue('test-result', 12.5, 'percentage')
            expect(global.document.getElementById).toHaveBeenCalledWith('test-result')
        })

        it('should format integer correctly', () => {
            calculator.setResultValue('test-result', 123.45, 'integer')
            expect(global.document.getElementById).toHaveBeenCalledWith('test-result')
        })
    })

    describe('showLoading', () => {
        it('should set loading state', () => {
            calculator.showLoading()
            expect(calculator.isLoading).toBe(true)
            expect(mockButton.disabled).toBe(true)
        })
    })

    describe('hideLoading', () => {
        it('should clear loading state', () => {
            calculator.hideLoading()
            expect(calculator.isLoading).toBe(false)
            expect(mockButton.disabled).toBe(false)
        })
    })

    describe('data persistence', () => {
        beforeEach(() => {
            global.localStorage = {
                getItem: vi.fn(),
                setItem: vi.fn(),
                removeItem: vi.fn()
            }
        })

        it('should save data to localStorage', () => {
            calculator.saveData()
            expect(global.localStorage.setItem).toHaveBeenCalledWith(
                'calculator_test-calculator',
                expect.any(String)
            )
        })

        it('should load data from localStorage', () => {
            global.localStorage.getItem.mockReturnValue('{"test": "value"}')
            calculator.loadSavedData()
            expect(global.localStorage.getItem).toHaveBeenCalledWith('calculator_test-calculator')
        })

        it('should clear saved data', () => {
            calculator.clearSavedData()
            expect(global.localStorage.removeItem).toHaveBeenCalledWith('calculator_test-calculator')
        })
    })
})
