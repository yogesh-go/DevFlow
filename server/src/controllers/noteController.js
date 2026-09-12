const Note = require("../models/Note");
const { isValidObjectId } = require("../utils/validateObjectId");

const getNotes = async (req, res, next) => {
  try {
    const { search = "", tag = "", problemId = "" } = req.query;

    const filter = { user: req.user.userId };

    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { content: { $regex: escaped, $options: "i" } },
      ];
    }

    if (tag && tag.trim() !== "") {
      filter.tags = tag.trim();
    }

    if (problemId && isValidObjectId(problemId)) {
      filter.problem = problemId;
    }

    const notes = await Note.find(filter)
      .populate("problem", "title difficulty topic platform")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate("problem", "title difficulty topic platform problemUrl");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, problem } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const note = await Note.create({
      title,
      content: content || "",
      tags: parsedTags,
      problem: problem && isValidObjectId(problem) ? problem : null,
      user: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const { title, content, tags, problem } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) {
      note.tags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : note.tags;
    }
    if (problem !== undefined) {
      note.problem = problem && isValidObjectId(problem) ? problem : null;
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
