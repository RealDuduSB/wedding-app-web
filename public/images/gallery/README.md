# Gallery Images

Place your gallery photos in this directory with the following naming convention:

- `photo-1.jpg`
- `photo-2.jpg`
- `photo-3.jpg`
- etc.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x800px (square aspect ratio)
- **File size**: Compress images to under 200KB for optimal performance
- **Naming**: Use sequential numbering (photo-1.jpg, photo-2.jpg, etc.)

## Adding More Images

To add more images to the gallery:

1. Add your images to this directory
2. Update the `sampleImages` array in `src/app/galeria/page.tsx`
3. Add a new `GalleryImage` object for each photo with:
   - Unique `id`
   - Path to the image (`/images/gallery/photo-X.jpg`)
   - Descriptive `alt` text for accessibility
   - Image dimensions (`width` and `height`)
   - Display `order`

## Example

```typescript
{
  id: '7',
  url: '/images/gallery/photo-7.jpg',
  alt: 'Descriptive text for the image',
  width: 800,
  height: 800,
  order: 7,
}
```
