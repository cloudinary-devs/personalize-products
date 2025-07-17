import React, { useState, useMemo, useEffect } from 'react';
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

const FONTS = [
  { label: 'Arial (Default)', value: 'Arial' },
  { label: 'Alex Brush', value: 'AlexBrush-Regular.ttf' },
];

const SHADOW_OPTIONS = [
  { label: 'No Shadow (default)', value: 'none' },
  { label: 'Black Shadow', value: 'black' },
];

const SHADOW_DISABLED_COLORS = [
  'lightblue',
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
  const [font, setFont] = useState('Arial');
  const [shadow, setShadow] = useState('none');
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

    const hasLongChunk = name
      .split(/\s+/)             // Split on one or more spaces
      .some(chunk => chunk.length > 8); // Check if any word is too long
    let font_size = 40;
    if (hasLongChunk) {
      const longestChunk = name
        .split(/\s+/)
        .reduce((longest, current) =>
          current.length > longest.length ? current : longest,
        '');
      
      const excess = longestChunk.length - 8;
      const reduction = Math.floor(excess / 2) * 7;
      font_size = Math.max(20, 40 - reduction);
    }

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
    // Add shadow layers if selected
    if (shadow === 'black') {
      // First shadow layer (closer)
      img = img.overlay(
        source(
          text(
            name,
            new TextStyle(font, font_size)
              .fontWeight('bold')
              .textAlignment(TextAlignment.center())
          )
            .textColor('black')
            .textFit(TextFit.size(180, 220))
        ).position(new Position().gravity(compass('north')).offsetX(4).offsetY(204)) // 4px right, 4px down
      );
      // Second shadow layer (further for bolder effect)
      img = img.overlay(
        source(
          text(
            name,
            new TextStyle(font, font_size)
              .fontWeight('bold')
              .textAlignment(TextAlignment.center())
          )
            .textColor('black')
            .textFit(TextFit.size(180, 220))
        ).position(new Position().gravity(compass('north')).offsetX(8).offsetY(208)) // 8px right, 8px down
      );
    }
    img = img.overlay(
      source(
        text(
          name,
          new TextStyle(font, font_size)
            .fontWeight('bold')
            .textAlignment(TextAlignment.center())
        )
          .textColor(textColor)
          .textFit(TextFit.size(180, 220))
      ).position(new Position().gravity(compass('north')).offsetY(200))
    );
    return img;
  }, [name, number, color, font, shadow, errors]);

  // Reset shadow if color disables shadow
  useEffect(() => {
    if (SHADOW_DISABLED_COLORS.includes(color) && shadow !== 'none') {
      setShadow('none');
    }
  }, [color, shadow]);

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
        {/* Horizontal row for Color, Font, Shadow */}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: 'black', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Color:</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem', width: '100%' }}
            >
              {COLORS.map((col) => (
                <option key={col} value={col}>
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: 'black', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Font:</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem', width: '100%' }}
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: 'black', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Shadow:</label>
            <select
              value={shadow}
              onChange={(e) => setShadow(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem', width: '100%' }}
              disabled={SHADOW_DISABLED_COLORS.includes(color)}
            >
              {SHADOW_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
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