// ===== src/data/achievements/index.ts =====
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }
  
  export const achievements: Achievement[] = [
    {
      id: 'first_circle',
      title: 'Circle Master',
      description: 'Drew your first circle!',
      icon: '⭕',
      unlocked: false,
    },
    {
      id: 'first_square',
      title: 'Square Explorer',
      description: 'Drew your first square!',
      icon: '⬜',
      unlocked: false,
    },
    {
      id: 'first_triangle',
      title: 'Triangle Champion',
      description: 'Drew your first triangle!',
      icon: '🔺',
      unlocked: false,
    },
  ];
  
  // ===== src/data/lessons/index.ts =====
  export interface Lesson {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    objectives: string[];
  }
  
  export const lessons: Lesson[] = [
    {
      id: 'basic_shapes',
      title: 'Basic Shapes',
      description: 'Learn to draw circles, squares, and triangles',
      difficulty: 'beginner',
      duration: 300, // 5 minutes
      objectives: ['Draw a circle', 'Draw a square', 'Draw a triangle'],
    },
    {
      id: 'advanced_shapes',
      title: 'Advanced Shapes',
      description: 'Master complex shapes and patterns',
      difficulty: 'intermediate',
      duration: 600, // 10 minutes
      objectives: ['Draw stars', 'Draw hearts', 'Create patterns'],
    },
  ];
  
  // ===== src/data/shapes/index.ts =====
  export interface ShapeTemplate {
    type: string;
    name: string;
    description: string;
    difficulty: number;
    instructions: string[];
  }
  
  export const shapeTemplates: ShapeTemplate[] = [
    {
      type: 'circle',
      name: 'Circle',
      description: 'A perfect round shape',
      difficulty: 1,
      instructions: [
        'Start with your pencil anywhere on the canvas',
        'Draw a curved line connecting back to the start',
        'Try to keep the distance from center equal all around',
      ],
    },
    {
      type: 'square',
      name: 'Square',
      description: 'Four equal sides and right angles',
      difficulty: 2,
      instructions: [
        'Draw a horizontal line',
        'Draw a vertical line down from the right end',
        'Draw another horizontal line to the left',
        'Connect back to the starting point',
      ],
    },
    {
      type: 'triangle',
      name: 'Triangle',
      description: 'Three sides forming a closed shape',
      difficulty: 2,
      instructions: [
        'Draw a line for the base',
        'From one end, draw a line upward and to the right',
        'Connect this point back to the other end of the base',
      ],
    },
  ];
  
  // ===== src/data/tips/index.ts =====
  export interface DrawingTip {
    id: string;
    category: 'technique' | 'mindset' | 'practice';
    title: string;
    description: string;
    icon: string;
  }
  
  export const drawingTips: DrawingTip[] = [
    {
      id: 'practice_daily',
      category: 'practice',
      title: 'Practice Daily',
      description: 'Even 5 minutes of daily practice will improve your skills significantly.',
      icon: '🎯',
    },
    {
      id: 'start_light',
      category: 'technique',
      title: 'Start with Light Strokes',
      description: 'Begin with light, gentle strokes and build up pressure gradually.',
      icon: '✏️',
    },
    {
      id: 'embrace_mistakes',
      category: 'mindset',
      title: 'Embrace Mistakes',
      description: 'Every mistake is a learning opportunity. Keep drawing!',
      icon: '💪',
    },
    {
      id: 'observe_shapes',
      category: 'technique',
      title: 'See Basic Shapes',
      description: 'Look for circles, squares, and triangles in everything around you.',
      icon: '👁️',
    },
    {
      id: 'relax_hand',
      category: 'technique',
      title: 'Relax Your Hand',
      description: 'Keep your hand and wrist relaxed for smoother, more natural movements.',
      icon: '🤲',
    },
  ];
  
  // ===== src/data/transformations/index.ts =====
  export interface TransformationData {
    shape: string;
    transformations: Array<{
      id: string;
      name: string;
      description: string;
      emoji: string;
    }>;
  }
  
  export const transformationData: TransformationData[] = [
    {
      shape: 'circle',
      transformations: [
        { id: 'smiley', name: 'Happy Face', description: 'Your circle became a smile!', emoji: '😊' },
        { id: 'sun', name: 'Bright Sun', description: 'Shining bright like the sun!', emoji: '☀️' },
        { id: 'clock', name: 'Time Keeper', description: 'A perfect clock face!', emoji: '🕐' },
      ],
    },
    {
      shape: 'square',
      transformations: [
        { id: 'gift', name: 'Present', description: 'A beautiful gift box!', emoji: '🎁' },
        { id: 'window', name: 'Window View', description: 'Looking through a window!', emoji: '🪟' },
        { id: 'dice', name: 'Lucky Dice', description: 'Roll for good luck!', emoji: '🎲' },
      ],
    },
    {
      shape: 'triangle',
      transformations: [
        { id: 'mountain', name: 'Majestic Peak', description: 'A towering mountain!', emoji: '🏔️' },
        { id: 'tree', name: 'Pine Tree', description: 'A beautiful evergreen!', emoji: '🎄' },
        { id: 'pyramid', name: 'Ancient Pyramid', description: 'A wonder of the world!', emoji: '🔺' },
      ],
    },
  ];