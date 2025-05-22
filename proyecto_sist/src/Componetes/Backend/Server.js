const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Añade esta línea
const db = require('./db');

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // o pon tu origen exacto en vez de "*"
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Añade esto para parsear multipart/form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Asegúrate que la carpeta uploads existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de multer (la tuya está bien)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Ruta para recibir datos del formulario
app.post('/api/documentos', upload.array('files'), (req, res) => {
  console.log('Solicitud recibida');
  console.log('Cuerpo:', req.body);
  console.log('Archivos:', req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No se subieron archivos' });
  }

  const { campo1, campo2, campo3, campo4 } = req.body;
  
  // Verifica que los campos lleguen
  if (!campo1 || !campo2 || !campo3 || !campo4) {
    // Limpia los archivos subidos
    req.files.forEach(file => {
      fs.unlinkSync(path.join(uploadsDir, file.filename));
    });
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const pdfPaths = req.files.map(file => `/uploads/${file.filename}`);

  const sql = `INSERT INTO documentosdigitalizados 
    (Id_documentos, fecha_creacion, fecha_ingresoalsistema, Nombre_usuario, url_pdf)
    VALUES (?, ?, ?, ?, ?)`;

  const values = [
    campo1,
    campo2,
    campo3,
    campo4,
    pdfPaths.join(';')
  ];

  console.log('Valores a insertar:', values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      // Elimina los archivos subidos
      req.files.forEach(file => {
        fs.unlinkSync(path.join(uploadsDir, file.filename));
      });
      return res.status(500).json({ 
        error: 'Error al guardar el documento.',
        details: err.message 
      });
    }
    res.json({ 
      message: 'Documento guardado exitosamente.', 
      urls: pdfPaths,
      id: result.insertId 
    });
  });
});

// Obtener todos los propietarios únicos
app.get('/api/propietarios', (req, res) => {
  const sql = 'SELECT DISTINCT Nombre_usuario FROM documentosdigitalizados ORDER BY Nombre_usuario';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener propietarios:', err);
      return res.status(500).json({ error: 'Error al obtener propietarios' });
    }
    const nombres = results.map(row => row.Nombre_usuario);
    console.log('Propietarios recibidos:', nombres);
    res.json(nombres);
  });
});

// Consultar documentos por propietario y rango de fechas
app.post('/api/consultar-documentos', (req, res) => {
  const { propietario, fechaInicio, fechaFinal } = req.body;
  console.log('Consulta recibida con:', req.body);
  if (!fechaInicio || !fechaFinal) {
    return res.status(400).json({ error: 'Debes enviar fechas de inicio y fin' });
  }

  // Armado dinámico de la consulta
  let sql = `SELECT * FROM documentosdigitalizados WHERE fecha_creacion BETWEEN ? AND ?`;
  const params = [fechaInicio, fechaFinal];

  if (propietario && propietario !== 'Todos') {
    sql += ` AND Nombre_usuario = ?`;
    params.push(propietario);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error al consultar documentos:', err);
      return res.status(500).json({ error: 'Error al consultar documentos' });
    }
    console.log(results);
    res.json(results);
  });
});


const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor backend corriendo en puerto ${PORT}`));