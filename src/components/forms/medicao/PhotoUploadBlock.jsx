// src/components/ui/PhotoUploadBlock.jsx - VERSÃO FINAL E CORRIGIDA

import React from 'react';
import "../../styles/os-form.css";

function PhotoUploadBlock({ 
  title, 
  name, 
  photos = [], 
  onPhotosChange, 
  onPhotoDescriptionChange, 
  onPhotoRemove, 
  onDescriptionBlur  }) {

     const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Cria objetos para as novas fotos
        const newPhotos = files.map(file => ({
            id: `local-${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            descricao: '' // Usa 'descricao' para consistência
        }));
        
        // Informa o componente pai sobre as novas fotos a serem adicionadas
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
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <span>{photos.length} foto(s)</span>
                </div>
                <div id={`preview-${name}`} className="fotos-preview-grid">
                    {photos.length > 0 ? (
                        photos.map((photo) => (
                            <div key={photo.id} className="photo-preview-item">
                                <div className="img-container">
                                    {/* Exibe a foto da URL do backend ou o preview local */}
                                    <img src={photo.fotoUrl || photo.preview} alt="Preview" />
                                    <button 
                                        type="button" 
                                        className="remove-img-btn" 
                                        // Chama a função onPhotoRemove passada pelo pai
                                        onClick={() => onPhotoRemove(photo, name)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="photo-description"
                                    placeholder="Descrição da foto..."
                                    value={photo.descricao || ''}
                                    // Chama a função onPhotoDescriptionChange passada pelo pai
                                    onChange={(e) => onPhotoDescriptionChange(photo.id, e.target.value, name)}
                                    // Chama a função onDescriptionBlur passada pelo pai
                                    onBlur={() => onDescriptionBlur(photo, name)}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="hint-details">Nenhuma foto selecionada.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PhotoUploadBlock;