import tkinter as tk
from tkinter import ttk, messagebox
import re
from fractions import Fraction

class SquareConverter:
    def __init__(self, root):
        self.root = root
        self.root.title("📐 Square Inches to Square Feet Converter")
        self.root.geometry("600x600")
        self.root.configure(bg='#f8f9fa')
        self.root.resizable(True, True)
        self.root.minsize(500, 500)

        # Configure modern style
        style = ttk.Style()
        style.theme_use('clam')

        # Define modern color scheme
        self.colors = {
            'primary': '#007bff',
            'secondary': '#6c757d',
            'success': '#28a745',
            'info': '#17a2b8',
            'warning': '#ffc107',
            'danger': '#dc3545',
            'light': '#f8f9fa',
            'dark': '#343a40',
            'white': '#ffffff',
            'gray_100': '#f8f9fa',
            'gray_200': '#e9ecef',
            'gray_300': '#dee2e6',
            'gray_400': '#ced4da',
            'gray_500': '#adb5bd',
            'gray_600': '#6c757d',
            'gray_700': '#495057',
            'gray_800': '#343a40',
            'gray_900': '#212529'
        }

        # Configure custom styles
        self.setup_styles()

        # Main container with shadow effect
        main_container = tk.Frame(root, bg=self.colors['gray_200'], relief='flat', bd=0)
        main_container.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

        # Main frame with white background
        main_frame = tk.Frame(main_container, bg=self.colors['white'], relief='flat', bd=0)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        # Header section
        header_frame = tk.Frame(main_frame, bg=self.colors['white'], height=80)
        header_frame.pack(fill=tk.X, padx=30, pady=(30, 20))
        header_frame.pack_propagate(False)

        # Title with icon
        title_frame = tk.Frame(header_frame, bg=self.colors['white'])
        title_frame.pack(expand=True)

        title_label = tk.Label(title_frame, text="📐", font=('Segoe UI Emoji', 24),
                              bg=self.colors['white'], fg=self.colors['primary'])
        title_label.pack(side=tk.LEFT, padx=(0, 10))

        title_text = tk.Label(title_frame, text="Square Inches to Square Feet",
                             font=('Segoe UI', 20, 'bold'), bg=self.colors['white'],
                             fg=self.colors['gray_800'])
        title_text.pack(side=tk.LEFT)

        subtitle = tk.Label(title_frame, text="Precise conversion with fraction support",
                           font=('Segoe UI', 11), bg=self.colors['white'],
                           fg=self.colors['gray_600'])
        subtitle.pack(side=tk.LEFT, padx=(10, 0))

        # Content area
        content_frame = tk.Frame(main_frame, bg=self.colors['white'])
        content_frame.pack(fill=tk.BOTH, expand=True, padx=30, pady=(0, 30))

        # Input section
        input_frame = tk.Frame(content_frame, bg=self.colors['white'])
        input_frame.pack(fill=tk.X, pady=(0, 25))

        # Input label
        input_label = tk.Label(input_frame, text="Square Inches",
                              font=('Segoe UI', 12, 'bold'), bg=self.colors['white'],
                              fg=self.colors['gray_700'])
        input_label.pack(anchor=tk.W, pady=(0, 8))

        # Input entry with modern styling (filleted/rounded appearance)
        entry_frame = tk.Frame(input_frame, bg=self.colors['gray_200'], relief='flat', bd=0)
        entry_frame.pack(fill=tk.X, pady=(0, 8))

        self.input_var = tk.StringVar()
        self.input_entry = tk.Entry(entry_frame, textvariable=self.input_var,
                                   font=('Segoe UI', 14), relief='flat', bd=0,
                                   bg=self.colors['gray_200'], fg=self.colors['gray_800'],
                                   insertbackground=self.colors['primary'])
        self.input_entry.pack(fill=tk.BOTH, expand=True, padx=15, pady=12)

        # Input help text
        help_text = "💡 Examples: 144 • 144.5 • 144 1/2 • 289/2"
        help_label = tk.Label(input_frame, text=help_text, font=('Segoe UI', 10),
                             bg=self.colors['white'], fg=self.colors['gray_500'])
        help_label.pack(anchor=tk.W)

        # Convert button
        convert_btn = tk.Button(input_frame, text="🔄 Convert", command=self.convert,
                               font=('Segoe UI', 12, 'bold'), bg=self.colors['primary'],
                               fg=self.colors['white'], relief='flat', bd=0,
                               padx=30, pady=12, cursor='hand2')
        convert_btn.pack(pady=(20, 0))

        # Add hover effects
        def on_convert_enter(e):
            convert_btn.configure(bg=self.colors['info'])
        def on_convert_leave(e):
            convert_btn.configure(bg=self.colors['primary'])
        convert_btn.bind('<Enter>', on_convert_enter)
        convert_btn.bind('<Leave>', on_convert_leave)

        # Output section
        output_frame = tk.Frame(content_frame, bg=self.colors['gray_100'], relief='flat', bd=0)
        output_frame.pack(fill=tk.X, pady=(0, 20))

        # Output header
        output_header = tk.Frame(output_frame, bg=self.colors['gray_100'])
        output_header.pack(fill=tk.X, padx=20, pady=(20, 10))

        output_title = tk.Label(output_header, text="Result",
                               font=('Segoe UI', 12, 'bold'), bg=self.colors['gray_100'],
                               fg=self.colors['gray_700'])
        output_title.pack(side=tk.LEFT)

        # Result display area - clean, borderless, centered
        result_display = tk.Frame(output_frame, bg=self.colors['white'], relief='flat', bd=0, height=120)
        result_display.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 20))
        # Ensure the frame grows with its children but has minimum height
        result_display.pack_propagate(False)

        # Container for centering content vertically and horizontally
        center_container = tk.Frame(result_display, bg=self.colors['white'])
        center_container.place(relx=0.5, rely=0.5, anchor='center')

        # Main result - large, centered
        self.result_var = tk.StringVar()
        self.result_var.set("0 ft²")  # Set initial value with superscript
        self.result_label = tk.Label(center_container, textvariable=self.result_var,
                                    font=('Segoe UI', 24, 'bold'), bg=self.colors['white'],
                                    fg=self.colors['gray_900'])
        self.result_label.pack(pady=(0, 8))

        # Detailed result - smaller, below main result
        self.detail_var = tk.StringVar()
        self.detail_var.set("Enter square inches above to convert")  # Set initial value
        self.detail_label = tk.Label(center_container, textvariable=self.detail_var,
                                    font=('Segoe UI', 10), bg=self.colors['white'],
                                    fg=self.colors['gray_600'], justify='center')
        self.detail_label.pack()

        # Action buttons
        button_frame = tk.Frame(output_frame, bg=self.colors['gray_100'])
        button_frame.pack(fill=tk.X, padx=20, pady=(0, 20))

        clear_btn = tk.Button(button_frame, text="🗑️ Clear", command=self.clear,
                             font=('Segoe UI', 10), bg=self.colors['gray_500'],
                             fg=self.colors['white'], relief='flat', bd=0,
                             padx=20, pady=8, cursor='hand2')
        clear_btn.pack(side=tk.RIGHT)

        # Add hover effects for clear button
        def on_clear_enter(e):
            clear_btn.configure(bg=self.colors['gray_600'])
        def on_clear_leave(e):
            clear_btn.configure(bg=self.colors['gray_500'])
        clear_btn.bind('<Enter>', on_clear_enter)
        clear_btn.bind('<Leave>', on_clear_leave)

        # Bind Enter key to convert
        self.input_entry.bind('<Return>', lambda e: self.convert())

        # Focus on input field
        self.input_entry.focus()

        # Configure grid weights
        root.columnconfigure(0, weight=1)
        root.rowconfigure(0, weight=1)

    def setup_styles(self):
        """Configure custom ttk styles for modern appearance"""
        style = ttk.Style()

        # Configure button styles
        style.configure('Modern.TButton',
                       font=('Segoe UI', 10),
                       padding=(10, 5))

        # Configure entry styles
        style.configure('Modern.TEntry',
                       font=('Segoe UI', 12),
                       padding=(10, 8))

        # Configure label frame styles
        style.configure('Modern.TLabelframe',
                       font=('Segoe UI', 10, 'bold'),
                       padding=(10, 10))

        style.configure('Modern.TLabelframe.Label',
                       font=('Segoe UI', 10, 'bold'))

    def parse_input(self, input_str):
        """Parse input string and return square inches as a Fraction"""
        input_str = input_str.strip()

        if not input_str:
            return None

        # Remove any extra spaces
        input_str = re.sub(r'\s+', ' ', input_str)

        # Pattern to match various formats:
        # - Whole numbers: 144
        # - Decimals: 144.5, 144.25
        # - Mixed fractions: 144 1/2, 144 3/4
        # - Simple fractions: 1/2, 3/4
        # - Improper fractions: 289/2

        # Try mixed number pattern first (e.g., "144 1/2")
        mixed_pattern = r'^(\d+(?:\.\d+)?)\s+(\d+)/(\d+)$'
        match = re.match(mixed_pattern, input_str)
        if match:
            whole_part = float(match.group(1))
            numerator = int(match.group(2))
            denominator = int(match.group(3))
            return Fraction(int(whole_part * denominator) + numerator, denominator)

        # Try simple fraction pattern (e.g., "1/2", "289/2")
        fraction_pattern = r'^(\d+)/(\d+)$'
        match = re.match(fraction_pattern, input_str)
        if match:
            numerator = int(match.group(1))
            denominator = int(match.group(2))
            return Fraction(numerator, denominator)

        # Try decimal pattern (e.g., "144.5", "144.25")
        decimal_pattern = r'^(\d+(?:\.\d+)?)$'
        match = re.match(decimal_pattern, input_str)
        if match:
            decimal_value = float(match.group(1))
            return Fraction(decimal_value).limit_denominator(1000000)

        return None

    def convert(self):
        """Convert square inches to square feet"""
        input_str = self.input_var.get()

        if not input_str.strip():
            messagebox.showwarning("Input Required", "Please enter square inches to convert.")
            return

        square_inches = self.parse_input(input_str)

        if square_inches is None:
            messagebox.showerror("Invalid Input",
                               "Please enter a valid number or fraction.\n\nExamples:\n• 144\n• 144.5\n• 144 1/2\n• 289/2")
            return

        if square_inches < 0:
            messagebox.showerror("Invalid Input", "Square inches cannot be negative.")
            return

        # Convert to square feet (1 square foot = 144 square inches)
        square_feet = square_inches / 144


        # Format the result with modern styling - show only decimal result
        decimal_approx = float(square_feet)

        # Show clean decimal result with superscript ²
        if decimal_approx == int(decimal_approx):
            result_text = f"{int(decimal_approx)} ft²"
        else:
            result_text = f"{decimal_approx:.4f} ft²"

        # Simple detail text
        detail_text = f"{decimal_approx:.6f} square feet"

        self.result_var.set(result_text)
        self.detail_var.set(detail_text)

        # Rely on textvariable; ensure pending GUI updates are processed
        self.root.update_idletasks()

    def clear(self):
        """Clear all fields"""
        self.input_var.set("")
        self.result_var.set("0 ft²")
        self.detail_var.set("Enter square inches above to convert")
        self.input_entry.focus()

def main():
    root = tk.Tk()
    app = SquareConverter(root)
    root.mainloop()

if __name__ == "__main__":
    main()
