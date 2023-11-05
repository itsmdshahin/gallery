import { useState } from "react";
import images from "../../data/images";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Gallery.scss";

import { Divider } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
import ImageIcon from '@mui/icons-material/Image';

const Gallery = () => {
  const [imagesAtGallery, setImagesAtGallery] = useState(images);
  const [selectedImages, setSelectedImages] = useState([]);
  // const fileInputRef = useRef(null);

  const toggleImageSelection = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  const onDeleteSelectedImages = () => {
    console.log("onDeleteSelectedImages it");
    // Remove selected images from the gallery
    setImagesAtGallery(
      imagesAtGallery.filter((image) => !selectedImages.includes(image.id))
    );
    // Clear the selection
    setSelectedImages([]);
  };

  const onDragEnd = (result) => {
    console.log("Hover it");
    if (!result.destination) {
      return; // No valid drop target
    }

    const items = Array.from(imagesAtGallery);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImagesAtGallery(items);
  };

  const handleMouseover = () => {
    console.log("Hover it");
  }

  const handleAddImage = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        // Create a new image object with the file data
        const newImage = {
          id: Date.now(), // You can generate a unique ID
          title: file.name,
          src: event.target.result,
        };

        // Update the state to add the new image to the gallery
        setImagesAtGallery([...imagesAtGallery, newImage]);
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className="gallery-container">
      <div className="selection-bar">
        <p> <span> {selectedImages.length !== 0 && <CheckBox {...label} defaultChecked color="primary" size="small" />}
          {selectedImages.length === 0
            ? "Gallery"
            : `${selectedImages.length} Files Selected`}  </span> </p>
        {selectedImages.length > 0 && selectedImages.length !== 1 && (
          <p className="selcetion-delete" onClick={onDeleteSelectedImages}>Delete Files</p>
        )}
        {selectedImages.length == 1 && (
          <p className="selcetion-delete" onClick={onDeleteSelectedImages}>Delete File</p>
        )}

      </div>
      <Divider />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid"
            >
              {imagesAtGallery.map((image, index) => {
                return (

                  <Draggable
                    key={image.id}
                    draggableId={`image-${image.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`grid-item ${index === 0 ? "feature-gallery" : ""
                          }`}
                      >

                        <div className="selected-images">
                          {selectedImages.includes(image.id) && selectedImages.length != 0 && (
                            <div className="image-checkbox">
                              <CheckBox {...label} defaultChecked color="primary" size="small" />
                            </div>
                          )}
                        </div>
                        <img
                          alt={image.title}
                          src={image.src}
                          onClick={() => toggleImageSelection(image.id)}
                        />


                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              {/* Add a file input for adding images/files */}
              <div className="imagecontainer" onChange={handleAddImage} >
                <div>
                  <ImageIcon />
                  <p className="add-text">Add Images</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Gallery;
