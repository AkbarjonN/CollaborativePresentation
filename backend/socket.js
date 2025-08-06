const {
  presentations,
  createPresentation,
  getPresentation,
  updateUserRole,
  updatePresentationSlides,
} = require("./store");
const { randomUUID } = require("crypto");
const socketMap = {};
function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    socketMap[socket.id] = socket;
    console.log("🔌 New connection:", socket.id);

    socket.on("join-presentation", ({ presentationId, nickname, role }) => {
      socket.join(presentationId);

      let pres = getPresentation(presentationId);
      if (!pres && role === "creator") {
        createPresentation(presentationId, { id: socket.id, nickname });
        pres = getPresentation(presentationId);
      }

      if (!pres) {
        socket.emit("error", "Presentation not found");
        return;
      }

      pres.users[socket.id] = {
        id: socket.id,
        nickname,
        role: role === "creator" ? "creator" : "viewer",
      };

      socket.emit("presentation-data", {
        slides: pres.slides,
        users: Object.values(pres.users),
        myRole: pres.users[socket.id].role,
      });

      io.to(presentationId).emit("users-updated", Object.values(pres.users));
      io.to(presentationId).emit("slides-updated", pres.slides);

      socket.on("change-role", ({ userId, newRole }) => {
        updateUserRole(presentationId, userId, newRole);
        io.to(presentationId).emit("users-updated", Object.values(pres.users)); 

        const targetSocket = socketMap[userId];
        if (targetSocket) {
          targetSocket.emit("role-updated", newRole);
        }
      });

      socket.on("add-slide", () => {
        pres.slides.push({ blocks: [] });
        io.to(presentationId).emit("slides-updated", pres.slides);
      });

      socket.on("delete-slide", (index) => {
        if (index >= 0 && pres.slides.length > 1) {
          pres.slides.splice(index, 1);
          io.to(presentationId).emit("slides-updated", pres.slides);
        }
      });

      socket.on("update-slide", ({ index, updatedSlide }) => {
        pres.slides[index] = updatedSlide;
        io.to(presentationId).emit("slide-updated", { index, updatedSlide });
      });

      socket.on("leave-presentation", () => {
        socket.leave(presentationId);
        delete pres.users[socket.id];
        io.to(presentationId).emit("users-updated", Object.values(pres.users));
      });

      socket.on("disconnect", () => {
        delete socketMap[socket.id];
        if (pres?.users[socket.id]) {
          delete pres.users[socket.id];
          io.to(presentationId).emit(
            "users-updated",
            Object.values(pres.users)
          );
        }
      });
      socket.on("update-slide", ({ index, updatedSlide }) => {
        if (pres.slides[index]) {
          pres.slides[index] = updatedSlide;
          updatePresentationSlides(presentationId, pres.slides); 
          io.to(presentationId).emit("slide-updated", { index, updatedSlide });
        }
      });
    });
  });
}

module.exports = { setupSocketHandlers };
