import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';

const EditProductPopup = ({
  isOpen,
  onClose,
  onSave,
  productId,
  productTitle,
  productAuther,
  productGenre,
  productPrice,
  productCountInStock,
  productImage,
  productDescription,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState('');
  const [rating, setRating] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [auther, setAuther] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

   useEffect(() => {
     setTitle(productTitle);
     setPrice(productPrice);
     setImageFile(null); // Reset the image file state when editing
     setRating(0);
     setCountInStock(productCountInStock);
     setAuther(productAuther);
     setGenre(productGenre);
     setDescription(productDescription);
   }, [
     isOpen,
     productTitle,
     productPrice,
     productCountInStock,
     productAuther,
     productGenre,
     productDescription,
   ]);
  const handleSave = () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('price', price);
    formData.append('ProductImage', imageFile);
    formData.append('rating', rating);
    formData.append('countInStock', countInStock);
    formData.append('genre', genre);
    formData.append('auther', auther);
    formData.append('description', description);

    onSave(formData);
    onClose();
  };
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0] || productImage;
    setImageFile(selectedFile);
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
          <h2 className="modal-title">Edit {productId}</h2>
        </div>
        <div className="modal-body">
          <div>Title</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Title"
            value={productTitle}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>Description</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Description"
            value={productDescription}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>Author</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Author"
            value={productAuther}
            onChange={(e) => setAuther(e.target.value)}
          />
          <div>Genre</div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Genre"
            value={productGenre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <div>Price In Cents</div>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Set price in cents"
            value={productPrice}
            onChange={(e) => setPrice(parseInt(e.target.value, 10))}
          />
          <div>Count In Stock</div>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Count In Stock"
            value={productCountInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />
          <input
            type="file"
            className="form-control-file mb-3"
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

export default EditProductPopup;
