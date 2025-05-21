# Monogram T-Shirt Customizer

This is a React application that allows users to customize a t-shirt preview by selecting a color, entering a name, and choosing a number to display. It uses Cloudinary for image manipulation and dynamic overlays.

## Features

* Real-time t-shirt preview with user input name and number overlays 
* Dynamic recoloring using Cloudinary’s Generative Recolor effect
* Smart font sizing for long names
* Responsive and styled UI using Tailwind CSS

## Tech Stack

* React
* Cloudinary JavaScript SDK
* Tailwind CSS

## Installation

1. Clone the repository

```
git clone https://github.com/yourusername/monogram-tshirt-app.git
cd monogram-tshirt-app
```

2. Install dependencies

```
npm install
```

3. Update Cloudinary settings
  Replace the `CLOUDINARY_CLOUD_NAME` in the code with your own Cloudinary cloud name:

```
const CLOUDINARY_CLOUD_NAME = 'your-cloud-name';
```

4. Run the application

```
npm start
```

5. Open your browser to `http://localhost:3000` to use the app.

## How It Works

* The base t-shirt image is stored in your Cloudinary account.

* When the user inputs a name and number:
  * A Cloudinary URL is generated with:
    * `generativeRecolor` to change the shirt color
    * `overlay` with `text()` for adding the name and number
    * Automatic font resizing for long names

* The preview is rendered using `<AdvancedImage />` from `@cloudinary/react`.

src/
│
├── index.css             # Tailwind styles
├── index.tsx             # Main app logic and rendering

## Validation

* **Name**: required, max 35 characters
* **Number**: required
* **Color**: dropdown with predefined options

