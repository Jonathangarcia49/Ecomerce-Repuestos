
import { Product } from '../models/Product.js';

export const seedProducts = async () => {
  const count = await Product.count();
  if (count > 0) return;

  await Product.bulkCreate([
    {
      name: 'Filtro de aceite Toyota',
      description: 'Filtro compatible con varios modelos Toyota.',
      price: 12.99,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Pastillas de freno Brembo',
      description: 'Juego de pastillas delanteras (alto desempeño).',
      price: 39.99,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=1200&q=60'
    },
    {
      name: 'Bujías NGK (set x4)',
      description: 'Encendido eficiente y duradero.',
      price: 22.5,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60'
    }
  ]);

  console.log('🌱 Productos seed ✅');
};
