import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSize = 5
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidSize = file.size <= maxSize * 1024 * 1024;
      const isValidType = file.type.startsWith('image/');
      
      if (!isValidSize) {
        alert(`${file.name} é muito grande. Máximo ${maxSize}MB.`);
        return false;
      }
      
      if (!isValidType) {
        alert(`${file.name} não é uma imagem válida.`);
        return false;
      }
      
      return true;
    });

    const totalImages = images.length + validFiles.length;
    if (totalImages > maxImages) {
      alert(`Máximo ${maxImages} imagens permitidas.`);
      return;
    }

    onImagesChange([...images, ...validFiles]);
  }, [images, maxImages, maxSize, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600">
          {isDragActive ? (
            <p>Solte as imagens aqui...</p>
          ) : (
            <>
              <p className="text-lg font-medium mb-2">
                Clique ou arraste imagens para fazer upload
              </p>
              <p className="text-sm">
                Máximo {maxImages} imagens, até {maxSize}MB cada
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formatos: JPEG, PNG, WebP
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={getImagePreview(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate">{image.name}</p>
                  <p>{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Info */}
      <div className="text-sm text-gray-600">
        {images.length} de {maxImages} imagens carregadas
      </div>
    </div>
  );
};

export default ImageUpload;

