import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SlideEditor({ slide, slideIndex, socket, role }) {
  const [blocks, setBlocks] = useState(slide.blocks || []);
  const isEditable = role === "editor" || role === "creator";

  useEffect(() => {
    setBlocks(slide.blocks || []);
  }, [slide]);

  useEffect(() => {
    socket.on("slide-updated", ({ index, updatedSlide }) => {
      if (index === slideIndex) {
        setBlocks(updatedSlide.blocks);
      }
    });

    return () => {
      socket.off("slide-updated");
    };
  }, [socket, slideIndex]);

  const updateServer = (newBlocks) => {
    const updatedSlide = { ...slide, blocks: newBlocks };
    socket.emit("update-slide", { index: slideIndex, updatedSlide });
  };

  const addBlock = () => {
    const newBlock = {
      id: Date.now(),
      content: "## New Block",
      x: 50,
      y: 50,
      width: 300,
      height: 120,
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    updateServer(newBlocks);
  };

  const updateBlock = (id, newContent) => {
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, content: newContent } : b
    );
    setBlocks(newBlocks);
    updateServer(newBlocks);
  };

  const moveBlock = (id, x, y) => {
    const newBlocks = blocks.map((b) => (b.id === id ? { ...b, x, y } : b));
    setBlocks(newBlocks);
    updateServer(newBlocks);
  };

  const resizeBlock = (id, width, height) => {
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, width, height } : b
    );
    setBlocks(newBlocks);
    updateServer(newBlocks);
  };

  return (
    <div
      className="position-relative w-100 h-100 bg-white"
      style={{ minHeight: "100%" }}
    >
      {isEditable && (
        <button
          type="button"
          className="btn btn-sm btn-success m-2"
          onClick={addBlock}
        >
          ➕ Add Block
        </button>
      )}
      {blocks.map((block) => (
        <Rnd
          key={block.id}
          default={{
            x: block.x,
            y: block.y,
            width: block.width || 300,
            height: block.height || 120,
          }}
          disableDragging={!isEditable}
          enableResizing={isEditable}
          bounds="parent"
          onDragStop={(_, d) => moveBlock(block.id, d.x, d.y)}
          onResizeStop={(_, ref, position) => {
            resizeBlock(block.id, ref.offsetWidth, ref.offsetHeight);
            moveBlock(block.id, position.x, position.y);
          }}
          minWidth={100} 
          minHeight={60} 
        >
          <div className="bg-light p-2 border rounded shadow-sm">
            {isEditable ? (
              <textarea
                className="form-control"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                style={{ height: "100px" }}
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {block.content || ""}
              </ReactMarkdown>
            )}
          </div>
        </Rnd>
      ))}
    </div>
  );
}

