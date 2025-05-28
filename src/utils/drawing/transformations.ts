import { ShapeType } from '@/types/drawing';

export interface Transformation {
  type: string;
  description: string;
}

export function getShapeTransformations(shape: ShapeType): Transformation[] {
  switch (shape) {
    case 'circle':
      return [
        { type: 'smiley', description: 'Your circle became a happy face!' },
        { type: 'sun', description: 'Now it\'s a bright sun!' },
        { type: 'clock', description: 'Look, a working clock!' },
        { type: 'wheel', description: 'A spinning wheel!' },
        { type: 'pizza', description: 'Delicious pizza!' },
      ];
      
    case 'square':
      return [
        { type: 'window', description: 'Your square became a window!' },
        { type: 'gift', description: 'A wrapped present!' },
        { type: 'frame', description: 'A picture frame!' },
        { type: 'dice', description: 'Lucky dice!' },
        { type: 'tv', description: 'A retro TV!' },
      ];
      
    case 'triangle':
      return [
        { type: 'mountain', description: 'Your triangle became a mountain!' },
        { type: 'tree', description: 'A Christmas tree!' },
        { type: 'pyramid', description: 'An ancient pyramid!' },
        { type: 'sailboat', description: 'A sailing boat!' },
        { type: 'pizza-slice', description: 'A slice of pizza!' },
      ];
      
    case 'line':
      return [
        { type: 'horizon', description: 'Your line became the horizon!' },
        { type: 'snake', description: 'A slithering snake!' },
        { type: 'road', description: 'A winding road!' },
        { type: 'river', description: 'A flowing river!' },
        { type: 'lightning', description: 'Lightning strike!' },
      ];
      
    case 'squiggle':
      return [
        { type: 'wave', description: 'Your squiggle became ocean waves!' },
        { type: 'smoke', description: 'Rising smoke!' },
        { type: 'cloud', description: 'A fluffy cloud!' },
        { type: 'hair', description: 'Flowing hair!' },
        { type: 'ribbon', description: 'A dancing ribbon!' },
      ];
      
    case 'star':
      return [
        { type: 'star-bright', description: 'Your star is shining bright!' },
        { type: 'firework', description: 'A bursting firework!' },
        { type: 'snowflake', description: 'A unique snowflake!' },
        { type: 'sparkle', description: 'Magic sparkles!' },
        { type: 'compass', description: 'A navigation compass!' },
      ];
      
    case 'heart':
      return [
        { type: 'heart-full', description: 'Your heart is full of love!' },
        { type: 'balloon', description: 'A heart balloon!' },
        { type: 'flower', description: 'A blooming flower!' },
        { type: 'butterfly', description: 'A beautiful butterfly!' },
        { type: 'leaf', description: 'A natural leaf!' },
      ];
      
    case 'spiral':
      return [
        { type: 'galaxy', description: 'Your spiral became a galaxy!' },
        { type: 'shell', description: 'A seashell!' },
        { type: 'lollipop', description: 'A sweet lollipop!' },
        { type: 'tornado', description: 'A spinning tornado!' },
        { type: 'dna', description: 'The building blocks of life!' },
      ];
      
    default:
      return [
        { type: 'abstract', description: 'Your creation is unique art!' },
        { type: 'constellation', description: 'Like stars in the sky!' },
        { type: 'map', description: 'A treasure map!' },
        { type: 'signature', description: 'Your artistic signature!' },
        { type: 'masterpiece', description: 'A true masterpiece!' },
      ];
  }
}