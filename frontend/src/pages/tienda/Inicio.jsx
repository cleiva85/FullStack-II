import { Link } from 'react-router-dom';
import Carrusel from '../../components/tienda/Carrusel.jsx';
import ListaProductos from '../../components/tienda/ListaProductos.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js';
import { categoriasDB, productosDB } from '../../data/db.js';

const DIAPOSITIVAS = [
  {
    titulo: 'Abastece tu negocio en un solo lugar',
    texto: 'Bebidas, lácteos, abarrotes y aseo de las principales marcas, a precio mayorista.',
    img: '/img/imagen_comercio.jpeg',
    accion: <Link to="/productos" className="btn btn-light">Ver productos</Link>,
  },
  {
    titulo: 'Ofertas de la semana',
    texto: 'Descuentos en bebidas, galletas, desayuno y aseo del hogar.',
    img: '/img/distribuidora.jpeg',
    accion: <Link to="/ofertas" className="btn btn-light">Ver ofertas</Link>,
  },
];

export default function Inicio() {
  const categorias = useDatos(() => categoriasDB.listar());
  const ofertas = useDatos(() => productosDB.enOferta().slice(0, 4));
  const agregar = useAgregarAlCarrito();

  return (
    <>
      <Carrusel diapositivas={DIAPOSITIVAS} />

      <section className="mb-5" aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias" className="titulo-seccion">Categorías</h2>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
          {categorias.map((c) => (
            <div className="col" key={c.id}>
              <Link to={`/categorias/${c.slug}`} className="card h-100 text-center text-decoration-none tarjeta-categoria">
                <img src={c.img} alt="" className="card-img-top" />
                <div className="card-body p-2"><span className="small fw-semibold">{c.nombre}</span></div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5" aria-labelledby="titulo-ofertas">
        <div className="d-flex justify-content-between align-items-baseline">
          <h2 id="titulo-ofertas" className="titulo-seccion">Ofertas destacadas</h2>
          <Link to="/ofertas" className="enlace-claro">Ver todas</Link>
        </div>
        <ListaProductos productos={ofertas} onAgregar={agregar} />
      </section>

      <section className="mb-5" aria-labelledby="titulo-video">
        <h2 id="titulo-video" className="titulo-seccion">Conoce nuestras ofertas</h2>
        <div className="ratio ratio-16x9 rounded-4 overflow-hidden">
          <iframe src="https://www.youtube.com/embed/ytpnxmeaNQI" title="Video promocional C & D Distribuidora"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </section>

      <section aria-labelledby="titulo-ubicacion">
        <h2 id="titulo-ubicacion" className="titulo-seccion">Ubicación y centro de distribución</h2>
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-5">
            <div className="panel-oscuro h-100">
              <p><strong>Centro de distribución:</strong> Av. Esq. Blanca 501, Maipú</p>
              <p><strong>Ciudad:</strong> Santiago, Región Metropolitana</p>
              <p><strong>Horario:</strong> lunes a sábado de 08:30 a 19:30 hrs</p>
              <p className="mb-0"><strong>Teléfono:</strong> +56 9 1234 5678</p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="ratio ratio-16x9 rounded-4 overflow-hidden">
              <iframe title="Mapa de ubicación" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=-33.5112593,-70.7524922&output=embed" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
