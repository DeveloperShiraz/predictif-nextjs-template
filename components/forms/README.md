# Incident Report Form

A comprehensive incident report form built with ShadCN UI components and React Hook Form.

## Features

- **Responsive Layout**: Side-by-side fields on desktop, stacked on mobile
- **Form Validation**: Zod schema validation with real-time error messages
- **Date Picker**: ShadCN Calendar component with date restrictions
- **File Upload**: Drag-and-drop photo upload with preview
- **File Type Validation**: Only accepts .JPG and .PNG files
- **File Preview**: Shows thumbnails with remove functionality

## Form Fields

1. **Personal Information**
   - First Name / Last Name (side by side)
   - Phone / Email (side by side)
   - Address / ZIP Code (side by side)

2. **Incident Details**
   - Date of Incident (calendar picker)
   - Description of Issue (textarea)

3. **Photo Upload**
   - Drag-and-drop interface
   - File type validation (.JPG, .PNG only)
   - Preview thumbnails
   - Remove individual files

## Usage

```tsx
import { IncidentReportForm } from "@/components/forms/IncidentReportForm";

export default function Page() {
  return <IncidentReportForm />;
}
```

## Dependencies

All required dependencies are already installed:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod integration
- `zod` - Schema validation
- `date-fns` - Date formatting
- `lucide-react` - Icons
- ShadCN UI components

## Customization

The form uses ShadCN components and can be easily customized by:
- Modifying the validation schema in `formSchema`
- Adjusting the layout classes
- Customizing the file upload behavior
- Adding additional form fields