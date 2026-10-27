/* MOCK de next/link para las pruebas: un <a> normal con el mismo href. */
export default function Link({ href, children, prefetch, replace, scroll, ...resto }) {
  const destino = typeof href === 'string' ? href : href?.pathname || '';
  return <a href={destino} {...resto}>{children}</a>;
}
