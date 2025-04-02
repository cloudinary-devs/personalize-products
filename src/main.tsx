import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen/index';

import { generativeRecolor } from '@cloudinary/url-gen/actions/effect';

import { fill } from '@cloudinary/url-gen/actions/resize';
import { Position } from '@cloudinary/url-gen/qualifiers';
import { compass } from '@cloudinary/url-gen/qualifiers/gravity';

import { text } from '@cloudinary/url-gen/qualifiers/source';
import { TextStyle } from '@cloudinary/url-gen/qualifiers/textStyle';
import { TextFit } from '@cloudinary/url-gen/qualifiers/textFit';
import { TextAlignment } from '@cloudinary/url-gen/qualifiers';

import './index.css'; // Ensure global styles are imported
import { source } from '@cloudinary/url-gen/actions/overlay';

const CLOUDINARY_CLOUD_NAME = 'unique-boutique';
const BASE_TSHIRT_IMAGE = 'shirt-06';
const COLORS = [
  'blue',
  'maroon',
  'lightblue',
  'purple',
  'green',
  'black',
  'white',
  'orange',
  'red',
  'beige',
];

const cld = new Cloudinary({
  cloud: { cloudName: CLOUDINARY_CLOUD_NAME },
});

function MonogramTshirtApp() {
  const [name, setName] = useState('John');
  const [number, setNumber] = useState('10');
  const [color, setColor] = useState('blue');
  const [errors, setErrors] = useState({ name: '', number: '' });

  const textColor = ['black', 'maroon', 'blue', 'purple', 'green'].includes(
    color
  )
    ? 'white'
    : 'black';

  const validateFields = (newName: string, newNumber: string) => {
    const newErrors = {
      name: newName.trim().length > 0 ? '' : 'Name cannot be empty.',
      number: newNumber.trim().length > 0 ? '' : 'Number cannot be empty.',
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.number;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName: string = e.target.value.slice(0, 35);
    setName(newName);
    validateFields(newName, number);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber: string = e.target.value;
    setNumber(newNumber);
    validateFields(name, newNumber);
  };

  const tshirtImage = useMemo(() => {
    if (errors.name || errors.number) return null;

    let img = cld
      .image(BASE_TSHIRT_IMAGE)
      .resize(fill().width(500).height(500));

    if (color !== 'blue') {
      img = img.effect(generativeRecolor('shirt', color));
    }
    img = img.overlay(
      source(
        text(
          number,
          new TextStyle('Arial', 60)
            .fontWeight('bold')
            .textAlignment(TextAlignment.center())
        ).textColor(textColor)
      ).position(new Position().gravity(compass('north')).offsetY(140))
    );
    img = img.overlay(
      source(
        text(
          name,
          new TextStyle('Arial', 40)
            .fontWeight('bold')
            .textAlignment(TextAlignment.center())
        )
          .textColor(textColor)
          .textFit(TextFit.size(180, 220))
      ).position(new Position().gravity(compass('north')).offsetY(200))
    );
    return img;
  }, [name, number, color, errors]);

  return (
    <div className="main flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Customize Your T-Shirt</h1>

      {tshirtImage ? (
        <AdvancedImage cldImg={tshirtImage} className="w-64 h-64" />
      ) : (
        <p className="text-gray-500">
          Please enter valid details to generate T-shirt preview.
        </p>
      )}

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-black text-lg">
            Name (Max 35 characters):
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="p-3 border border-gray-400 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          />
        </div>
        {errors.name && (
          <p className="error text-red-500 text-sm">{errors.name}</p>
        )}
        <div className="flex items-center gap-4">
          <label className="font-semibold text-black text-lg">Number:</label>
          <input
            type="number"
            value={number}
            onChange={handleNumberChange}
            className="p-3 border border-gray-400 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          />
        </div>
        {errors.number && (
          <p className="error text-red-500 text-sm">{errors.number}</p>
        )}
        <div className="flex items-center gap-4">
          <label className="font-semibold text-black text-lg">Color:</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="p-3 border border-gray-400 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          >
            {COLORS.map((col) => (
              <option key={col} value={col}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default MonogramTshirtApp;

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MonogramTshirtApp />
    </React.StrictMode>
  );
}
