export default function Nosotros() {
  return (
    <div className="row g-4 align-items-center">
      <div className="col-lg-6">
        <h1 className="titulo-seccion">Nosotros</h1>
        <p>C & D Distribuidora Mayorista abastece a almacenes, minimarkets y familias de Maipú y alrededores con bebidas, lácteos, abarrotes, confites y productos de aseo de las principales marcas del país.</p>
        <p>Trabajamos con precios mayoristas y sin mínimos de compra: puedes elegir la cantidad exacta de cada producto, retirar en nuestro centro de distribución o pedir despacho a domicilio.</p>
        <h2 className="h5 mt-4">Nuestro compromiso</h2>
        <ul>
          <li>Stock actualizado en línea para que sepas qué hay disponible antes de comprar.</li>
          <li>Despacho en la Región Metropolitana y retiro en tienda sin costo.</li>
          <li>Atención directa por teléfono y formulario de contacto.</li>
        </ul>
      </div>
      <div className="col-lg-6">
        <img src="/img/distribuidora.jpeg" alt="Góndola con bebidas, lácteos y abarrotes" className="img-fluid rounded-4" />
      </div>
    </div>
  );
}
