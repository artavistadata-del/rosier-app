import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Rosier NPK 16-16-16',
    category: 'NPK',
    description:
      'Balanced NPK fertilizer with a 16-16-16 formula ideal for vegetative and generative plant growth. Contains nitrogen, phosphorus, and potassium in a perfect ratio for maximum productivity.',
    packaging: '50 kg / bag',
    image: '/images/products/npk-16-16-16.jpg',
    features: [
      'Balanced N-P-K 16-16-16 formula',
      'Fine granules, easily soluble',
      'Suitable for all types of plants',
      'Increases productivity by up to 30%',
    ],
    createdAt: '2024-01-15',
  },
  {
    id: 'prod-002',
    name: 'Rosier NPK Pearl 15-15-15',
    category: 'NPK',
    description:
      'Premium pearl NPK fertilizer with a balanced content designed for rice, corn, and secondary crops. Blue crystal granules that are easy to apply.',
    packaging: '25 kg / bag',
    image: '/images/products/npk-mutiara.jpg',
    features: [
      'Premium crystal granules',
      'Perfectly soluble in water',
      'For rice and secondary crops',
      'More optimal harvest yields',
    ],
    createdAt: '2024-01-20',
  },
  {
    id: 'prod-003',
    name: 'Rosier Organic Plus',
    category: 'Organic',
    description:
      'Premium organic fertilizer based on fermented compost enriched with minerals and beneficial microorganisms. Safe for the environment and improves long-term soil fertility.',
    packaging: '40 kg / bag',
    image: '/images/products/organik-plus.jpg',
    features: [
      '100% natural organic ingredients',
      'Enriched with microorganisms',
      'Environmentally friendly',
      'Improves soil structure',
    ],
    createdAt: '2024-02-01',
  },
  {
    id: 'prod-004',
    name: 'Rosier Bio-Humus',
    category: 'Organic',
    description:
      'Humus fertilizer based on earthworms (vermicompost) rich in nutrients and natural growth hormones. Highly effective for improving soil quality and root growth.',
    packaging: '20 kg / bag',
    image: '/images/products/bio-humus.jpg',
    features: [
      'Premium vermicompost',
      'Rich in growth hormones',
      'Increases soil microbial activity',
      'Improves soil aeration',
    ],
    createdAt: '2024-02-10',
  },
  {
    id: 'prod-005',
    name: 'Rosier Micro Zinc',
    category: 'Micro',
    description:
      'Micro zinc (Zn) fertilizer formulated to treat zinc deficiency in plants. Important for protein synthesis, enzymes, and plant growth hormones.',
    packaging: '10 kg / bag',
    image: '/images/products/mikro-zinc.jpg',
    features: [
      'High Zn content 30%',
      'Chelated for optimal absorption',
      'Treats zinc deficiency',
      'Suitable for all planting media',
    ],
    createdAt: '2024-02-15',
  },
  {
    id: 'prod-006',
    name: 'Rosier Micro Boron',
    category: 'Micro',
    description:
      'High-concentration liquid boron fertilizer to improve flower formation, fruiting, and fruit quality. Highly effective on horticultural and plantation crops.',
    packaging: '1 liter / bottle',
    image: '/images/products/mikro-boron.jpg',
    features: [
      'Boron concentration 10%',
      'Liquid formulation, easy to apply',
      'Improves fruit set',
      'For horticultural crops',
    ],
    createdAt: '2024-03-01',
  },
  {
    id: 'prod-007',
    name: 'Rosier Biological Rhizo-Pro',
    category: 'Biological',
    description:
      'Biological fertilizer based on Rhizobium bacteria that biologically fixes nitrogen from the air. Ideal for legumes and secondary crops to reduce dependence on chemical fertilizers.',
    packaging: '500 gr / pack',
    image: '/images/products/hayati-rhizo.jpg',
    features: [
      'Active Rhizobium bacteria',
      'Biological nitrogen fixation',
      'Reduces chemical fertilizer by 40%',
      'For legume crops',
    ],
    createdAt: '2024-03-10',
  },
  {
    id: 'prod-008',
    name: 'Rosier Biological Mycorrhiza',
    category: 'Biological',
    description:
      'Mycorrhizal biological fertilizer that helps plants absorb nutrients and water more efficiently. Increases plant resistance to drought and root diseases.',
    packaging: '1 kg / pack',
    image: '/images/products/hayati-mikoriza.jpg',
    features: [
      'Active mycorrhizal spores',
      'Increases P absorption',
      'Drought resistant',
      'Expands root reach',
    ],
    createdAt: '2024-03-20',
  },
  {
    id: 'prod-009',
    name: 'Rosier KNO3 Premium',
    category: 'Specialty',
    description:
      'Premium grade potassium nitrate for fertigation and foliar application. Chloride-free, highly suitable for chloride-sensitive crops like tobacco, potatoes, and vegetables.',
    packaging: '25 kg / bag',
    image: '/images/products/kno3-premium.jpg',
    features: [
      '100% chloride-free',
      'High solubility > 99%',
      'For modern fertigation',
      'Improves crop yield quality',
    ],
    createdAt: '2024-04-01',
  },
  {
    id: 'prod-010',
    name: 'Rosier Calcium Boron Foliar',
    category: 'Specialty',
    description:
      'Foliar fertilizer combining calcium and boron in a liquid formulation that is easily absorbed by leaves. Prevents blossom end rot and strengthens cell walls.',
    packaging: '500 ml / bottle',
    image: '/images/products/ca-b-foliar.jpg',
    features: [
      'Ca 10% + B 0.5%',
      'Chelated liquid formulation',
      'Prevents blossom end rot',
      'Strengthens cell walls',
    ],
    createdAt: '2024-04-10',
  },
  {
    id: 'prod-011',
    name: 'Rosier NPK 20-10-10',
    category: 'NPK',
    description:
      'High-nitrogen NPK fertilizer for aggressive vegetative phase. Ideal for leafy vegetables, grass, and plants that need fast growth.',
    packaging: '50 kg / bag',
    image: '/images/products/npk-20-10-10.jpg',
    features: [
      'High nitrogen for vegetative',
      'Fast and dense growth',
      'Suitable for leafy vegetables',
      'High efficiency',
    ],
    createdAt: '2024-04-20',
  },
  {
    id: 'prod-012',
    name: 'Rosier NPK 12-24-12',
    category: 'NPK',
    description:
      'High-phosphorus NPK fertilizer to strengthen roots, flowering, and fruiting. Highly effective in the early planting phase and when plants start to flower.',
    packaging: '50 kg / bag',
    image: '/images/products/npk-12-24-12.jpg',
    features: [
      'High phosphorus for generative',
      'Strengthens root system',
      'Increases flowering',
      'Improves fruit quality',
    ],
    createdAt: '2024-05-01',
  },
];
