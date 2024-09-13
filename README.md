# AI Scanner

This React application allows users to upload an image file (either by clicking a button or using drag-and-drop), extract specific information (VIN, DESC, and YR/MDL) from the image, and generate an invoice based on the extracted data.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Run the following command to install the required dependencies:

```
npm install
```

## Running the Application

To start the development server, run the following command in the project directory:

```
npm start
```

This will start the application on `http://localhost:3000`. Open this URL in your web browser to use the AI Scanner.

## How to Use

1. Once the application is running, you'll see a drag-and-drop area or a button to upload an image file.
2. Upload an image containing vehicle information (VIN, DESC, and YR/MDL).
3. The application will process the image and extract the required information.
4. An invoice will be generated based on the extracted data and displayed on the screen.

## Technologies Used

- React
- react-dropzone (for file upload and drag-and-drop functionality)
- tesseract.js (for OCR and text extraction from images)

## Notes

- The image processing might take a few seconds depending on the size and quality of the uploaded image.
- Ensure that the text in the uploaded image is clear and readable for the best results.