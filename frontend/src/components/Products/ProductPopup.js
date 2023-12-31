import React, { useState } from 'react';
import Modal from 'react-modal';

const ProductPopup = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  //const [imageFile, setImageFile] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [countInStock, setCountInStock] = useState(0);
  const [auther, setAuther] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('price', price);
    //formData.append("ProductImage", imageFile);

    formData.append('countInStock', countInStock);
    formData.append('genre', genre);
    formData.append('auther', auther);
    formData.append('description', description);
    // Append all selected image files to the FormData
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('ProductImage', imageFiles[i]);
    }

    onSave(formData);
    onClose();
  };
  // const handleImageChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setImageFile(selectedFile);
  // };
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImageFiles(selectedFiles);
  };
  const customStyles = {
    content: {
      backgroundColor: '#FFFF', // Set the background color to white
      top: '50%', // Center vertically

      transform: 'translateY(-50%)', // Adjust vertical positioning
    },
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-dialog modal-lg"
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add New Product</h2>
        </div>
        <div className="modal-body">
          <div>Title</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>Description</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>Author</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Author"
            value={auther}
            onChange={(e) => setAuther(e.target.value)}
          />
          <div>Genre</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <div>Price</div>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Set price in cents"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <div>CountInStock</div>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Count In Stock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />
          {/* <input
            type="file"
            className="form-control-file mb-3"
            onChange={handleImageChange}
          /> */}
          <input
            type="file"
            className="form-control-file mb-3"
            multiple // Allow multiple file selection
            onChange={handleImageChange}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductPopup;
