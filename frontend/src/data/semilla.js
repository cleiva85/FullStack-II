/* =========================================================
   semilla.js — datos iniciales de la "base de datos" simulada.
   db.js los copia a localStorage la primera vez que se abre la app.
   Para volver a estos datos: botón "Restablecer datos" en el panel
   de administración (Perfil) o borrar el localStorage del navegador.
   ========================================================= */

export const PRODUCTOS_BASE = [
  {"id":1,"nombre":"Coca-Cola Original","marca":"The Coca-Cola Company","categoria":"Gaseosas","descripcion":"Botella 1.5 Litros","precio":2500,"oferta":2190,"stock":40,"stockCritico":10,"img":"/img/coca-cola.jpeg"},
  {"id":2,"nombre":"Leche Entera","marca":"Colun","categoria":"Lácteos","descripcion":"1 Litro natural","precio":990,"oferta":null,"stock":17,"stockCritico":10,"img":"/img/leche-entera.jpeg"},
  {"id":3,"nombre":"Leche SemiDescremada","marca":"Colun","categoria":"Lácteos","descripcion":"1 Litro reducida en grasa","precio":990,"oferta":null,"stock":54,"stockCritico":10,"img":"/img/leche-semidescremada.jpeg"},
  {"id":4,"nombre":"Chocolate Vizzio","marca":"Costa","categoria":"Chocolates","descripcion":"Formato 120 gramos con almendras","precio":1990,"oferta":1690,"stock":31,"stockCritico":10,"img":"/img/vicio.jpeg"},
  {"id":5,"nombre":"Manjar Tradicional","marca":"Nestlé","categoria":"Desayuno y Once","descripcion":"Pote de 200 gramos","precio":2000,"oferta":null,"stock":8,"stockCritico":10,"img":"/img/manjar.jpeg"},
  {"id":6,"nombre":"Queso Gouda Trozo","marca":"Colun","categoria":"Desayuno y Once","descripcion":"Pieza de 500 gramos madurado","precio":6990,"oferta":null,"stock":45,"stockCritico":10,"img":"/img/queso.jpeg"},
  {"id":7,"nombre":"Pepsi Regular","marca":"Pepsi","categoria":"Gaseosas","descripcion":"Botella 500 ml personal","precio":1190,"oferta":null,"stock":22,"stockCritico":10,"img":"/img/pepsi.jpeg"},
  {"id":8,"nombre":"Galleta Triton","marca":"McKay","categoria":"Galletas","descripcion":"Sabor vainilla 116 gramos","precio":850,"oferta":690,"stock":59,"stockCritico":10,"img":"/img/triton.jpeg"},
  {"id":9,"nombre":"Ramitas de Queso","marca":"Evercrisp","categoria":"Snacks","descripcion":"Snack salado crujiente","precio":550,"oferta":null,"stock":36,"stockCritico":10,"img":"/img/ramitas-queso.jpeg"},
  {"id":10,"nombre":"Galletas Morochas","marca":"McKay","categoria":"Galletas","descripcion":"Paquete 120 gramos con chocolate","precio":450,"oferta":null,"stock":13,"stockCritico":10,"img":"/img/morochas.jpeg"},
  {"id":11,"nombre":"Coca-Cola Zero","marca":"The Coca-Cola Company","categoria":"Gaseosas","descripcion":"Botella 1.5 Litros sin azúcar","precio":2500,"oferta":null,"stock":50,"stockCritico":10,"img":"/img/coca-cola-zero.svg"},
  {"id":12,"nombre":"Fanta Naranja","marca":"The Coca-Cola Company","categoria":"Gaseosas","descripcion":"Botella 1.5 Litros","precio":2300,"oferta":1990,"stock":27,"stockCritico":10,"img":"/img/fanta-naranja.svg"},
  {"id":13,"nombre":"Sprite","marca":"The Coca-Cola Company","categoria":"Gaseosas","descripcion":"Botella 1.5 Litros","precio":2300,"oferta":null,"stock":4,"stockCritico":10,"img":"/img/sprite.svg"},
  {"id":14,"nombre":"Bilz","marca":"CCU","categoria":"Gaseosas","descripcion":"Botella 1.5 Litros sabor frutal","precio":2200,"oferta":null,"stock":41,"stockCritico":10,"img":"/img/bilz.svg"},
  {"id":15,"nombre":"Pap","marca":"CCU","categoria":"Gaseosas","descripcion":"Botella 1.5 Litros sabor papaya","precio":2200,"oferta":null,"stock":18,"stockCritico":10,"img":"/img/pap.svg"},
  {"id":16,"nombre":"Agua Mineral Cachantun","marca":"CCU","categoria":"Aguas y Jugos","descripcion":"Botella 1.6 Litros sin gas","precio":1100,"oferta":null,"stock":55,"stockCritico":10,"img":"/img/agua-mineral-cachantun.svg"},
  {"id":17,"nombre":"Agua con Gas Benedictino","marca":"CCU","categoria":"Aguas y Jugos","descripcion":"Botella 1.5 Litros","precio":1200,"oferta":null,"stock":32,"stockCritico":10,"img":"/img/agua-con-gas-benedictino.svg"},
  {"id":18,"nombre":"Néctar de Durazno Watts","marca":"Watts","categoria":"Aguas y Jugos","descripcion":"Caja 1 Litro","precio":1390,"oferta":null,"stock":9,"stockCritico":10,"img":"/img/nectar-de-durazno-watts.svg"},
  {"id":19,"nombre":"Jugo de Naranja Andina","marca":"Andina","categoria":"Aguas y Jugos","descripcion":"Caja 1 Litro","precio":1490,"oferta":null,"stock":46,"stockCritico":10,"img":"/img/jugo-de-naranja-andina.svg"},
  {"id":20,"nombre":"Bebida Isotónica Powerade","marca":"The Coca-Cola Company","categoria":"Aguas y Jugos","descripcion":"Botella 500 ml","precio":1290,"oferta":null,"stock":23,"stockCritico":10,"img":"/img/bebida-isotonica-powerade.svg"},
  {"id":21,"nombre":"Yogurt Batido Frutilla","marca":"Soprole","categoria":"Lácteos","descripcion":"Pack 8 unidades de 120 g","precio":3290,"oferta":2790,"stock":60,"stockCritico":10,"img":"/img/yogurt-batido-frutilla.svg"},
  {"id":22,"nombre":"Mantequilla con Sal","marca":"Colun","categoria":"Lácteos","descripcion":"Barra 250 gramos","precio":2790,"oferta":null,"stock":37,"stockCritico":10,"img":"/img/mantequilla-con-sal.svg"},
  {"id":23,"nombre":"Queso Mantecoso Laminado","marca":"Colun","categoria":"Lácteos","descripcion":"Paquete 250 gramos","precio":3490,"oferta":null,"stock":14,"stockCritico":10,"img":"/img/queso-mantecoso-laminado.svg"},
  {"id":24,"nombre":"Leche Descremada","marca":"Soprole","categoria":"Lácteos","descripcion":"Caja 1 Litro","precio":1050,"oferta":null,"stock":51,"stockCritico":10,"img":"/img/leche-descremada.svg"},
  {"id":25,"nombre":"Crema de Leche","marca":"Soprole","categoria":"Lácteos","descripcion":"Caja 200 ml","precio":1190,"oferta":null,"stock":28,"stockCritico":10,"img":"/img/crema-de-leche.svg"},
  {"id":26,"nombre":"Sahne-Nuss","marca":"Nestlé","categoria":"Chocolates","descripcion":"Barra 90 gramos","precio":1690,"oferta":null,"stock":5,"stockCritico":10,"img":"/img/sahne-nuss.svg"},
  {"id":27,"nombre":"Super 8","marca":"Nestlé","categoria":"Chocolates","descripcion":"Barra 24 gramos","precio":350,"oferta":null,"stock":42,"stockCritico":10,"img":"/img/super-8.svg"},
  {"id":28,"nombre":"Bombones Bon o Bon","marca":"Arcor","categoria":"Chocolates","descripcion":"Caja 16 unidades","precio":3990,"oferta":3390,"stock":19,"stockCritico":10,"img":"/img/bombones-bon-o-bon.svg"},
  {"id":29,"nombre":"Café Instantáneo Nescafé Tradición","marca":"Nestlé","categoria":"Desayuno y Once","descripcion":"Frasco 170 gramos","precio":6490,"oferta":null,"stock":56,"stockCritico":10,"img":"/img/cafe-instantaneo-nescafe-tradicion.svg"},
  {"id":30,"nombre":"Té Negro Supremo","marca":"Supremo","categoria":"Desayuno y Once","descripcion":"Caja 100 bolsitas","precio":2990,"oferta":null,"stock":33,"stockCritico":10,"img":"/img/te-negro-supremo.svg"},
  {"id":31,"nombre":"Mermelada de Frutilla","marca":"Watts","categoria":"Desayuno y Once","descripcion":"Frasco 250 gramos","precio":1790,"oferta":null,"stock":10,"stockCritico":10,"img":"/img/mermelada-de-frutilla.svg"},
  {"id":32,"nombre":"Cereal Corn Flakes","marca":"Kellogg's","categoria":"Desayuno y Once","descripcion":"Caja 500 gramos","precio":3890,"oferta":3290,"stock":47,"stockCritico":10,"img":"/img/cereal-corn-flakes.svg"},
  {"id":33,"nombre":"Pan de Molde Blanco","marca":"Ideal","categoria":"Desayuno y Once","descripcion":"Bolsa 600 gramos","precio":2490,"oferta":null,"stock":24,"stockCritico":10,"img":"/img/pan-de-molde-blanco.svg"},
  {"id":34,"nombre":"Galletas Obleas Vino","marca":"Costa","categoria":"Galletas","descripcion":"Paquete 8 unidades","precio":990,"oferta":null,"stock":61,"stockCritico":10,"img":"/img/galletas-obleas-vino.svg"},
  {"id":35,"nombre":"Galletas Soda","marca":"McKay","categoria":"Galletas","descripcion":"Pack 6 unidades","precio":1390,"oferta":null,"stock":38,"stockCritico":10,"img":"/img/galletas-soda.svg"},
  {"id":36,"nombre":"Papas Fritas Lays Clásicas","marca":"Lays","categoria":"Snacks","descripcion":"Bolsa 140 gramos","precio":2190,"oferta":1790,"stock":15,"stockCritico":10,"img":"/img/papas-fritas-lays-clasicas.svg"},
  {"id":37,"nombre":"Maní Salado","marca":"Marco Polo","categoria":"Snacks","descripcion":"Bolsa 200 gramos","precio":1590,"oferta":null,"stock":52,"stockCritico":10,"img":"/img/mani-salado.svg"},
  {"id":38,"nombre":"Cheetos","marca":"Evercrisp","categoria":"Snacks","descripcion":"Bolsa 110 gramos","precio":1390,"oferta":null,"stock":29,"stockCritico":10,"img":"/img/cheetos.svg"},
  {"id":39,"nombre":"Azúcar Granulada","marca":"Iansa","categoria":"Abarrotes","descripcion":"Bolsa 1 kg","precio":1290,"oferta":null,"stock":6,"stockCritico":10,"img":"/img/azucar-granulada.svg"},
  {"id":40,"nombre":"Harina de Trigo","marca":"Selecta","categoria":"Abarrotes","descripcion":"Bolsa 1 kg","precio":1190,"oferta":null,"stock":43,"stockCritico":10,"img":"/img/harina-de-trigo.svg"},
  {"id":41,"nombre":"Sal de Mar","marca":"Lobos","categoria":"Abarrotes","descripcion":"Bolsa 1 kg","precio":690,"oferta":null,"stock":20,"stockCritico":10,"img":"/img/sal-de-mar.svg"},
  {"id":42,"nombre":"Arroz Grado 1","marca":"Tucapel","categoria":"Abarrotes","descripcion":"Bolsa 1 kg","precio":1590,"oferta":null,"stock":57,"stockCritico":10,"img":"/img/arroz-grado-1.svg"},
  {"id":43,"nombre":"Fideos Espagueti 5","marca":"Carozzi","categoria":"Abarrotes","descripcion":"Paquete 400 gramos","precio":990,"oferta":null,"stock":34,"stockCritico":10,"img":"/img/fideos-espagueti-5.svg"},
  {"id":44,"nombre":"Aceite de Maravilla","marca":"Chef","categoria":"Abarrotes","descripcion":"Botella 1 Litro","precio":2890,"oferta":null,"stock":11,"stockCritico":10,"img":"/img/aceite-de-maravilla.svg"},
  {"id":45,"nombre":"Atún Lomito en Aceite","marca":"Van Camps","categoria":"Conservas y Salsas","descripcion":"Lata 170 gramos","precio":1990,"oferta":null,"stock":48,"stockCritico":10,"img":"/img/atun-lomito-en-aceite.svg"},
  {"id":46,"nombre":"Salsa de Tomate","marca":"Pomarola","categoria":"Conservas y Salsas","descripcion":"Doypack 200 gramos","precio":690,"oferta":null,"stock":25,"stockCritico":10,"img":"/img/salsa-de-tomate.svg"},
  {"id":47,"nombre":"Mayonesa","marca":"Hellmann's","categoria":"Conservas y Salsas","descripcion":"Doypack 400 gramos","precio":2490,"oferta":null,"stock":62,"stockCritico":10,"img":"/img/mayonesa.svg"},
  {"id":48,"nombre":"Ketchup","marca":"Heinz","categoria":"Conservas y Salsas","descripcion":"Botella 397 gramos","precio":1990,"oferta":null,"stock":39,"stockCritico":10,"img":"/img/ketchup.svg"},
  {"id":49,"nombre":"Duraznos en Conserva","marca":"Watts","categoria":"Conservas y Salsas","descripcion":"Lata 820 gramos","precio":2190,"oferta":null,"stock":16,"stockCritico":10,"img":"/img/duraznos-en-conserva.svg"},
  {"id":50,"nombre":"Detergente en Polvo","marca":"Omo","categoria":"Aseo del Hogar","descripcion":"Bolsa 1.5 kg","precio":5990,"oferta":4990,"stock":53,"stockCritico":10,"img":"/img/detergente-en-polvo.svg"},
  {"id":51,"nombre":"Lavaloza Limón","marca":"Quix","categoria":"Aseo del Hogar","descripcion":"Botella 750 ml","precio":1790,"oferta":null,"stock":30,"stockCritico":10,"img":"/img/lavaloza-limon.svg"},
  {"id":52,"nombre":"Papel Higiénico Doble Hoja","marca":"Elite","categoria":"Aseo del Hogar","descripcion":"Pack 12 rollos","precio":5490,"oferta":null,"stock":7,"stockCritico":10,"img":"/img/papel-higienico-doble-hoja.svg"},
  {"id":53,"nombre":"Cloro Gel","marca":"Clorox","categoria":"Aseo del Hogar","descripcion":"Botella 900 ml","precio":1890,"oferta":null,"stock":44,"stockCritico":10,"img":"/img/cloro-gel.svg"},
  {"id":54,"nombre":"Toalla de Papel","marca":"Nova","categoria":"Aseo del Hogar","descripcion":"Pack 2 rollos","precio":2390,"oferta":null,"stock":21,"stockCritico":10,"img":"/img/toalla-de-papel.svg"},
  {"id":55,"nombre":"Shampoo Reparación","marca":"Sedal","categoria":"Cuidado Personal","descripcion":"Botella 340 ml","precio":2790,"oferta":2290,"stock":58,"stockCritico":10,"img":"/img/shampoo-reparacion.svg"},
  {"id":56,"nombre":"Pasta Dental","marca":"Colgate","categoria":"Cuidado Personal","descripcion":"Tubo 90 gramos","precio":1590,"oferta":null,"stock":35,"stockCritico":10,"img":"/img/pasta-dental.svg"},
  {"id":57,"nombre":"Jabón en Barra","marca":"Dove","categoria":"Cuidado Personal","descripcion":"Pack 3 unidades","precio":3290,"oferta":null,"stock":12,"stockCritico":10,"img":"/img/jabon-en-barra.svg"},
];

export const CATEGORIAS_BASE = [
  {"id":1,"nombre":"Gaseosas","slug":"gaseosas","img":"/img/coca-cola.jpeg"},
  {"id":2,"nombre":"Lácteos","slug":"lacteos","img":"/img/leche-entera.jpeg"},
  {"id":3,"nombre":"Chocolates","slug":"chocolates","img":"/img/vicio.jpeg"},
  {"id":4,"nombre":"Desayuno y Once","slug":"desayuno-y-once","img":"/img/manjar.jpeg"},
  {"id":5,"nombre":"Galletas","slug":"galletas","img":"/img/triton.jpeg"},
  {"id":6,"nombre":"Snacks","slug":"snacks","img":"/img/ramitas-queso.jpeg"},
  {"id":7,"nombre":"Aguas y Jugos","slug":"aguas-y-jugos","img":"/img/agua-mineral-cachantun.svg"},
  {"id":8,"nombre":"Abarrotes","slug":"abarrotes","img":"/img/azucar-granulada.svg"},
  {"id":9,"nombre":"Conservas y Salsas","slug":"conservas-y-salsas","img":"/img/atun-lomito-en-aceite.svg"},
  {"id":10,"nombre":"Aseo del Hogar","slug":"aseo-del-hogar","img":"/img/detergente-en-polvo.svg"},
  {"id":11,"nombre":"Cuidado Personal","slug":"cuidado-personal","img":"/img/shampoo-reparacion.svg"},
];

export const USUARIOS_BASE = [
  { "id": 1, "rut": "11111111-1", "nombre": "Administrador", "apellido": "C&D", "correo": "admin@cyd.cl", "rol": "admin", "telefono": "912345678", "direccion": "Av. Esq. Blanca 501", "region": "Metropolitana de Santiago", "comuna": "Maipú", "fechaRegistro": "2026-08-01T12:00:00.000Z" },
  { "id": 2, "rut": "12345678-5", "nombre": "Ana", "apellido": "Soto", "correo": "ana@correo.cl", "rol": "cliente", "telefono": "987654321", "direccion": "Los Aromos 123", "region": "Metropolitana de Santiago", "comuna": "Maipú", "fechaRegistro": "2026-09-10T15:30:00.000Z" },
  { "id": 3, "rut": "9876543-3", "nombre": "Pedro", "apellido": "Rojas", "correo": "pedro@correo.cl", "rol": "cliente", "telefono": "956781234", "direccion": "Pajaritos 2200", "region": "Metropolitana de Santiago", "comuna": "Cerrillos", "fechaRegistro": "2026-10-02T10:00:00.000Z" }
];

export const ORDENES_BASE = [
  { "id": 1, "numero": 20261001, "fecha": "2026-10-05T14:20:00.000Z", "estado": "Pagada", "cliente": { "nombre": "Ana", "apellido": "Soto", "correo": "ana@correo.cl" }, "entrega": { "tipo": "domicilio", "calle": "Los Aromos 123", "departamento": "", "region": "Metropolitana de Santiago", "comuna": "Maipú", "indicaciones": "" }, "items": [ { "id": 1, "nombre": "Coca-Cola Original", "precio": 2190, "cantidad": 6 }, { "id": 9, "nombre": "Ramitas de Queso", "precio": 550, "cantidad": 10 } ], "subtotal": 18640, "despacho": 2990, "total": 21630 },
  { "id": 2, "numero": 20261002, "fecha": "2026-10-12T18:05:00.000Z", "estado": "Pagada", "cliente": { "nombre": "Pedro", "apellido": "Rojas", "correo": "pedro@correo.cl" }, "entrega": { "tipo": "retiro" }, "items": [ { "id": 6, "nombre": "Queso Gouda Trozo", "precio": 6990, "cantidad": 2 }, { "id": 2, "nombre": "Leche Entera", "precio": 990, "cantidad": 12 } ], "subtotal": 25860, "despacho": 0, "total": 25860 },
  { "id": 3, "numero": 20261003, "fecha": "2026-10-20T11:45:00.000Z", "estado": "Rechazada", "motivo": "Stock insuficiente de Galletas Morochas (quedaban 4).", "cliente": { "nombre": "Ana", "apellido": "Soto", "correo": "ana@correo.cl" }, "entrega": { "tipo": "retiro" }, "items": [ { "id": 10, "nombre": "Galletas Morochas", "precio": 450, "cantidad": 40 } ], "subtotal": 18000, "despacho": 0, "total": 18000 }
];
