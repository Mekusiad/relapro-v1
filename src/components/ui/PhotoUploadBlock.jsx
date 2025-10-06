import React from "react";
import { Trash2 } from "lucide-react";
import "../../styles/os-form.css";

/**
 * Componente para fazer upload, pré-visualizar e gerir fotos.
 * Adaptado para receber fotos do backend com 'fotoUrl' e fotos locais com 'preview'.
 * @param {object} props
 * @param {string} props.title - O título da secção (ex: "Antes do Serviço").
 * @param {string} props.name - O nome do campo, usado para identificar a categoria de fotos.
 * @param {Array<object>} props.photos - Array de objetos de fotos.
 * @param {Function} props.onPhotosChange - Função chamada quando as fotos são adicionadas ou removidas.
 * @param {Function} props.onPhotoDescriptionChange - Função chamada quando a descrição de uma foto muda.
 */
function PhotoUploadBlock({
  title,
  name,
  photos = [],
  onPhotosChange,
  onPhotoDescriptionChange,
  onPhotoRemove,
  onDescriptionBlur,
}) {
  // Função para lidar com a seleção de novos ficheiros
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Cria novos objetos de foto para pré-visualização
    const newPhotos = files.map((file) => ({
      // Adiciona um ID temporário para usar como key no React, evitando problemas de renderização
      id: `local-${Date.now()}-${Math.random()}`,
      file, // O objeto File real para o upload
      preview: URL.createObjectURL(file), // URL temporária para a imagem
      descricao: "",
    }));

    const updatedPhotos = [...photos, ...newPhotos];
    onPhotosChange(updatedPhotos, name);
  };

  return (
    <div className="photo-block">
      <h4>{title}</h4>
      <div className="form-group full-width">
        <div className="file-upload">
          <label htmlFor={`input-${name}`} className="btn-upload">
            <span className="material-icons">add_a_photo</span> Adicionar Fotos
          </label>
          <input
            type="file"
            id={`input-${name}`}
            name={name}
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <span>{photos.length} foto(s)</span>
        </div>
        <div id={`preview-${name}`} className="fotos-preview-grid">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <div key={photo.id} className="photo-preview-item">
                <div className="img-container">
                  {/* A fonte da imagem agora é `fotoUrl` (do backend) ou `preview` (local) */}
                  <img
                    src={photo.fotoUrl || photo.preview}
                    alt={`Foto ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => onPhotoRemove(photo, name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  className="photo-description"
                  placeholder="Descrição da foto..."
                  value={photo.descricao || ""}
                  // Chama a função passada por prop para atualizar a descrição
                  onChange={(e) =>
                    onPhotoDescriptionChange(photo.id, e.target.value, name)
                  }
                  onBlur={() => onDescriptionBlur(photo, name)}
                />
              </div>
            ))
          ) : (
            <p className="hint-details">Nenhuma foto adicionada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhotoUploadBlock;
