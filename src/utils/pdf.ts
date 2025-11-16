import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildAlumnosHtml(alumnos: any[]) {
  const rows = alumnos.map(a => `
    <tr>
      <td>${escapeHtml(a.nombre)}</td>
      <td>${escapeHtml((a.apellido1 || '') + ' ' + (a.apellido2 || ''))}</td>
      <td>${escapeHtml(a.curso || '')}</td>
      <td>${escapeHtml((a.alergias || []).join(', '))}</td>
    </tr>
  `).join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #f6f6f6; text-align: left; }
          tr:nth-child(even) { background: #fafafa; }
        </style>
      </head>
      <body>
        <h1>Listado de alumnos - Colegio Zurbarán</h1>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Curso</th>
              <th>Alergias</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

export async function generateAlumnosPdf(alumnos: any[]) {
  const html = buildAlumnosHtml(alumnos);
  const { uri } = await Print.printToFileAsync({ html });
  // Move to documentDirectory for persistence
  const filename = `Alumnos_${new Date().toISOString().slice(0,10)}.pdf`;
  const dest = `${FileSystem.documentDirectory}${filename}`;
  try {
    await FileSystem.moveAsync({ from: uri, to: dest });
    return dest;
  } catch (e) {
    // If move fails, return original uri
    return uri;
  }
}
