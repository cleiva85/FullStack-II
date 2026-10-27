/* Pruebas de PROPS, ESTADO y EVENTOS de la tarjeta de producto. */
import { render, screen, fireEvent } from '@testing-library/react';
import ProductoCard from '@/app/_components/tienda/ProductoCard';
import { PRODUCTO_EJEMPLO } from '@/__tests__/apoyo/utilidades';

const renderCard = (producto, onAgregar = () => {}) => render(
  <ProductoCard producto={producto} onAgregar={onAgregar} />,
);

describe('ProductoCard', () => {
  it('muestra los datos del producto recibido por props', () => {
    renderCard(PRODUCTO_EJEMPLO);
    expect(screen.getByText('Coca-Cola Original')).toBeTruthy();
    expect(screen.getByText('The Coca-Cola Company')).toBeTruthy();
    expect(screen.getByText('$2.500')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Coca-Cola Original' }).getAttribute('src')).toBe('/img/productos/Coca_cola.webp');
  });

  it('cuando está en oferta muestra el precio normal tachado y el descuento', () => {
    renderCard({ ...PRODUCTO_EJEMPLO, oferta: 2190 });
    expect(screen.getByText('$2.190')).toBeTruthy();
    expect(screen.getByText('$2.500').className).toContain('precio-anterior');
    expect(screen.getByText('-12%')).toBeTruthy();
  });

  it('agrega la cantidad elegida con el selector y luego vuelve a 1', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderCard(PRODUCTO_EJEMPLO, onAgregar);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar uno' }));
    fireEvent.click(screen.getByRole('button', { name: 'Agregar uno' }));
    expect(screen.getByRole('spinbutton').value).toBe('3');

    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carro' }));
    expect(onAgregar).toHaveBeenCalledOnceWith(PRODUCTO_EJEMPLO, 3);
    expect(screen.getByRole('spinbutton').value).toBe('1');
  });

  it('sin stock oculta el selector y deshabilita el botón', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderCard({ ...PRODUCTO_EJEMPLO, stock: 0 }, onAgregar);
    expect(screen.getByText('Sin stock')).toBeTruthy();
    expect(screen.queryByRole('spinbutton')).toBeNull();
    const boton = screen.getByRole('button', { name: 'Agregar al carro' });
    expect(boton.disabled).toBe(true);
    fireEvent.click(boton);
    expect(onAgregar).not.toHaveBeenCalled();
  });
});
