// components/FormNuevaIncidencia.tsx
export default function FormNuevaIncidencia() {
  return (
    <section class="form-box">
      <h2>Registrar nueva incidencia</h2>
      <p class="form-helper">
        Introduce la información clave de la incidencia. La prioridad alta asignará
        automáticamente un técnico principal.
      </p>
      <form method="POST">
        <div class="form-group">
          <label class="form-label" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            class="form-input"
            placeholder="Ej. Error en autenticación de usuarios"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            class="form-textarea"
            placeholder="Describe los síntomas, impacto y pasos realizados..."
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" htmlFor="prioridad">
            Prioridad
          </label>
          <select
            id="prioridad"
            name="prioridad"
            class="form-select"
            required
          >
            <option value="">Seleccionar prioridad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <button type="submit" class="form-button">
          ➕ Crear incidencia
        </button>
      </form>
    </section>
  );
}
