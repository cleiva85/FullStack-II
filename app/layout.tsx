import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Proveedores from '@/app/_components/Proveedores';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'C & D Distribuidora Mayorista',
  description: 'Bebidas, lácteos, abarrotes y aseo de las principales marcas, a precio mayorista. Maipú, Santiago.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body>
        <Proveedores>{children}</Proveedores>
      </body>
    </html>
  );
}
