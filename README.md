# Square Inches to Square Feet Converter

A simple Python GUI application for converting square inches to square feet with natural fraction support.

## Features

- **Natural Fraction Input**: Accepts various input formats:
  - Whole numbers: `144`
  - Decimals: `144.5`
  - Mixed fractions: `144 1/2`
  - Simple fractions: `1/2`, `289/2`
- **Precise Calculations**: Uses Python's `Fraction` class for exact arithmetic
- **Modern UI**: Clean, intuitive interface built with tkinter
- **Input Validation**: Comprehensive error handling and user feedback
- **Multiple Output Formats**: Shows both fractional and decimal results

## Requirements

- Python 3.6 or higher
- tkinter (included with Python standard library)

## Usage

1. Run the application:
   ```bash
   python square_converter.py
   ```

2. Enter square inches in any supported format:
   - `144` → 1 square foot
   - `144.5` → 1.003472 square feet
   - `144 1/2` → 1.003472 square feet
   - `289/2` → 1.003472 square feet

3. Click "Convert" or press Enter to see the result

## Examples

| Input | Square Feet (Fraction) | Square Feet (Decimal) |
|-------|------------------------|----------------------|
| 144 | 1 | 1.000000 |
| 72 | 1/2 | 0.500000 |
| 144.5 | 289/288 | 1.003472 |
| 144 1/2 | 289/288 | 1.003472 |
| 216 | 3/2 | 1.500000 |

## Conversion Formula

1 square foot = 144 square inches

The application uses exact fractional arithmetic to avoid floating-point precision errors.
