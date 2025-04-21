const router = require("express").Router();
const User = require('../models/user.js');
const List = require('../models/list.js');

// CREATE
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = new List({ title, email, body, user: existingUser });

    await list.save();

    existingUser.list.push(list);
    await existingUser.save();

    return res.status(200).json({ list });
  } catch (error) {
    console.error("Add task error:", error.message);
    return res.status(500).json({ message: "Server error while adding task" });
  }
});

// UPDATE
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTask = await List.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task updated", updatedTask });
  } catch (error) {
    console.error("Update task error:", error.message);
    return res.status(500).json({ message: "Server error while updating task" });
  }
});

// Delete
// DELETE
// DELETE
router.delete("/deleteTask/:id", async (req, res) => {
    try {
      const { email } = req.body;
      const { id } = req.params;
  
      // Remove task ID from the user's list array
      const existingUser = await User.findOneAndUpdate(
        { email },
        { $pull: { list: id } },
        { new: true }
      );
  
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Delete the task from the List collection
      const deletedTask = await List.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error.message);
      return res.status(500).json({ message: "Server error while deleting task" });
    }
  });

//   GetTask
router.get("/getTask/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find tasks by user and sort by creation date descending
      const list = await List.find({ user: id }).sort({ createdAt: -1 });
  
      if (!list.length) {
        return res.status(404).json({ message: "No tasks found for this user" });
      }
  
      return res.status(200).json({ list });
    } catch (error) {
      console.error("Get task error:", error.message);
      return res.status(500).json({ message: "Server error while fetching tasks" });
    }
  });
  
  

module.exports = router;
