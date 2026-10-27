/* Pruebas de PROPIEDADES y EVENTOS: el botón recibe la etiqueta y la función onClick por props. */
import { render, screen, fireEvent } from '@testing-library/react';
import Boton from '@/app/_components/comunes/Boton';

describe('Boton', () => {
  it('muestra la etiqueta recibida por props', () => {
    render(<Boton etiqueta="Agregar al carro" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Agregar al carro' })).toBeTruthy();
  });

  it('ejecuta la función onClick una vez al hacer clic', () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Boton etiqueta="Pagar" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onClick cuando está deshabilitado', () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Boton etiqueta="Pagar" onClick={onClick} deshabilitado />);
    const boton = screen.getByRole('button', { name: 'Pagar' });
    fireEvent.click(boton);
    expect(boton.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('aplica la variante de Bootstrap indicada', () => {
    render(<Boton etiqueta="Eliminar" variante="danger" tamano="sm" onClick={() => {}} />);
    const boton = screen.getByRole('button', { name: 'Eliminar' });
    expect(boton.className).toContain('btn-danger');
    expect(boton.className).toContain('btn-sm');
    expect(boton.getAttribute('type')).toBe('button');
  });
});
