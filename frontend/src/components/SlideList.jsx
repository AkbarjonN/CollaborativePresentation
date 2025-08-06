import React from 'react';

export default function SlideList({
  slides,
  currentSlideIndex,
  setCurrentSlideIndex,
  socket,
  role,
}) {
  const isCreator = role === 'creator';

  const addSlide = () => {
    socket.emit('add-slide');
  };

  const deleteSlide = (index) => {
    if (index === currentSlideIndex) setCurrentSlideIndex(0);
    socket.emit('delete-slide', index);
  };

  return (
    <div className="bg-white border-end p-2" style={{ width: '220px' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Slides</strong>
        {isCreator && (
          <button className="btn btn-sm btn-outline-primary" onClick={addSlide}>
            +
          </button>
        )}
      </div>
      <div className="list-group">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
              idx === currentSlideIndex ? 'active' : ''
            }`}
            onClick={() => setCurrentSlideIndex(idx)}
            style={{ cursor: 'pointer' }}
          >
            <span>Slide {idx + 1}</span>
            {isCreator && (
              <button
                className="btn btn-sm btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSlide(idx);
                }}
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}