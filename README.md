This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



Actúa como arquitecto de software, analista funcional y desarrollador full stack senior.

Necesito revisar, corregir e implementar correctamente dentro de un mismo sistema tres flujos documentales específicos:

1. Certificados para estudiantes.
2. Contratos docentes.
3. Certificados para docentes.

No necesito informes, cartas, constancias, anexos ni documentos administrativos genéricos. Todo lo que no esté relacionado con certificados de estudiantes, contratos docentes y certificados docentes debe omitirse.

El sistema ya cuenta con una base de datos en MongoDB Atlas y puede tener pantallas, colecciones, servicios o componentes parcialmente desarrollados. Antes de crear algo nuevo, debes revisar la estructura existente, detectar qué ya sirve y luego integrar estos tres flujos correctamente, sin duplicar pantallas, colecciones, rutas ni lógica innecesaria.

OBJETIVO GENERAL

Implementar un sistema documental específico para:

* Generar certificados para estudiantes.
* Generar contratos docentes.
* Generar certificados para docentes.
* Corregir documentos cuando existan errores.
* Aprobar documentos antes de emisión final.
* Emitir PDF final.
* Guardar historial y versiones.
* Permitir descarga desde el panel correspondiente.
* Validar certificados mediante QR conectado a MongoDB Atlas.

Los certificados de estudiantes y certificados de docentes deben tener código único y QR validable públicamente.

Los contratos docentes deben manejar revisión, aprobación, emisión, descarga e historial, pero no requieren validación pública por QR en la primera versión.

ALCANCE REAL DEL SISTEMA

El sistema debe contemplar únicamente estos tres tipos:

1. Certificado de estudiante

Documento emitido a un alumno o participante por haber culminado, aprobado, asistido o participado en un curso, programa, diplomado, PAE, taller o evento certificable.

Debe incluir:

* Nombre completo del estudiante.
* Documento de identidad, si corresponde.
* Nombre del curso, programa o evento.
* Tipo de producto académico.
* Institución o marca emisora.
* Horas académicas.
* Fecha de emisión.
* Firma.
* Sello.
* Código único.
* QR de validación.
* URL pública de validación.
* Estado del certificado.

2. Contrato docente

Documento generado para formalizar la participación de un docente dentro de un curso, programa, diplomado, PAE, taller o servicio académico.

Debe incluir:

* Datos del docente.
* Documento de identidad.
* Correo.
* Teléfono.
* Curso o programa asignado.
* Rol del docente.
* Fechas de participación.
* Monto de pago u honorarios, si corresponde.
* Moneda.
* Obligaciones del docente.
* Condiciones de trabajo.
* Firma o aprobación institucional.
* Estado del contrato.
* Historial de versiones.

3. Certificado de docente

Documento emitido a un docente por su participación como expositor, ponente, capacitador, instructor, docente especialista o facilitador en un curso, programa, diplomado, PAE, taller o evento.

Debe incluir:

* Nombre completo del docente.
* Documento de identidad, si corresponde.
* Nombre del curso, programa o evento.
* Rol desempeñado.
* Institución o marca emisora.
* Horas dictadas o participación académica.
* Fecha de emisión.
* Firma.
* Sello.
* Código único.
* QR de validación.
* URL pública de validación.
* Estado del certificado.

TECNOLOGÍA

Usar la tecnología existente del proyecto. Si no está definida, usar la siguiente propuesta:

Frontend:

* React, Next.js o Vue, según el proyecto existente.
* Panel administrativo.
* Panel de estudiante.
* Panel de docente.
* Página pública de validación de certificados.
* Componentes reutilizables para tablas, formularios, filtros, modales, vista previa y descarga de PDF.

Backend:

* Node.js con Express o NestJS.
* API REST.
* Autenticación con JWT o sistema ya existente.
* Control de roles y permisos.
* Servicios separados para certificados, contratos docentes, plantillas, PDF, QR, validación, correcciones y auditoría.

Base de datos:

* MongoDB Atlas.
* Mongoose si se usa Node.js.
* Colecciones organizadas y relacionadas mediante ObjectId.
* Índices para código de certificado, usuario, docente, curso, estado, tipo de documento y fecha.

Generación de PDF:

* Puppeteer, Playwright, pdf-lib o librería equivalente.
* El PDF debe generarse desde una plantilla.
* La plantilla debe permitir insertar variables dinámicas.

Generación de QR:

* Usar una librería como qrcode o equivalente.
* El QR aplica para certificados de estudiantes y certificados de docentes.
* El QR debe contener una URL pública de validación.
* Ruta sugerida:
  /validar-certificado/{codigo}

Almacenamiento:

* Guardar metadatos en MongoDB Atlas.
* Guardar PDF generado en almacenamiento externo o servidor.
* Guardar en MongoDB la URL del PDF, código, estado, relaciones e historial.
* Evitar guardar archivos pesados directamente en MongoDB si no es necesario.

ROLES DEL SISTEMA

1. Administrador general:

   * Gestiona plantillas.
   * Genera certificados de estudiantes.
   * Genera contratos docentes.
   * Genera certificados docentes.
   * Corrige documentos.
   * Aprueba documentos.
   * Anula documentos.
   * Reemite documentos.
   * Revisa auditoría.

2. Administrador académico:

   * Configura cursos o programas certificables.
   * Valida datos académicos.
   * Valida horas.
   * Valida docentes asignados.
   * Autoriza emisión de certificados.

3. Área administrativa:

   * Genera contratos docentes.
   * Completa datos contractuales.
   * Envía contratos a revisión.
   * Descarga contratos emitidos.

4. Docente:

   * Visualiza sus contratos, si corresponde.
   * Descarga sus contratos, si está autorizado.
   * Visualiza y descarga sus certificados docentes.
   * Solicita corrección de datos si corresponde.

5. Estudiante:

   * Visualiza sus certificados.
   * Descarga sus certificados.
   * Copia enlace de validación.
   * Solicita corrección si existe error.

6. Visitante público:

   * Solo valida certificados mediante QR o código.
   * No accede a contratos docentes.
   * No accede a paneles internos.

PANTALLAS NECESARIAS

1. Panel administrativo - Gestión de certificados de estudiantes

Debe permitir:

* Listar certificados de estudiantes.
* Buscar por estudiante.
* Buscar por código de certificado.
* Filtrar por curso o programa.
* Filtrar por marca: CIIP LATAM, Geomina o Biomedic.
* Filtrar por estado.
* Filtrar por fecha.
* Emitir certificado manualmente.
* Emitir certificados masivamente.
* Ver certificado.
* Descargar PDF.
* Corregir certificado.
* Anular certificado.
* Reemitir certificado.
* Ver historial.

Estados sugeridos:

* Pendiente.
* Emitido.
* Corregido.
* Reemitido.
* Anulado.
* Reemplazado.
* Error de generación.

2. Panel administrativo - Gestión de contratos docentes

Debe permitir:

* Listar contratos docentes.
* Buscar por nombre de docente.
* Buscar por código de contrato.
* Filtrar por curso o programa.
* Filtrar por estado.
* Filtrar por fecha.
* Generar contrato docente.
* Ver contrato.
* Generar vista previa.
* Guardar como borrador.
* Enviar a revisión.
* Aprobar contrato.
* Observar contrato.
* Emitir PDF final.
* Descargar contrato.
* Anular contrato.
* Ver historial de versiones.

Estados sugeridos:

* Borrador.
* En revisión.
* Observado.
* Aprobado.
* Emitido.
* Anulado.
* Reemplazado.

3. Panel administrativo - Gestión de certificados docentes

Debe permitir:

* Listar certificados docentes.
* Buscar por docente.
* Buscar por código de certificado.
* Filtrar por curso o programa.
* Filtrar por rol del docente.
* Filtrar por estado.
* Filtrar por fecha.
* Emitir certificado docente.
* Ver certificado.
* Descargar PDF.
* Corregir certificado.
* Anular certificado.
* Reemitir certificado.
* Ver historial.

Estados sugeridos:

* Pendiente.
* Emitido.
* Corregido.
* Reemitido.
* Anulado.
* Reemplazado.
* Error de generación.

4. Pantalla de plantillas

Debe existir una pantalla para gestionar únicamente estas plantillas:

* Plantilla de certificado para estudiantes.
* Plantilla de contrato docente.
* Plantilla de certificado para docentes.

Debe permitir:

* Crear plantilla.
* Editar plantilla.
* Activar o desactivar plantilla.
* Asociar plantilla a una marca.
* Subir fondo.
* Subir logo.
* Subir firma.
* Subir sello.
* Configurar textos dinámicos.
* Generar vista previa.
* Generar PDF de prueba.

Variables para certificado de estudiante:

* {{nombreEstudiante}}
* {{documentoEstudiante}}
* {{nombreCursoPrograma}}
* {{tipoProducto}}
* {{marca}}
* {{institucionEmisora}}
* {{horasAcademicas}}
* {{fechaEmision}}
* {{codigoCertificado}}
* {{qrValidacion}}
* {{firma}}
* {{sello}}

Variables para contrato docente:

* {{nombreDocente}}
* {{documentoDocente}}
* {{correoDocente}}
* {{telefonoDocente}}
* {{nombreCursoPrograma}}
* {{rolDocente}}
* {{fechaInicio}}
* {{fechaFin}}
* {{montoHonorarios}}
* {{moneda}}
* {{condiciones}}
* {{obligaciones}}
* {{fechaContrato}}
* {{representanteInstitucional}}
* {{firma}}
* {{sello}}
* {{codigoContrato}}

Variables para certificado docente:

* {{nombreDocente}}
* {{documentoDocente}}
* {{nombreCursoPrograma}}
* {{rolDocente}}
* {{marca}}
* {{institucionEmisora}}
* {{horasDictadas}}
* {{fechaEmision}}
* {{codigoCertificado}}
* {{qrValidacion}}
* {{firma}}
* {{sello}}

5. Pantalla de configuración académica certificable

Dentro de la gestión de cursos, programas o productos debe agregarse una sección de certificación.

Debe permitir:

* Marcar si el curso o programa genera certificado para estudiantes.
* Marcar si el curso o programa genera certificado para docentes.
* Seleccionar plantilla de certificado de estudiante.
* Seleccionar plantilla de certificado docente.
* Definir horas académicas para estudiantes.
* Definir horas dictadas o reconocidas para docentes.
* Definir institución emisora.
* Definir firma y sello.
* Definir condiciones de emisión.

Condiciones para certificado de estudiante:

* Compra confirmada.
* Pago completo.
* Matrícula activa.
* Participación registrada.
* Asistencia mínima, si aplica.
* Aprobación manual, si aplica.
* Datos completos del estudiante.

Condiciones para certificado docente:

* Docente asignado al curso o programa.
* Participación confirmada.
* Sesiones dictadas registradas, si aplica.
* Aprobación administrativa.
* Datos completos del docente.

6. Panel del estudiante - Mis certificados

Debe mostrar:

* Nombre del certificado.
* Curso o programa.
* Fecha de emisión.
* Estado.
* Código único.
* Botón para ver.
* Botón para descargar PDF.
* Botón para copiar enlace de validación.
* Botón para solicitar corrección.

El estudiante no puede editar directamente el certificado.

7. Panel del docente - Mis contratos y certificados

Debe mostrar dos secciones:

A. Mis contratos docentes

* Nombre del contrato.
* Curso o programa relacionado.
* Fecha.
* Estado.
* Botón para ver.
* Botón para descargar, si está emitido.

B. Mis certificados docentes

* Nombre del certificado.
* Curso o programa relacionado.
* Rol desempeñado.
* Fecha de emisión.
* Estado.
* Código único.
* Botón para ver.
* Botón para descargar PDF.
* Botón para copiar enlace de validación.
* Botón para solicitar corrección.

El docente no puede modificar directamente contratos ni certificados.

8. Página pública de validación de certificados

Esta página solo valida certificados, no contratos.

Rutas sugeridas:

/validar-certificado
/validar-certificado/{codigo}

Debe permitir:

* Validar por QR.
* Validar por código manual.
* Consultar MongoDB Atlas.
* Mostrar resultado claro.

Si es certificado de estudiante válido, mostrar:

* Certificado válido.
* Nombre del estudiante.
* Curso o programa.
* Institución emisora.
* Marca.
* Fecha de emisión.
* Código.
* Estado.

Si es certificado docente válido, mostrar:

* Certificado válido.
* Nombre del docente.
* Curso o programa.
* Rol desempeñado.
* Institución emisora.
* Marca.
* Fecha de emisión.
* Código.
* Estado.

Si está anulado, mostrar:

* Certificado anulado.
* Mensaje de advertencia.

Si fue reemplazado, mostrar:

* Certificado reemplazado por una nueva versión.

Si no existe, mostrar:

* Certificado no encontrado.

No mostrar correo, teléfono, DNI completo ni datos sensibles.

MODELO DE DATOS EN MONGODB ATLAS

Revisar primero las colecciones existentes. Si ya existen usuarios, docentes, cursos, productos o compras, reutilizarlas.

Colección: users

Debe representar estudiantes, docentes, administradores y otros roles, si el sistema ya lo maneja así.

Campos sugeridos:

{
_id: ObjectId,
nombres: String,
apellidos: String,
nombreCompleto: String,
email: String,
documento: String,
telefono: String,
pais: String,
rol: String,
estado: String,
createdAt: Date,
updatedAt: Date
}

Colección: courses o products

Debe representar cursos, programas, diplomados, PAES, talleres o eventos.

Campos sugeridos:

{
_id: ObjectId,
nombre: String,
slug: String,
marcaId: ObjectId,
tipoProducto: String,
modalidad: String,
generaCertificadoEstudiante: Boolean,
generaCertificadoDocente: Boolean,
plantillaCertificadoEstudianteId: ObjectId,
plantillaCertificadoDocenteId: ObjectId,
horasAcademicasEstudiante: Number,
horasAcademicasDocente: Number,
institucionEmisora: String,
estado: String,
createdAt: Date,
updatedAt: Date
}

Colección: enrollments o purchases

Debe relacionar estudiantes con cursos o programas.

Campos sugeridos:

{
_id: ObjectId,
studentId: ObjectId,
productId: ObjectId,
estadoPago: String,
estadoMatricula: String,
montoPagado: Number,
moneda: String,
fechaCompra: Date,
createdAt: Date,
updatedAt: Date
}

Colección: teacherAssignments

Debe relacionar docentes con cursos o programas.

Campos sugeridos:

{
_id: ObjectId,
teacherId: ObjectId,
productId: ObjectId,
rolDocente: String,
fechaInicio: Date,
fechaFin: Date,
horasDictadas: Number,
estadoParticipacion: String,
estadoPagoDocente: String,
createdAt: Date,
updatedAt: Date
}

Colección: documentTemplates

Debe guardar solo las plantillas necesarias.

Campos sugeridos:

{
_id: ObjectId,
nombre: String,
tipoPlantilla: String,
marcaId: ObjectId,
htmlTemplate: String,
cssTemplate: String,
fondoUrl: String,
logoUrl: String,
firmaUrl: String,
selloUrl: String,
incluyeQR: Boolean,
variables: [String],
estado: String,
createdBy: ObjectId,
updatedBy: ObjectId,
createdAt: Date,
updatedAt: Date
}

Valores permitidos para tipoPlantilla:

* student_certificate
* teacher_contract
* teacher_certificate

Colección: certificates

Debe guardar certificados de estudiantes y docentes.

Campos sugeridos:

{
_id: ObjectId,
codigoCertificado: String,
tipoCertificado: String,
userId: ObjectId,
productId: ObjectId,
enrollmentId: ObjectId,
teacherAssignmentId: ObjectId,
templateId: ObjectId,
marcaId: ObjectId,
datosPersona: Object,
datosCursoPrograma: Object,
datosInstitucionales: Object,
qrUrl: String,
validationUrl: String,
pdfUrl: String,
fechaEmision: Date,
estado: String,
version: Number,
certificadoOriginalId: ObjectId,
reemplazadoPorId: ObjectId,
motivoCorreccion: String,
motivoAnulacion: String,
emitidoPor: ObjectId,
corregidoPor: ObjectId,
anuladoPor: ObjectId,
createdAt: Date,
updatedAt: Date
}

Valores permitidos para tipoCertificado:

* student_certificate
* teacher_certificate

Estados permitidos:

* pending
* issued
* corrected
* reissued
* cancelled
* replaced
* generation_error

Colección: teacherContracts

Debe guardar contratos docentes.

Campos sugeridos:

{
_id: ObjectId,
codigoContrato: String,
teacherId: ObjectId,
productId: ObjectId,
teacherAssignmentId: ObjectId,
templateId: ObjectId,
marcaId: ObjectId,
datosDocente: Object,
datosCursoPrograma: Object,
datosContrato: Object,
pdfUrl: String,
estado: String,
version: Number,
contratoOriginalId: ObjectId,
reemplazadoPorId: ObjectId,
motivoCorreccion: String,
motivoAnulacion: String,
aprobadoPor: ObjectId,
emitidoPor: ObjectId,
anuladoPor: ObjectId,
createdAt: Date,
updatedAt: Date
}

Estados permitidos:

* draft
* in_review
* observed
* approved
* issued
* cancelled
* replaced

Colección: correctionRequests

Debe guardar solicitudes de corrección para certificados y contratos.

Campos sugeridos:

{
_id: ObjectId,
documentType: String,
documentId: ObjectId,
solicitadoPor: ObjectId,
descripcion: String,
camposSolicitados: [
{
campo: String,
valorActual: String,
valorSolicitado: String
}
],
estado: String,
revisadoPor: ObjectId,
fechaRevision: Date,
observacionesAdmin: String,
createdAt: Date,
updatedAt: Date
}

Valores permitidos para documentType:

* student_certificate
* teacher_certificate
* teacher_contract

Colección: auditLogs

Debe registrar acciones críticas.

Campos sugeridos:

{
_id: ObjectId,
documentType: String,
documentId: ObjectId,
accion: String,
descripcion: String,
realizadoPor: ObjectId,
rol: String,
metadata: Object,
ip: String,
userAgent: String,
createdAt: Date
}

ÍNDICES RECOMENDADOS

Crear índices para:

* certificates.codigoCertificado único.
* certificates.tipoCertificado.
* certificates.userId.
* certificates.productId.
* certificates.estado.
* teacherContracts.codigoContrato único.
* teacherContracts.teacherId.
* teacherContracts.productId.
* teacherContracts.estado.
* teacherAssignments.teacherId.
* teacherAssignments.productId.
* documentTemplates.tipoPlantilla.
* correctionRequests.documentType.
* correctionRequests.estado.

ENDPOINTS REQUERIDOS

Certificados de estudiantes:

GET /api/student-certificates
GET /api/student-certificates/:id
POST /api/student-certificates/issue
POST /api/student-certificates/bulk-issue
PUT /api/student-certificates/:id/correct
PUT /api/student-certificates/:id/cancel
POST /api/student-certificates/:id/reissue
GET /api/student-certificates/:id/download

Certificados docentes:

GET /api/teacher-certificates
GET /api/teacher-certificates/:id
POST /api/teacher-certificates/issue
PUT /api/teacher-certificates/:id/correct
PUT /api/teacher-certificates/:id/cancel
POST /api/teacher-certificates/:id/reissue
GET /api/teacher-certificates/:id/download

Contratos docentes:

GET /api/teacher-contracts
GET /api/teacher-contracts/:id
POST /api/teacher-contracts/generate
PUT /api/teacher-contracts/:id/update-draft
PUT /api/teacher-contracts/:id/send-review
PUT /api/teacher-contracts/:id/observe
PUT /api/teacher-contracts/:id/approve
PUT /api/teacher-contracts/:id/issue
PUT /api/teacher-contracts/:id/cancel
GET /api/teacher-contracts/:id/download

Plantillas:

GET /api/document-templates
POST /api/document-templates
GET /api/document-templates/:id
PUT /api/document-templates/:id
DELETE /api/document-templates/:id
POST /api/document-templates/:id/preview
POST /api/document-templates/:id/test-pdf

Paneles:

GET /api/me/student-certificates
GET /api/me/teacher-certificates
GET /api/me/teacher-contracts

Validación pública:

GET /api/public/certificates/validate/:codigo

Configuración académica:

PUT /api/products/:id/certification-settings
GET /api/products/certifiable
GET /api/teacher-assignments
POST /api/teacher-assignments
PUT /api/teacher-assignments/:id

FLUJO DE CERTIFICADO PARA ESTUDIANTE

1. El administrador configura un curso o programa como certificable para estudiantes.
2. Se asocia una plantilla de certificado de estudiante.
3. El estudiante compra o es matriculado en el curso o programa.
4. El sistema valida condiciones: pago, matrícula, participación o aprobación manual.
5. El administrador emite el certificado o el sistema lo emite automáticamente si está habilitado.
6. El sistema genera código único.
7. El sistema genera URL pública de validación.
8. El sistema genera QR.
9. El sistema inserta código y QR en el PDF.
10. El sistema guarda el certificado en MongoDB Atlas.
11. El estudiante ve el certificado en su panel.
12. El estudiante descarga el PDF.
13. Un tercero escanea el QR.
14. El sistema valida el certificado contra MongoDB Atlas.

FLUJO DE CONTRATO DOCENTE

1. El administrador registra o selecciona al docente.
2. El administrador asigna al docente a un curso o programa.
3. El sistema carga los datos del docente y del curso.
4. El administrador selecciona la plantilla de contrato docente.
5. El sistema genera vista previa del contrato.
6. El contrato se guarda como borrador.
7. El contrato pasa a revisión.
8. El revisor aprueba u observa.
9. Si se observa, se corrige y queda historial.
10. Si se aprueba, se emite PDF final.
11. El contrato queda guardado en MongoDB Atlas.
12. El administrador puede descargarlo.
13. El docente puede visualizarlo o descargarlo si se le da permiso.
14. El contrato emitido no se sobrescribe; cualquier cambio genera nueva versión.

FLUJO DE CERTIFICADO DOCENTE

1. El administrador registra o selecciona al docente.
2. El docente queda asociado a un curso o programa.
3. El sistema valida su participación o rol académico.
4. El administrador selecciona la plantilla de certificado docente.
5. El sistema carga datos del docente, curso, rol y horas dictadas.
6. El administrador genera vista previa.
7. Se emite el certificado.
8. El sistema genera código único.
9. El sistema genera URL pública de validación.
10. El sistema genera QR.
11. El sistema inserta QR y código en el PDF.
12. El sistema guarda el certificado en MongoDB Atlas.
13. El docente ve el certificado en su panel.
14. El docente descarga el PDF.
15. Un tercero puede validar el QR contra MongoDB Atlas.

FLUJO DE CORRECCIÓN

1. Estudiante, docente o administrador detecta un error.
2. Se crea una solicitud de corrección.
3. El administrador revisa la solicitud.
4. Se aprueba o rechaza.
5. Si se aprueba, se genera nueva versión del certificado o contrato.
6. El documento anterior no se elimina.
7. Se registra motivo de corrección.
8. Se actualiza el PDF.
9. Se registra auditoría.
10. El usuario ve la nueva versión disponible.

REGLAS DE NEGOCIO

1. El sistema solo manejará certificados de estudiantes, contratos docentes y certificados docentes.
2. No implementar informes, cartas, constancias ni anexos.
3. Los certificados de estudiantes deben tener QR.
4. Los certificados docentes deben tener QR.
5. Los contratos docentes no requieren QR público en la primera versión.
6. Todo certificado debe tener código único.
7. Todo contrato docente debe tener código interno único.
8. Todo certificado debe validar contra MongoDB Atlas.
9. La validación pública solo aplica a certificados.
10. La validación pública no debe mostrar datos sensibles.
11. Un certificado emitido no debe eliminarse; solo corregirse, anularse o reemplazarse.
12. Un contrato emitido no debe sobrescribirse; cualquier cambio genera nueva versión.
13. Toda corrección debe quedar registrada.
14. Toda anulación debe quedar registrada.
15. Solo usuarios autorizados pueden emitir, aprobar, corregir o anular.
16. Los datos deben cargarse desde MongoDB Atlas.
17. Los datos faltantes pueden completarse manualmente antes de emitir.
18. No deben generarse certificados duplicados para la misma matrícula o asignación docente, salvo reemisión controlada.
19. No deben generarse contratos duplicados para la misma asignación docente, salvo nueva versión.
20. Todas las acciones críticas deben registrarse en auditoría.

QUÉ SE DEBE OMITIR

No implementar:

* Informes.
* Cartas.
* Constancias.
* Anexos.
* Documentos administrativos genéricos.
* Editor tipo Canva.
* Blockchain.
* Firma digital legal avanzada.
* Validación pública para contratos docentes.
* Edición directa de documentos emitidos.
* Eliminación definitiva de documentos emitidos.
* Publicación de datos sensibles.
* Sistemas separados para cada flujo.

CRITERIOS DE ACEPTACIÓN

El desarrollo se considera terminado cuando:

1. El administrador puede generar certificados para estudiantes.
2. El administrador puede generar contratos docentes.
3. El administrador puede generar certificados para docentes.
4. Existen plantillas separadas para los tres tipos.
5. El sistema carga datos desde MongoDB Atlas.
6. El sistema permite completar datos faltantes.
7. El sistema genera vista previa.
8. El sistema genera PDF final.
9. Los certificados de estudiantes tienen código único y QR.
10. Los certificados docentes tienen código único y QR.
11. El QR valida contra MongoDB Atlas.
12. La página pública muestra si el certificado es válido, anulado, reemplazado o no encontrado.
13. El estudiante puede descargar sus certificados.
14. El docente puede descargar sus certificados.
15. El docente puede ver o descargar sus contratos si tiene permiso.
16. El administrador puede corregir, anular y reemitir.
17. El sistema guarda historial de versiones.
18. El sistema registra auditoría.
19. No hay informes, cartas ni módulos innecesarios.
20. Todo queda integrado al sistema existente.

ENTREGABLE FINAL

Entregar dentro del mismo sistema un módulo específico para certificados de estudiantes, contratos docentes y certificados docentes, conectado a MongoDB Atlas, con plantillas dinámicas, generación PDF, QR validable para certificados, revisión y aprobación de contratos docentes, correcciones, anulaciones, historial de versiones, auditoría, panel administrativo, panel de estudiante, panel de docente, endpoints backend, modelos de base de datos, componentes frontend, pruebas funcionales y documentación breve de uso.
