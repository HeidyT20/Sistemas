import React from 'react';

const Pagination = ({ total, porPagina, paginaActual, setPaginaActual }) => {
  const totalPaginas = Math.ceil(total / porPagina);

  const irPrimera = () => setPaginaActual(1);
  const irAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));
  const irSiguiente = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  const irUltima = () => setPaginaActual(totalPaginas);

  if (totalPaginas <= 1) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={irPrimera} disabled={paginaActual === 1}>{'<<'}</button>
      <button onClick={irAnterior} disabled={paginaActual === 1}>{'<'}</button>
      <span style={{ margin: '0 10px' }}>
        Página {paginaActual} de {totalPaginas}
      </span>
      <button onClick={irSiguiente} disabled={paginaActual === totalPaginas}>{'>'}</button>
      <button onClick={irUltima} disabled={paginaActual === totalPaginas}>{'>>'}</button>
    </div>
  );
};

export default Pagination;
