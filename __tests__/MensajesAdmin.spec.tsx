/* Pruebas de la sección Mensajes del panel: listado, filtro, detalle (marca leído), respondido y eliminar. */
import { screen, fireEvent } from '@testing-library/react';
import MensajesAdmin from '@/app/admin/mensajes/page';
import DetalleMensaje from '@/app/admin/mensajes/[id]/page';
import { renderizar } from '@/__tests__/apoyo/utilidades';
import { mensajesDB, restablecerBaseDatos } from '@/app/_lib/data/db';

describe('Mensajes (panel admin)', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('lista todos los mensajes y cuenta los sin leer', () => {
    renderizar(<MensajesAdmin />, { pathname: '/admin/mensajes' });
    expect(screen.getAllByRole('link', { name: 'Ver' }).length).toBe(mensajesDB.listar().length);
    expect(screen.getByText(`${mensajesDB.listar().length} mensajes · ${mensajesDB.nuevos().length} sin leer`)).toBeTruthy();
  });

  it('filtra por estado', () => {
    renderizar(<MensajesAdmin />, { pathname: '/admin/mensajes' });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'Respondido' } });
    expect(screen.getAllByRole('link', { name: 'Ver' }).length).toBe(mensajesDB.listar().filter((m) => m.estado === 'Respondido').length);
  });

  it('al abrir un mensaje nuevo queda como leído', () => {
    const nuevo = mensajesDB.nuevos()[0];
    renderizar(<DetalleMensaje />, { pathname: `/admin/mensajes/${nuevo.id}`, params: { id: String(nuevo.id) } });
    expect(screen.getByText(nuevo.mensaje)).toBeTruthy();
    expect(mensajesDB.obtener(nuevo.id).estado).toBe('Leído');
    expect(screen.getByRole('link', { name: 'Responder por correo' }).getAttribute('href')).toContain(`mailto:${nuevo.correo}`);
  });

  it('se puede marcar como respondido', () => {
    const nuevo = mensajesDB.nuevos()[0];
    renderizar(<DetalleMensaje />, { params: { id: String(nuevo.id) } });
    fireEvent.click(screen.getByRole('button', { name: 'Marcar como respondido' }));
    expect(mensajesDB.obtener(nuevo.id).estado).toBe('Respondido');
    expect(screen.queryByRole('button', { name: 'Marcar como respondido' })).toBeNull();
  });

  it('eliminar pide confirmación (mock de window.confirm) y vuelve al listado', () => {
    const m = mensajesDB.listar()[0];
    spyOn(window, 'confirm').and.returnValue(true);
    const { router } = renderizar(<DetalleMensaje />, { params: { id: String(m.id) } });
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(window.confirm).toHaveBeenCalled();
    expect(mensajesDB.obtener(m.id)).toBeNull();
    expect(router.push).toHaveBeenCalledWith('/admin/mensajes');
  });
});
