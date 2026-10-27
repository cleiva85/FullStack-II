/* Pruebas de las reglas de validación de los formularios. */
import {
  validarRut, calcularDv, validarEmail, validarTelefono, validarPassword, validarCheckout, validarProducto,
} from '@/app/_lib/utils/validadores';

describe('validadores', () => {
  it('valida el RUT con su dígito verificador', () => {
    expect(validarRut('12.345.678-5')).toBe(true);
    expect(validarRut('12345678-5')).toBe(true);
    expect(validarRut('12.345.678-9')).toBe(false);
    expect(validarRut('')).toBe(false);
    expect(calcularDv('11111111')).toBe('1');
  });

  it('valida correos, teléfonos y contraseñas', () => {
    expect(validarEmail('ana@correo.cl')).toBe(true);
    expect(validarEmail('ana@correo')).toBe(false);
    expect(validarTelefono('912345678')).toBe(true);
    expect(validarTelefono('+56 9 1234 5678')).toBe(true);
    expect(validarTelefono('12345')).toBe(false);
    expect(validarPassword('clave123')).toBe(true);
    expect(validarPassword('corta')).toBe(false);
    expect(validarPassword('solotexto')).toBe(false);
  });

  describe('validarCheckout', () => {
    const completo = {
      nombre: 'Ana', apellido: 'Soto', correo: 'ana@correo.cl', tipoEntrega: 'domicilio',
      calle: 'Los Aromos 123', region: 'Metropolitana de Santiago', comuna: 'Maipú', medioPago: 'debito',
    };

    it('sin errores cuando todo está completo', () => {
      expect(validarCheckout(completo)).toEqual({});
    });

    it('marca todos los campos obligatorios vacíos', () => {
      const e = validarCheckout({ tipoEntrega: 'domicilio' });
      expect(Object.keys(e).sort()).toEqual(['apellido', 'calle', 'comuna', 'correo', 'medioPago', 'nombre', 'region']);
    });

    it('con retiro en tienda no exige dirección', () => {
      const e = validarCheckout({ ...completo, tipoEntrega: 'retiro', calle: '', region: '', comuna: '' });
      expect(e).toEqual({});
    });
  });

  describe('validarProducto', () => {
    const base = { nombre: 'Jugo', categoria: 'Aguas y Jugos', precio: '1000', oferta: '', stock: '5' };
    it('acepta un producto válido', () => expect(validarProducto(base)).toEqual({}));
    it('la oferta debe ser menor al precio', () => {
      expect(validarProducto({ ...base, oferta: '1200' }).oferta).toBeDefined();
    });
    it('rechaza precio y stock no válidos', () => {
      const e = validarProducto({ ...base, precio: '0', stock: '-1' });
      expect(e.precio).toBeDefined();
      expect(e.stock).toBeDefined();
    });
  });
});
