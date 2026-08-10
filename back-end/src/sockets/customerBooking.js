import {holdSlot, deleteSlotHold} from "../controllers/bookingController.js";

export const customerBooking = (socket, io) => {
    socket.on("hold_slot", async (payload) => {
        try {
            const result = await holdSlot(payload);

            socket.emit("hold_success",result);

            socket.emit("slot_updated", {
                fieldId: payload.fieldId,
                bookingDate: payload.bookingDate?.split("T")[0],
                slotId: payload.slotId,
                status: "HOLD",
                isMyHold: true,
            });

        } catch (err) {
            socket.emit("hold_error", {
                message: err.message,
            });
        }
    });
    socket.on("delete_hold", async (payload) => {
        try {
            await deleteSlotHold(payload);

            socket.emit("delete_hold_success");

            io.emit("slot_updated", {
                fieldId: payload.fieldId,
                bookingDate: payload.bookingDate?.split("T")[0],
                slotId: payload.slotId,
                status: "AVAILABLE",
                isMyHold: false,
            });

        } catch (err) {
            socket.emit("delete_hold_error", {
                message: err.message,
            });
        }
    });
}