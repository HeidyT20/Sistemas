import styles from './Document.module.css';

export default function Document({ documentos }) {
  return (
    <div className={styles.contenedor}>
      {documentos.map((doc) => (
        <div key={doc.id} className={styles.card}>
          <embed
            src={`http://localhost:3001${doc.url_pdf}#page=1&zoom=75`}
            type="application/pdf"
            className={styles.miniatura}
          />
          <div className={styles.info}>
            <p>ID Documento: {doc.Id_documentos || 'Sin número'}</p>
            <h3>{doc.Nombre_usuario || 'Sin nombre'}</h3>
            <p>Fecha: {doc.fecha_creacion ? new Date(doc.fecha_creacion).toLocaleDateString() : 'Sin fecha'}</p>
            <div className={styles.botones}>
              <a
                href={`http://localhost:3001${doc.url_pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.botonVer}
              >
                Ver
              </a>
              {doc.url_pdf.split(';').map((url, index) => (
              <a
              key={index}
              href={`http://localhost:3001${url}`}
              download={`documento_${doc.Id_documentos || 'sin_id'}_${index + 1}.pdf`}
              className={styles.botonDescargar}
                >
                Descargar {index + 1}
              </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
